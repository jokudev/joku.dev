import type { CommandHandler } from './types';

export const git: CommandHandler = (ctx) => {
  if (ctx.parsed.args[0] !== 'log' || !ctx.parsed.flags.has('--oneline')) {
    return [{ text: "git: supported only as 'git log --oneline'", className: 'text-red' }];
  }

  return [
    { text: 'a1b2c3d SwissSkills 2025 Regional: 1. Platz' },
    { text: 'b7e8d2c EFZ im Rang abgeschlossen: Note 5.7' },
    { text: '7a1c9f0 Technische Berufsmaturität abgeschlossen: Note 4.9' },
    { text: 'e4f5g6h Start EFZ Lehre' },
    { text: '92cc041 Berufsmaturität parallel gestartet' },
    { text: 'f0aa112 Homelab IaC Stack ausgebaut' },
  ];
};
