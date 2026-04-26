import type { CommandHandler } from './types';

export const cd: CommandHandler = (ctx) => {
  const target = ctx.parsed.args[0] ?? '~';
  const resolved = ctx.fs.resolve(target, ctx.cwd);
  if (!resolved.node) return [{ text: `cd: no such file or directory: ${target}`, className: 'text-red' }];
  if (resolved.node.type !== 'directory') return [{ text: `cd: not a directory: ${target}`, className: 'text-red' }];
  ctx.setCwd(resolved.path);
  return [];
};
