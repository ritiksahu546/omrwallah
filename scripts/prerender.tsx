import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { BASE_URL, DEFAULT_OG_IMAGE, PUBLIC_SITEMAP_ROUTES, buildStructuredDataJson } from '../src/utils/seo';
import { getRouteSEO } from '../src/utils/seoConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');

// ---------------------------------------------------------------------------
// 1. Minimal Browser Environment Shims for Node.js Build-Time SSG
// ---------------------------------------------------------------------------
function setupBrowserShims(currentPathname = '/') {
  const storageMap = new Map<string, string>();
  const mockStorage: Storage = {
    get length() {
      return storageMap.size;
    },
    clear: () => storageMap.clear(),
    getItem: (key: string) => storageMap.get(key) ?? null,
    key: (index: number) => Array.from(storageMap.keys())[index] ?? null,
    removeItem: (key: string) => {
      storageMap.delete(key);
    },
    setItem: (key: string, value: string) => {
      storageMap.set(key, String(value));
    },
  };

  const g = globalThis as Record<string, unknown>;

  g.location = {
    origin: BASE_URL,
    href: `${BASE_URL}${currentPathname}`,
    pathname: currentPathname,
    search: '',
    hash: '',
  };
  g.history = {
    pushState: () => {},
    replaceState: () => {},
  };
  g.innerWidth = 1280;
  g.innerHeight = 800;
  g.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  });
  g.addEventListener = () => {};
  g.removeEventListener = () => {};
  g.scrollTo = () => {};
  g.confirm = () => false;
  g.print = () => {};
  g.localStorage = mockStorage;
  g.sessionStorage = mockStorage;
  g.window = globalThis;
  g.self = globalThis;

  if (typeof globalThis.document === 'undefined') {
    g.document = {
      title: '',
      head: { appendChild: () => {} },
      body: { appendChild: () => {}, removeChild: () => {} },
      querySelector: () => null,
      getElementById: () => null,
      createElement: () => ({
        setAttribute: () => {},
        style: {},
        appendChild: () => {},
      }),
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  }
}

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ---------------------------------------------------------------------------
// 2. Automated Sitemap XML Generator
// ---------------------------------------------------------------------------
export function generateSitemapXml(): string {
  const today = new Date().toISOString().split('T')[0];

  const urlNodes = PUBLIC_SITEMAP_ROUTES.map((route) => {
    const loc = route.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${route.path}`;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      '  </url>',
    ].join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlNodes,
    '</urlset>',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// 3. Inject Route-Specific SEO Metadata & Pre-Rendered HTML into Template
// ---------------------------------------------------------------------------
function injectSeoAndHtml(templateHtml: string, routeKey: string, appHtml: string): string {
  const seo = getRouteSEO(routeKey);
  const canonicalUrl = seo.canonicalPath
    ? seo.canonicalPath.startsWith('http')
      ? seo.canonicalPath
      : `${BASE_URL}${seo.canonicalPath}`
    : BASE_URL;

  const safeTitle = escapeHtmlAttr(seo.title);
  const safeDesc = escapeHtmlAttr(seo.description);
  const ogImage = escapeHtmlAttr(seo.image || DEFAULT_OG_IMAGE);
  const robotsContent = seo.noindex ? 'noindex, nofollow' : 'index, follow';
  const structuredDataJson = buildStructuredDataJson(seo, canonicalUrl);

  let html = templateHtml;

  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);

  // Replace or inject meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${safeDesc}" />`
  );

  // Replace canonical URL
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Replace Open Graph tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${ogImage}" />`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );

  // Inject robots meta & Schema.org JSON-LD right before </head>
  const headInjection = [
    `    <meta name="robots" content="${robotsContent}" />`,
    `    <script id="omrwallah-schema-jsonld" type="application/ld+json">${structuredDataJson}</script>`,
    '  </head>',
  ].join('\n');

  html = html.replace(/<\/head>/i, headInjection);

  // Inject pre-rendered React HTML into <div id="root"></div>
  html = html.replace(
    /<div\s+id="root"\s*><\/div>/i,
    `<div id="root">${appHtml}</div>`
  );

  return html;
}

// ---------------------------------------------------------------------------
// 4. Main Build-Time SSG & Sitemap Pipeline
// ---------------------------------------------------------------------------
async function runPrerender() {
  const isSitemapOnly = process.argv.includes('--sitemap-only');

  // Always generate sitemap.xml in public/ and dist/ (if dist exists)
  const sitemapXml = generateSitemapXml();
  if (fs.existsSync(PUBLIC_DIR)) {
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  }
  if (fs.existsSync(DIST_DIR)) {
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  }
  console.log(`[SEO] Generated sitemap.xml with ${PUBLIC_SITEMAP_ROUTES.length} routes.`);

  if (isSitemapOnly) {
    process.exit(0);
  }

  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('[SSG] dist/index.html not found. Run "vite build" before prerendering.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(templatePath, 'utf-8');

  setupBrowserShims('/');
  const { default: App } = await import('../src/App');

  let renderedCount = 0;

  for (const route of PUBLIC_SITEMAP_ROUTES) {
    setupBrowserShims(route.path);

    const appHtml = renderToString(React.createElement(App, { initialRoute: route.routeKey }));
    const fullPageHtml = injectSeoAndHtml(baseTemplate, route.routeKey, appHtml);

    if (route.path === '/') {
      fs.writeFileSync(path.join(DIST_DIR, 'index.html'), fullPageHtml, 'utf-8');
    } else {
      const cleanRoute = route.path.replace(/^\/+|\/+$/g, '');
      // Write dist/<route>/index.html (directory index format)
      const routeDir = path.join(DIST_DIR, cleanRoute);
      fs.mkdirSync(routeDir, { recursive: true });
      fs.writeFileSync(path.join(routeDir, 'index.html'), fullPageHtml, 'utf-8');

      // Also write dist/<route>.html (cleanUrls format for Firebase Hosting & Vercel)
      fs.writeFileSync(path.join(DIST_DIR, `${cleanRoute}.html`), fullPageHtml, 'utf-8');
    }

    renderedCount++;
    console.log(`[SSG] Pre-rendered ${route.path} (${ (Buffer.byteLength(fullPageHtml, 'utf8') / 1024).toFixed(1) } KB)`);
  }

  console.log(`[SSG] Successfully pre-rendered ${renderedCount} static HTML pages into dist/`);
  process.exit(0);
}

runPrerender().catch((err) => {
  console.error('[SSG] Pre-rendering error:', err);
  process.exit(1);
});
