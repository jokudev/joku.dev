import { CONTENT } from '../data/content';

export type NodeType = 'file' | 'directory';

export interface FSNode {
  type: NodeType;
  name: string;
  content?: string | (() => string);
  children?: Map<string, FSNode>;
  meta?: {
    mode?: string;
    owner?: string;
    group?: string;
    size?: number;
    mtime?: Date;
  };
}

interface ResolveResult {
  node: FSNode | null;
  path: string;
}

const defaultMeta = {
  owner: 'joshua',
  group: 'joshua',
  mtime: new Date('2026-04-26T10:00:00Z'),
};

function file(name: string, content: string | (() => string), mode = '-rw-r--r--'): FSNode {
  const size = typeof content === 'string' ? content.length : 1024;
  return {
    type: 'file',
    name,
    content,
    meta: { ...defaultMeta, mode, size },
  };
}

function dir(name: string, children: FSNode[] = []): FSNode {
  return {
    type: 'directory',
    name,
    children: new Map(children.map((child) => [child.name, child])),
    meta: { ...defaultMeta, mode: 'drwxr-xr-x', size: 4096 },
  };
}

function projectReadme(slug: string): string {
  const project = CONTENT.projects.find((entry) => entry.slug === slug);
  if (!project) return '# Project not found';
  const links: string[] = [];
  if (project.repo) links.push(`- Repository: ${project.repo}`);
  if (project.live) links.push(`- Live: ${project.live}`);

  return [
    `# ${project.title}`,
    '',
    project.description,
    '',
    '## Stack',
    ...project.tags.map((tag) => `- ${tag}`),
    '',
    '## Highlights',
    ...project.bullets.map((line) => `- ${line}`),
    ...(links.length ? ['', '## Links', ...links] : []),
  ].join('\n');
}

function educationMarkdown(index: number): string {
  const entry = CONTENT.education[index];
  return [`# ${entry.title}`, '', `${entry.period}`, `${entry.org}`, entry.location, entry.result].filter(Boolean).join('\n');
}

export function createFilesystem(): FSNode {
  const aboutDir = dir('about', [
    file('bio.txt', CONTENT.about.bio),
    file('languages.txt', CONTENT.about.languages.join('\n')),
    file('interests.txt', CONTENT.about.interests.join('\n')),
  ]);

  const stackDir = dir('stack', [
    dir('professional', [
      file('languages', CONTENT.stack.professional.languages.join(', ')),
      file('databases', CONTENT.stack.professional.databases.join(', ')),
      file('tools', CONTENT.stack.professional.tools.join(', ')),
    ]),
    dir('homelab', [
      file('cloud-infra', CONTENT.stack.homelab.cloudInfra.join(', ')),
      file('cicd', CONTENT.stack.homelab.cicd.join(', ')),
      file('systems', CONTENT.stack.homelab.systems.join(', ')),
    ]),
  ]);

  const competitionsText = CONTENT.competitions
    .map((c) => `${c.year} — ${c.event}: ${c.result}`)
    .join('\n');

  return dir('/', [
    dir('home', [
      dir('joshua', [
        aboutDir,
        stackDir,
        dir('education', [
          file('swiss-aviation.md', educationMarkdown(0)),
          file('bbm.md', educationMarkdown(1)),
          file('sekundarschule.md', educationMarkdown(2)),
        ]),
        dir('competitions', [file('swissskills.md', competitionsText)]),
        dir(
          'projects',
          CONTENT.projects.map((project) =>
            dir(project.slug, [file('README.md', () => projectReadme(project.slug))]),
          ),
        ),
        dir('contact', [file('email', CONTENT.user.email)]),
      ]),
    ]),
    dir('usr', [dir('bin', [file('neofetch', '#!/bin/zsh\necho neofetch', '-rwxr-xr-x')])]),
  ]);
}

export class Filesystem {
  readonly root: FSNode;
  readonly home = '/home/joshua';

  constructor(root = createFilesystem()) {
    this.root = root;
  }

  normalizePath(raw: string, cwd: string): string {
    const base = raw.startsWith('/') ? raw : raw === '~' || raw.startsWith('~/') ? `${this.home}${raw.slice(1)}` : `${cwd}/${raw}`;
    const parts = base.split('/').filter(Boolean);
    const stack: string[] = [];
    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        stack.pop();
        continue;
      }
      stack.push(part);
    }
    return `/${stack.join('/')}` || '/';
  }

  resolve(rawPath: string, cwd: string): ResolveResult {
    const absPath = this.normalizePath(rawPath || '.', cwd);
    if (absPath === '/') {
      return { node: this.root, path: '/' };
    }

    const parts = absPath.split('/').filter(Boolean);
    let current: FSNode = this.root;
    for (const part of parts) {
      if (current.type !== 'directory' || !current.children) {
        return { node: null, path: absPath };
      }
      const next = current.children.get(part);
      if (!next) {
        return { node: null, path: absPath };
      }
      current = next;
    }
    return { node: current, path: absPath };
  }

  readFile(rawPath: string, cwd: string): { content: string; path: string } | null {
    const resolved = this.resolve(rawPath, cwd);
    if (!resolved.node || resolved.node.type !== 'file') return null;
    const content = typeof resolved.node.content === 'function' ? resolved.node.content() : resolved.node.content ?? '';
    return { content, path: resolved.path };
  }

  readdir(rawPath: string, cwd: string): { entries: FSNode[]; path: string } | null {
    const resolved = this.resolve(rawPath || '.', cwd);
    if (!resolved.node || resolved.node.type !== 'directory') return null;
    return { entries: [...(resolved.node.children?.values() ?? [])], path: resolved.path };
  }

  displayPath(path: string): string {
    return path === this.home ? '~' : path.startsWith(`${this.home}/`) ? `~${path.slice(this.home.length)}` : path;
  }
}
