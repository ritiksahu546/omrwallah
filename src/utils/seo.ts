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
export const DEFAULT_OG_IMAGE = `${BASE_URL}/pwa-512x512.png`;

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

function updateStructuredData(seo: SEOProps, currentUrl: string) {
  const schemaId = 'omrwallah-schema-jsonld';
  let scriptEl = document.getElementById(schemaId) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = schemaId;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const graphs: Record<string, unknown>[] = [
    // Organization schema
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'OMRWallah',
      url: BASE_URL,
      logo: `${BASE_URL}/icon.svg`,
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

  scriptEl.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graphs,
  });
}
