import { CONTENT } from '../data/content';
import { Autocomplete } from './Autocomplete';
import { CommandParser } from './CommandParser';
import { Filesystem } from './Filesystem';
import { HistoryManager } from './HistoryManager';
import { commandNames, easterEggs, getBuiltins } from './commands';
import type { CommandOutput } from './commands/types';

export class Terminal {
  private readonly app: HTMLElement;
  private readonly input: HTMLInputElement;
  private readonly viewport: HTMLDivElement;
  private readonly parser = new CommandParser();
  private readonly history = new HistoryManager();
  private readonly fs = new Filesystem();
  private readonly autocomplete = new Autocomplete();
  private readonly builtins = getBuiltins();
  private readonly commands = commandNames();

  private cwd = '/home/joshua';
  private activeLine: HTMLDivElement | null = null;
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private running = false;

  constructor(app: HTMLElement, input: HTMLInputElement) {
    this.app = app;
    this.input = input;

    this.viewport = document.createElement('div');
    this.viewport.className = 'max-w-5xl mx-auto min-h-screen px-4 py-8';
    this.app.append(this.viewport);

    this.bindEvents();
  }

  async boot(): Promise<void> {
    await this.restartSession();
  }

  async restartSession(): Promise<void> {
    this.clear();
    const motd = [
      `Last login: ${new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })} from guest@internet`,
      'Welcome to joku.dev edge node (guest session)',
      'Type `help` to list available commands.',
      '',
    ];

    await this.streamLines(motd.map((text) => ({ text, className: 'text-text-secondary' })));
    await this.renderCommandOutput(this.builtins.neofetch({ parsed: this.parser.parse('neofetch'), rawInput: 'neofetch', fs: this.fs, cwd: this.cwd, setCwd: () => undefined, history: this.history, terminal: this }) ?? []);
    this.spawnPrompt();
  }

  clear(): void {
    this.viewport.innerHTML = '';
    this.activeLine = null;
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  printLine(line: CommandOutput): void {
    const row = document.createElement('div');
    row.className = `whitespace-pre-wrap break-words ${line.className ?? ''}`;
    if (line.html) {
      row.innerHTML = line.html;
    } else {
      row.innerHTML = this.linkify(this.escapeHtml(line.text ?? ''));
    }
    this.viewport.append(row);
    this.scrollToBottom();
  }

  private async streamLines(lines: CommandOutput[]): Promise<void> {
    for (const line of lines) {
      this.printLine(line);
      if (!this.reducedMotion) {
        await this.sleep(Math.floor(Math.random() * 31));
      }
    }
  }

  private bindEvents(): void {
    this.app.addEventListener('click', (event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('a')) return;
      if (window.getSelection()?.toString()) return;
      this.focusInput();
    });
    this.app.addEventListener(
      'touchstart',
      (event) => {
        const target = event.target as HTMLElement | null;
        if (target?.closest('a')) return;
        this.focusInput();
      },
      { passive: true },
    );
    this.input.addEventListener('input', () => this.renderActiveInput());
    this.input.addEventListener('click', () => this.renderActiveInput());
    this.input.addEventListener('keyup', () => this.renderActiveInput());
    this.input.addEventListener('keydown', (event) => this.onKeyDown(event));
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (this.running) {
      event.preventDefault();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      this.input.value = '';
      this.printLine({ text: '^C', className: 'text-text-secondary' });
      this.spawnPrompt();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      this.clear();
      this.spawnPrompt();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      void this.submitCommand();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.input.value = this.history.previous();
      this.setCursor(this.input.value.length);
      this.renderActiveInput();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.input.value = this.history.next();
      this.setCursor(this.input.value.length);
      this.renderActiveInput();
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const cursor = this.input.selectionStart ?? this.input.value.length;
      const result = this.autocomplete.complete(this.input.value, cursor, this.commands, this.fs, this.cwd);
      this.input.value = result.value;
      this.setCursor(result.cursor);
      this.renderActiveInput();
      return;
    }

    this.autocomplete.reset();
    window.requestAnimationFrame(() => this.renderActiveInput());
  }

  private async submitCommand(): Promise<void> {
    const input = this.input.value;
    this.finalizePrompt(input);
    this.input.value = '';
    this.history.add(input);
    this.autocomplete.reset();

    if (!input.trim()) {
      this.spawnPrompt();
      return;
    }

    this.running = true;
    const parsed = this.parser.parse(input);
    const cmd = this.builtins[parsed.cmd];

    if (cmd) {
      const output = await cmd({
        parsed,
        rawInput: input,
        fs: this.fs,
        cwd: this.cwd,
        setCwd: (path) => {
          this.cwd = path;
        },
        history: this.history,
        terminal: this,
      });
      if (output !== null) {
        await this.renderCommandOutput(output ?? []);
      }
    } else {
      const egg = await easterEggs({
        parsed,
        rawInput: input,
        fs: this.fs,
        cwd: this.cwd,
        setCwd: () => undefined,
        history: this.history,
        terminal: this,
      });
      if (egg) {
        await this.renderCommandOutput(egg);
      } else {
        this.printLine({ text: `command not found: ${parsed.cmd}`, className: 'text-red' });
        this.printLine({ text: "Type 'help' for available commands.", className: 'text-text-secondary' });
      }
    }

    this.running = false;
    if (!this.activeLine) this.spawnPrompt();
  }

  private async renderCommandOutput(output: CommandOutput[]): Promise<void> {
    await this.streamLines(output);
  }

  private spawnPrompt(): void {
    this.activeLine = document.createElement('div');
    this.activeLine.className = 'whitespace-pre-wrap break-words';
    this.viewport.append(this.activeLine);
    this.input.value = '';
    this.renderActiveInput();
    this.focusInput();
  }

  private finalizePrompt(command: string): void {
    if (!this.activeLine) return;
    this.activeLine.innerHTML =
      `${this.promptPrefix()}<span class="text-text-primary">${this.escapeHtml(command)}</span>`;
    this.activeLine = null;
    this.scrollToBottom();
  }

  private renderActiveInput(): void {
    if (!this.activeLine) return;
    const value = this.input.value;
    const cursor = this.input.selectionStart ?? value.length;
    const before = this.escapeHtml(value.slice(0, cursor));
    const cur = this.escapeHtml(value[cursor] ?? ' ');
    const after = this.escapeHtml(value.slice(cursor + 1));

    this.activeLine.innerHTML =
      `${this.promptPrefix()}<span class="text-text-primary">${before}</span>` +
      `<span class="animate-pulse" style="background:#e2e8f0;color:#0a0a0f">${cur}</span>` +
      `<span class="text-text-primary">${after}</span>`;
    this.scrollToBottom();
  }

  private promptPrefix(): string {
    const path = this.fs.displayPath(this.cwd);
    return `<span class="text-cyan">joshua@${CONTENT.user.host}</span><span class="text-text-secondary">:</span><span class="text-amber">${path}</span><span class="text-text-primary">$ </span>`;
  }

  private focusInput(): void {
    this.input.focus({ preventScroll: true });
  }

  private setCursor(pos: number): void {
    this.input.setSelectionRange(pos, pos);
  }

  private scrollToBottom(): void {
    window.requestAnimationFrame(() => {
      this.app.scrollTop = this.app.scrollHeight;
    });
  }

  private escapeHtml(text: string): string {
    return text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  private linkify(text: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
    const withUrls = text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noreferrer">${url}</a>`);
    return withUrls.replace(emailRegex, (mail) => `<a href="mailto:${mail}" target="_blank" rel="noreferrer">${mail}</a>`);
  }
}
