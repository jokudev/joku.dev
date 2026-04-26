export type Arg = string;

export interface ParsedCommand {
  cmd: string;
  args: Arg[];
  flags: Set<string>;
}

export class CommandParser {
  parse(input: string): ParsedCommand {
    const tokens: string[] = [];
    let current = '';
    let quoted = false;

    for (let i = 0; i < input.length; i += 1) {
      const char = input[i];
      if (char === '"') {
        quoted = !quoted;
        continue;
      }
      if (!quoted && /\s/.test(char)) {
        if (current) {
          tokens.push(current);
          current = '';
        }
        continue;
      }
      current += char;
    }

    if (current) tokens.push(current);
    const [cmd = '', ...args] = tokens;
    const flags = new Set(args.filter((arg) => arg.startsWith('-')));
    return { cmd, args, flags };
  }
}
