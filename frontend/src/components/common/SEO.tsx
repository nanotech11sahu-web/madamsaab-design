import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  noindex?: boolean;
}

const SITE_NAME = 'MadamSaab';

function setMetaTag(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export function SEO({ title, description, noindex }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
    document.title = fullTitle;
    setMetaTag('og:title', fullTitle, 'property');
    setMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    if (description) {
      setMetaTag('description', description);
      setMetaTag('og:description', description, 'property');
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + window.location.pathname);
  }, [title, description]);

  return null;
}
