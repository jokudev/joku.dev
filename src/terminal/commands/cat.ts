import type { CommandHandler } from './types';

export const cat: CommandHandler = (ctx) => {
  const target = ctx.parsed.args[0];
  if (!target) return [{ text: 'cat: missing operand', className: 'text-red' }];

  const resolved = ctx.fs.resolve(target, ctx.cwd);
  if (!resolved.node) {
    return [{ text: `cat: ${target}: No such file or directory`, className: 'text-red' }];
  }
  if (resolved.node.type === 'directory') {
    return [{ text: `cat: ${target}: Is a directory`, className: 'text-red' }];
  }

  const read = ctx.fs.readFile(target, ctx.cwd);
  if (!read) return [{ text: `cat: ${target}: Unable to read`, className: 'text-red' }];
  return read.content.split('\n').map((line) => ({ text: line }));
};
