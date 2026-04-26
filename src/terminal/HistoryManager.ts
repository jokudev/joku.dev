export class HistoryManager {
  private entries: string[] = [];
  private cursor = -1;

  add(command: string): void {
    if (!command.trim()) return;
    this.entries.push(command);
    this.cursor = this.entries.length;
  }

  previous(): string {
    if (!this.entries.length) return '';
    this.cursor = Math.max(0, this.cursor - 1);
    return this.entries[this.cursor] ?? '';
  }

  next(): string {
    if (!this.entries.length) return '';
    this.cursor = Math.min(this.entries.length, this.cursor + 1);
    if (this.cursor === this.entries.length) return '';
    return this.entries[this.cursor] ?? '';
  }

  all(): string[] {
    return [...this.entries];
  }
}
