import type { Filesystem } from './Filesystem';

interface CompletionState {
  anchorPrefix: string;
  anchorAfter: string;
  tokenStart: number;
  matches: string[];
  index: number;
}

interface CompletionResult {
  value: string;
  cursor: number;
}

export class Autocomplete {
  private state: CompletionState | null = null;

  reset(): void {
    this.state = null;
  }

  complete(value: string, cursor: number, commands: string[], fs: Filesystem, cwd: string): CompletionResult {
    const before = value.slice(0, cursor);
    const after = value.slice(cursor);
    const tokenStart = before.search(/\S+$/);
    const start = tokenStart === -1 ? cursor : tokenStart;
    const current = before.slice(start);
    const prefix = before.slice(0, start);

    const candidates = this.collectCandidates(before, current, commands, fs, cwd);
    if (!candidates.length) {
      this.reset();
      return { value, cursor };
    }

    const canCycle =
      this.state &&
      this.state.anchorPrefix === prefix &&
      this.state.anchorAfter === after &&
      this.state.tokenStart === start &&
      this.state.matches.join('\u0000') === candidates.join('\u0000');

    if (!canCycle) {
      this.state = { anchorPrefix: prefix, anchorAfter: after, tokenStart: start, matches: candidates, index: 0 };
    } else {
      this.state.index = (this.state.index + 1) % candidates.length;
    }

    const replacement = this.state.matches[this.state.index];
    const nextValue = `${prefix}${replacement}${after}`;
    return { value: nextValue, cursor: (prefix + replacement).length };
  }

  private collectCandidates(
    before: string,
    current: string,
    commands: string[],
    fs: Filesystem,
    cwd: string,
  ): string[] {
    const tokens = before.trim().split(/\s+/).filter(Boolean);
    if (tokens.length <= 1 && !before.endsWith(' ')) {
      return commands.filter((cmd) => cmd.startsWith(current));
    }

    const rawPath = current || '.';
    const slashIndex = rawPath.lastIndexOf('/');
    const parentRaw = slashIndex >= 0 ? rawPath.slice(0, slashIndex + 1) : '';
    const partial = slashIndex >= 0 ? rawPath.slice(slashIndex + 1) : rawPath;
    const lookup = parentRaw || '.';
    const listing = fs.readdir(lookup, cwd);
    if (!listing) return [];

    return listing.entries
      .filter((entry) => entry.name.startsWith(partial))
      .map((entry) => `${parentRaw}${entry.name}${entry.type === 'directory' ? '/' : ''}`);
  }
}
