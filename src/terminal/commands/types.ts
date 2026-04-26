import type { ParsedCommand } from '../CommandParser';
import type { Filesystem } from '../Filesystem';
import type { HistoryManager } from '../HistoryManager';
import type { Terminal } from '../Terminal';

export interface CommandContext {
  parsed: ParsedCommand;
  rawInput: string;
  fs: Filesystem;
  cwd: string;
  setCwd: (path: string) => void;
  history: HistoryManager;
  terminal: Terminal;
}

export interface CommandOutput {
  text?: string;
  html?: string;
  className?: string;
}

export type CommandHandler = (ctx: CommandContext) => Promise<CommandOutput[] | null> | CommandOutput[] | null;
