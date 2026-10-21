const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

export function initAnalytics(): void {
  if (!GA_MEASUREMENT_ID) {
    return;
  }

  const globalName = 'dataLayer';
  const existingLayer = (window as unknown as Record<string, unknown[]>)[globalName];
  const dataLayer = Array.isArray(existingLayer) ? existingLayer : [];
  (window as unknown as Record<string, unknown[]>)[globalName] = dataLayer;

  const gtag = (...args: unknown[]) => {
    dataLayer.push(args);
  };

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.append(script);
}
