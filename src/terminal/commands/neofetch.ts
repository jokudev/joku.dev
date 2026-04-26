import { CONTENT } from '../../data/content';
import { formatBuildTimestamp, formatBuildUptime } from '../../data/build';
import type { CommandHandler } from './types';

export const neofetch: CommandHandler = () => {
  const apprenticeshipWindow = '2022-2026';
  const specs: Array<{ label: string; value?: string; html?: string }> = [
    { label: 'User', value: `${CONTENT.user.name} @ ${CONTENT.user.host}` },
    { label: 'Role', value: CONTENT.user.role },
    { label: 'Location', value: CONTENT.user.location },
    { label: 'Uptime', value: `${formatBuildUptime()} (since last build)` },
    { label: 'Build', value: formatBuildTimestamp() },
    { label: 'Shell', value: '/bin/zsh' },
    { label: 'Stack', value: 'Java, Linux, Docker, Kubernetes, Terraform' },
    {
      label: 'Contact',
      html: `<a href="mailto:${CONTENT.user.email}" target="_blank" rel="noreferrer">${CONTENT.user.email}</a>`,
    },
  ];
  return [
    {
      html:
        '<div style="display:flex;align-items:flex-start;gap:14px;white-space:normal">' +
        '<img src="/favicon.svg" alt="joku.dev logo" width="64" height="64" style="image-rendering:pixelated;flex:0 0 auto;margin-top:2px" />' +
        `<div>${specs
          .map((line) => `<div class="text-text-primary">${line.label}: ${line.html ?? line.value ?? ''}</div>`)
          .join('')}</div>` +
        '</div>',
    },
  ];
};
