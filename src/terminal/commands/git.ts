import type { CommandHandler } from './types';

export const git: CommandHandler = (ctx) => {
  if (ctx.parsed.args[0] !== 'log' || !ctx.parsed.flags.has('--oneline')) {
    return [{ text: "git: supported only as 'git log --oneline'", className: 'text-red' }];
  }

  return [
    { text: 'a1b2c3d SwissSkills 2025 Regional: 1. Platz' },
    { text: 'e4f5g6h Start EFZ Lehre' },
    { text: '92cc041 Berufsmaturität parallel gestartet' },
    { text: 'f0aa112 Homelab IaC Stack ausgebaut' },
  ];
};
