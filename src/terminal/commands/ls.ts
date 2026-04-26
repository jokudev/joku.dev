import type { FSNode } from '../Filesystem';
import type { CommandHandler, CommandOutput } from './types';

function formatDate(date?: Date): string {
  const d = date ?? new Date();
  return d.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function colorClass(node: FSNode): string {
  if (node.type === 'directory') return 'text-cyan';
  if (node.meta?.mode?.includes('x')) return 'text-green';
  return 'text-text-primary';
}

export const ls: CommandHandler = (ctx) => {
  const target = ctx.parsed.args.find((arg) => !arg.startsWith('-')) ?? '.';
  const listing = ctx.fs.readdir(target, ctx.cwd);

  if (!listing) {
    return [{ text: `ls: cannot access '${target}': No such file or directory`, className: 'text-red' }];
  }

  const showLong = ctx.parsed.flags.has('-la') || ctx.parsed.flags.has('-l') || ctx.parsed.flags.has('-al');
  const entries = [...listing.entries].sort((a, b) => a.name.localeCompare(b.name));

  if (!showLong) {
    return entries.map((entry) => ({ html: `<span class="${colorClass(entry)}">${entry.name}</span>` }));
  }

  const out: CommandOutput[] = [];
  out.push({ text: 'total ' + entries.length, className: 'text-text-secondary' });
  for (const entry of entries) {
    const mode = entry.meta?.mode ?? (entry.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--');
    const owner = entry.meta?.owner ?? 'joshua';
    const group = entry.meta?.group ?? 'joshua';
    const size = String(entry.meta?.size ?? 0).padStart(6);
    const date = formatDate(entry.meta?.mtime).padEnd(10);
    out.push({
      html: `${mode} 1 ${owner} ${group} ${size} ${date} <span class="${colorClass(entry)}">${entry.name}</span>`,
    });
  }
  return out;
};
