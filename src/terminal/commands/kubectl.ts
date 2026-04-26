import { CONTENT } from '../../data/content';
import type { CommandHandler } from './types';

export const kubectl: CommandHandler = (ctx) => {
  if (ctx.parsed.args[0] !== 'get' || ctx.parsed.args[1] !== 'achievements') {
    return [{ text: "kubectl: supported only as 'kubectl get achievements'", className: 'text-red' }];
  }

  const head = 'YEAR  EVENT                    RESULT         STATUS';
  const rows = CONTENT.competitions.map((row) => {
    const status = row.result.includes('qualifiziert') ? 'Pending' : 'Complete';
    return `${row.year.padEnd(5)} ${row.event.padEnd(24)} ${row.result.padEnd(13)} ${status}`;
  });

  return [{ text: head, className: 'text-cyan' }, ...rows.map((line) => ({ text: line }))];
};
