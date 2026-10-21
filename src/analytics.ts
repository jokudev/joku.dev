type Umami = {
  track: (eventName: string, eventData?: Record<string, string>) => void;
};

declare global {
  interface Window {
    umami?: Umami;
  }
}

export function trackEvent(eventName: string, eventData?: Record<string, string>): void {
  window.umami?.track(eventName, eventData);
}
