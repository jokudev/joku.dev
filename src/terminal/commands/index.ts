import { CONTENT } from '../../data/content';
import { formatBuildTimestamp, formatBuildUptime } from '../../data/build';
import { cd } from './cd';
import { cat } from './cat';
import { git } from './git';
import { help } from './help';
import { kubectl } from './kubectl';
import { ls } from './ls';
import { neofetch } from './neofetch';
import { whoami } from './whoami';
import type { CommandHandler } from './types';

const closeSession: CommandHandler = async (ctx) => {
  ctx.terminal.printLine({ text: 'Closing session...', className: 'text-text-secondary' });
  window.close();
  await ctx.terminal.sleep(150);

  if (!window.closed) {
    return [
      { text: 'Browser blocked window.close().', className: 'text-amber' },
      { text: 'Use Ctrl+W / Cmd+W to close this tab.', className: 'text-text-secondary' },
    ];
  }
  return null;
};

const builtins: Record<string, CommandHandler> = {
  help,
  clear: (ctx) => {
    ctx.terminal.clear();
    return [];
  },
  reset: async (ctx) => {
    await ctx.terminal.restartSession();
    return null;
  },
  whoami,
  neofetch,
  ls,
  cat,
  cd,
  pwd: (ctx) => [{ text: ctx.cwd }],
  echo: (ctx) => {
    const text = ctx.parsed.args.join(' ')
      .replaceAll('$SHELL', '/bin/zsh')
      .replaceAll('$HOME', '/home/joshua');
    return [{ text }];
  },
  date: () => [
    {
      text: new Date().toLocaleString('de-CH', {
        dateStyle: 'full',
        timeStyle: 'medium',
        timeZone: 'Europe/Zurich',
      }),
    },
  ],
  uptime: () => [{ text: `up ${formatBuildUptime()} — since last build (${formatBuildTimestamp()})` }],
  history: (ctx) => ctx.history.all().map((entry, index) => ({ text: `${index + 1}  ${entry}` })),
  git,
  kubectl,
  terraform: (ctx) => {
    if (ctx.parsed.args[0] === 'plan') {
      return [{ text: 'No changes. Your infrastructure matches the configuration.', className: 'text-green' }];
    }
    return [{ text: "terraform: supported only as 'terraform plan'", className: 'text-red' }];
  },
  ssh: (ctx) => {
    if (ctx.parsed.args[0] !== 'contact') {
      return [{ text: "ssh: supported only as 'ssh contact'", className: 'text-red' }];
    }
    return [
      { text: 'Connecting to contact endpoint...' },
      {
        html: `mail: <a href="mailto:${CONTENT.user.email}" target="_blank" rel="noreferrer">${CONTENT.user.email}</a>`,
      },
    ];
  },
  wget: async (ctx) => {
    if (ctx.parsed.args[0] !== 'cv.pdf') {
      return [{ text: "wget: only 'wget cv.pdf' is available", className: 'text-red' }];
    }

    const steps = [8, 23, 38, 54, 71, 86, 100];
    for (const step of steps) {
      const done = '='.repeat(Math.floor(step / 5));
      const left = ' '.repeat(20 - done.length);
      ctx.terminal.printLine({ text: `[${done}${left}] ${step}%` });
      await ctx.terminal.sleep(70);
    }
    return [
      { text: 'Saved as cv.pdf', className: 'text-green' },
      { html: `<a href="/cv.pdf" target="_blank" rel="noreferrer">open /cv.pdf</a>` },
    ];
  },
  exit: closeSession,
  shutdown: closeSession,
};

export function getBuiltins(): Record<string, CommandHandler> {
  return builtins;
}

export function commandNames(): string[] {
  return Object.keys(builtins);
}

export const easterEggs: CommandHandler = async (ctx) => {
  const raw = ctx.rawInput.trim();
  if (raw.startsWith('sudo ')) {
    return [{ text: 'joshua is not in the sudoers file. This incident will be reported.', className: 'text-red' }];
  }
  if (raw === 'rm -rf /') {
    return [
      { text: "rm: it is dangerous to operate recursively on '/'", className: 'text-red' },
      { text: "Try 'rm --help' for more information.", className: 'text-red' },
    ];
  }
  if (raw === 'make coffee') {
    return [{ text: 'Brewing... done. [-] coffee ready', className: 'text-green' }];
  }
  if (raw === 'hack' || raw === 'hackerman') {
    for (const step of [12, 29, 47, 68, 82, 100]) {
      const filled = '#'.repeat(Math.floor(step / 5));
      const empty = '.'.repeat(20 - filled.length);
      ctx.terminal.printLine({ text: `[${filled}${empty}] ${step}%` });
      await ctx.terminal.sleep(50);
    }
    return [{ text: 'Initiating mainframe bypass... Access denied.', className: 'text-red' }];
  }
  return null;
};
