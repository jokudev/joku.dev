import type { CommandHandler } from './types';

const rows = [
  ['help', 'List all built-in commands'],
  ['clear', 'Clear terminal output'],
  ['reset', 'Reset terminal session'],
  ['whoami', 'Print full bio text'],
  ['neofetch', 'Show profile system info'],
  ['ls [path]', 'List directory contents'],
  ['cat [file]', 'Print file contents'],
  ['cd [path]', 'Change working directory'],
  ['pwd', 'Show current path'],
  ['echo [text]', 'Print text or env vars'],
  ['date', 'Current datetime (de-CH)'],
  ['uptime', 'Show time since the latest site build'],
  ['history', 'Show command history'],
  ['git log --oneline', 'Show milestone commits'],
  ['kubectl get achievements', 'Show SwissSkills table'],
  ['terraform plan', 'Infrastructure drift check'],
  ['ssh contact', 'Show contact email'],
  ['wget cv.pdf', 'Simulate CV download'],
  ['exit', 'Attempt to close this tab'],
  ['shutdown', 'Attempt to close this tab'],
];

export const help: CommandHandler = () => {
  return rows.map(([cmd, desc]) => ({
    text: `${cmd.padEnd(28)}${desc}`,
    className: 'text-text-primary',
  }));
};
