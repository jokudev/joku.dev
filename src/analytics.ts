const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
const SOCIAL_HOSTNAMES = new Set([
  'github.com',
  'www.github.com',
  'linkedin.com',
  'www.linkedin.com',
  'x.com',
  'www.x.com',
  'twitter.com',
  'www.twitter.com',
  'instagram.com',
  'www.instagram.com',
]);

function getDataLayer(): unknown[][] | null {
  const globalName = 'dataLayer';
  const existingLayer = (window as unknown as Record<string, unknown>)[globalName];
  if (!Array.isArray(existingLayer)) {
    return null;
  }
  return existingLayer as unknown[][];
}

function gtag(...args: unknown[]): void {
  getDataLayer()?.push(args);
}

export function initAnalytics(): void {
  if (!GA_MEASUREMENT_ID) {
    return;
  }

  (window as unknown as Record<string, unknown[][]>)['dataLayer'] = getDataLayer() ?? [];

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.append(script);
}

export function trackTerminalLinkClick(href: string, label: string): void {
  if (!GA_MEASUREMENT_ID) {
    return;
  }

  const url = new URL(href, window.location.origin);
  if (url.pathname === '/cv.pdf') {
    gtag('event', 'cv_download_click', {
      link_url: url.toString(),
      link_label: label,
      transport_type: 'beacon',
    });
    return;
  }

  if (!SOCIAL_HOSTNAMES.has(url.hostname)) {
    return;
  }

  gtag('event', 'social_link_click', {
    link_url: url.toString(),
    link_domain: url.hostname,
    link_label: label,
    transport_type: 'beacon',
  });
}
