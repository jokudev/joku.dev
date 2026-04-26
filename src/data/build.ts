const envBuildTime = import.meta.env.VITE_BUILD_TIME;

function parseBuildDate(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export const BUILD_DATE = parseBuildDate(envBuildTime) ?? new Date();
export const BUILD_TIME_ISO = BUILD_DATE.toISOString();

export function formatBuildUptime(): string {
  const now = new Date();
  const ms = Math.max(0, now.getTime() - BUILD_DATE.getTime());
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export function formatBuildTimestamp(locale = 'de-CH'): string {
  return BUILD_DATE.toLocaleString(locale, {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'Europe/Zurich',
  });
}
