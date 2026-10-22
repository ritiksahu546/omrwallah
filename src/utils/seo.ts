export interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: 'website' | 'article';
  image?: string;
  noindex?: boolean;
  breadcrumbs?: { name: string; path: string }[];
  faqs?: { question: string; answer: string }[];
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    category?: string;
  };
}

export const BASE_URL = 'https://omrwallah.in';
export const DEFAULT_OG_IMAGE = `${BASE_URL}/images/omrwallah-logo.png`;

export function updatePageSEO(seo: SEOProps) {
  // Title
  document.title = seo.title;

  // Helpers to set or create meta tags
  const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  };

  // Description
  setMeta('name', 'description', seo.description);

  // Robots
  if (seo.noindex) {
    setMeta('name', 'robots', 'noindex, nofollow');
  } else {
    setMeta('name', 'robots', 'index, follow');
  }

  // Canonical link
  const canonicalUrl = seo.canonicalPath 
    ? (seo.canonicalPath.startsWith('http') ? seo.canonicalPath : `${BASE_URL}${seo.canonicalPath}`)
    : BASE_URL;

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Open Graph
  setMeta('property', 'og:title', seo.title);
  setMeta('property', 'og:description', seo.description);
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:type', seo.type || 'website');
  setMeta('property', 'og:site_name', 'OMRWallah');
  setMeta('property', 'og:image', seo.image || DEFAULT_OG_IMAGE);

  // Twitter
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', seo.title);
  setMeta('name', 'twitter:description', seo.description);
  setMeta('name', 'twitter:image', seo.image || DEFAULT_OG_IMAGE);

  // Structured Data (JSON-LD)
  updateStructuredData(seo, canonicalUrl);
}

export interface SitemapRouteEntry {
  routeKey: string;
  path: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: number;
}

/**
 * Canonical list of all 19 public indexable routes (Home + 18 internal pages)
 * used by both automated sitemap.xml generation and build-time SSG pre-rendering.
 */
export const PUBLIC_SITEMAP_ROUTES: SitemapRouteEntry[] = [
  { routeKey: 'home', path: '/', changefreq: 'daily', priority: 1.0 },
  { routeKey: 'omr-sheet-generator', path: '/omr-sheet-generator', changefreq: 'weekly', priority: 0.9 },
  { routeKey: 'omr-sheet-maker', path: '/omr-sheet-maker', changefreq: 'weekly', priority: 0.9 },
  { routeKey: 'omr-sheet-pdf', path: '/omr-sheet-pdf', changefreq: 'weekly', priority: 0.9 },
  { routeKey: 'online-omr-sheet', path: '/online-omr-sheet', changefreq: 'weekly', priority: 0.9 },
  { routeKey: 'creator', path: '/creator', changefreq: 'weekly', priority: 0.9 },
  { routeKey: 'templates', path: '/templates', changefreq: 'weekly', priority: 0.9 },
  { routeKey: 'omr-practice', path: '/omr-practice', changefreq: 'weekly', priority: 0.85 },
  { routeKey: 'practice', path: '/practice', changefreq: 'weekly', priority: 0.85 },
  { routeKey: 'omr-sheet-for-coaching', path: '/omr-sheet-for-coaching', changefreq: 'monthly', priority: 0.8 },
  { routeKey: 'omr-sheet-for-schools', path: '/omr-sheet-for-schools', changefreq: 'monthly', priority: 0.8 },
  { routeKey: 'omr-exams', path: '/omr-exams', changefreq: 'weekly', priority: 0.85 },
  { routeKey: 'neet-omr-sheet', path: '/neet-omr-sheet', changefreq: 'weekly', priority: 0.85 },
  { routeKey: 'jee-omr-sheet', path: '/jee-omr-sheet', changefreq: 'weekly', priority: 0.85 },
  { routeKey: 'ssc-omr-sheet', path: '/ssc-omr-sheet', changefreq: 'weekly', priority: 0.85 },
  { routeKey: 'cuet-omr-sheet', path: '/cuet-omr-sheet', changefreq: 'weekly', priority: 0.85 },
  { routeKey: 'ctet-omr-sheet', path: '/ctet-omr-sheet', changefreq: 'weekly', priority: 0.85 },
  { routeKey: 'blog', path: '/blog', changefreq: 'weekly', priority: 0.8 },
  { routeKey: 'faq', path: '/faq', changefreq: 'monthly', priority: 0.7 },
  { routeKey: 'pricing', path: '/pricing', changefreq: 'monthly', priority: 0.7 },
];

export function buildStructuredDataJson(seo: SEOProps, currentUrl: string): string {
  const graphs: Record<string, unknown>[] = [
    // Organization schema
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'OMRWallah',
      url: BASE_URL,
      logo: `${BASE_URL}/images/omrwallah-logo.png`,
      description: 'India’s premier online OMR sheet generator, maker, and practice platform.',
    },
    // WebSite schema
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: 'OMRWallah',
      url: BASE_URL,
      publisher: {
        '@id': `${BASE_URL}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/templates?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    // WebApplication schema
    {
      '@type': 'WebApplication',
      '@id': `${BASE_URL}/#webapp`,
      name: 'OMRWallah - OMR Sheet Generator & Practice Platform',
      url: currentUrl,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'All',
      description: seo.description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
    },
  ];

  // Breadcrumbs
  if (seo.breadcrumbs && seo.breadcrumbs.length > 0) {
    graphs.push({
      '@type': 'BreadcrumbList',
      '@id': `${currentUrl}#breadcrumb`,
      itemListElement: seo.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.path.startsWith('http') ? crumb.path : `${BASE_URL}${crumb.path}`,
      })),
    });
  }

  // FAQ schema if visibly present on the page
  if (seo.faqs && seo.faqs.length > 0) {
    graphs.push({
      '@type': 'FAQPage',
      '@id': `${currentUrl}#faq`,
      mainEntity: seo.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  // Article schema if viewing a blog post
  if (seo.type === 'article' && seo.article) {
    graphs.push({
      '@type': 'Article',
      '@id': `${currentUrl}#article`,
      headline: seo.title,
      description: seo.description,
      image: seo.image || DEFAULT_OG_IMAGE,
      datePublished: seo.article.publishedTime || new Date().toISOString(),
      dateModified: seo.article.modifiedTime || new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: seo.article.author || 'OMRWallah Editorial Team',
        url: BASE_URL,
      },
      publisher: {
        '@id': `${BASE_URL}/#organization`,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentUrl,
      },
    });
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graphs,
  });
}

function updateStructuredData(seo: SEOProps, currentUrl: string) {
  const schemaId = 'omrwallah-schema-jsonld';
  let scriptEl = document.getElementById(schemaId) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = schemaId;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  scriptEl.textContent = buildStructuredDataJson(seo, currentUrl);
}

