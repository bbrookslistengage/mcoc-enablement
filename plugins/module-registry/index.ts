import type {LoadContext, Plugin} from '@docusaurus/types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface ModuleEntry {
  title: string;
  path: string;
  parent?: string;
  part: string;
  position: number;
  hasAssignment: boolean;
}

interface PartEntry {
  dirName: string;
  label: string;
  position: number;
  description: string;
}

interface RegistryData {
  modules: Record<string, ModuleEntry>;
  parts: PartEntry[];
}

export default function moduleRegistryPlugin(context: LoadContext): Plugin {
  const docsDir = path.join(context.siteDir, 'docs');

  return {
    name: 'module-registry',

    async loadContent(): Promise<RegistryData> {
      const modules: Record<string, ModuleEntry> = {};
      const parts: PartEntry[] = [];
      const slugsSeen = new Map<string, string>();

      // Read top-level part directories
      const topDirs = fs.readdirSync(docsDir, {withFileTypes: true})
        .filter(d => d.isDirectory() && (d.name.startsWith('part-') || d.name === 'introduction'));

      for (const partDir of topDirs) {
        const partPath = path.join(docsDir, partDir.name);
        const categoryFile = path.join(partPath, '_category_.json');

        if (!fs.existsSync(categoryFile)) continue;

        const category = JSON.parse(fs.readFileSync(categoryFile, 'utf-8'));
        parts.push({
          dirName: partDir.name,
          label: category.label,
          position: category.position,
          description: category.description ?? '',
        });

        // Process all markdown files in this part (including subdirectories)
        processDirectory(partPath, partDir.name, undefined, modules, slugsSeen);
      }

      // Sort parts by position
      parts.sort((a, b) => a.position - b.position);

      return {modules, parts};
    },

    async contentLoaded({content, actions}) {
      const {setGlobalData} = actions;
      const registryData = content as RegistryData;
      setGlobalData(registryData);
    },
  };
}

function deriveSlug(filePath: string): string {
  const basename = path.basename(filePath, path.extname(filePath));
  if (basename === 'index') {
    return path.basename(path.dirname(filePath));
  }
  return basename;
}

function derivePermalink(filePath: string, docsRoot: string): string {
  const relative = path.relative(docsRoot, filePath);
  const withoutExt = relative.replace(/\.(md|mdx)$/, '');
  const withoutIndex = withoutExt.replace(/\/index$/, '');
  return '/' + withoutIndex;
}

function getDirectoryPosition(dirPath: string): number {
  const categoryFile = path.join(dirPath, '_category_.json');
  if (!fs.existsSync(categoryFile)) return 0;
  try {
    const cat = JSON.parse(fs.readFileSync(categoryFile, 'utf-8'));
    return cat.position ?? 0;
  } catch {
    return 0;
  }
}

function processDirectory(
  dirPath: string,
  partName: string,
  parentSlug: string | undefined,
  modules: Record<string, ModuleEntry>,
  slugsSeen: Map<string, string>,
): void {
  const rawEntries = fs.readdirSync(dirPath, {withFileTypes: true});

  // Sort entries: directories by their _category_.json position, files by sidebar_position
  // Read positions up-front so we can sort before processing
  const entries = rawEntries
    .filter(e => {
      if (e.isDirectory()) {
        return fs.existsSync(path.join(dirPath, e.name, '_category_.json'));
      }
      return e.name.match(/\.(md|mdx)$/) && e.name !== 'index.md' && e.name !== 'index.mdx';
    })
    .sort((a, b) => {
      const posA = a.isDirectory()
        ? getDirectoryPosition(path.join(dirPath, a.name))
        : (() => {
            try {
              const {data: fm} = matter(fs.readFileSync(path.join(dirPath, a.name), 'utf-8'));
              return fm.sidebar_position ?? 0;
            } catch { return 0; }
          })();
      const posB = b.isDirectory()
        ? getDirectoryPosition(path.join(dirPath, b.name))
        : (() => {
            try {
              const {data: fm} = matter(fs.readFileSync(path.join(dirPath, b.name), 'utf-8'));
              return fm.sidebar_position ?? 0;
            } catch { return 0; }
          })();
      return posA - posB;
    });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const dirSlug = entry.name;

      // Check for index.md in the subcategory
      const indexFile = ['index.md', 'index.mdx']
        .map(f => path.join(fullPath, f))
        .find(f => fs.existsSync(f));

      if (indexFile) {
        const {data: fm} = matter(fs.readFileSync(indexFile, 'utf-8'));
        registerModule(dirSlug, {
          title: fm.title ?? entry.name,
          path: derivePermalink(indexFile, path.resolve(dirPath, '..')),
          part: partName,
          position: getDirectoryPosition(fullPath),
          hasAssignment: fm.has_assignment !== false,
        }, indexFile, modules, slugsSeen);
      }

      // Process children with this directory as parent
      processDirectory(fullPath, partName, dirSlug, modules, slugsSeen);
    } else {
      const {data: fm} = matter(fs.readFileSync(fullPath, 'utf-8'));
      const slug = deriveSlug(fullPath);

      const moduleEntry: ModuleEntry = {
        title: fm.title ?? slug,
        path: derivePermalink(fullPath, path.resolve(dirPath, parentSlug !== undefined ? '../..' : '..')),
        part: partName,
        position: fm.sidebar_position ?? 0,
        hasAssignment: fm.has_assignment !== false,
      };

      if (parentSlug !== undefined) {
        moduleEntry.parent = parentSlug;
      }

      registerModule(slug, moduleEntry, fullPath, modules, slugsSeen);
    }
  }
}

function registerModule(
  slug: string,
  entry: ModuleEntry,
  filePath: string,
  modules: Record<string, ModuleEntry>,
  slugsSeen: Map<string, string>,
): void {
  if (slugsSeen.has(slug)) {
    throw new Error(
      `[module-registry] Duplicate slug "${slug}" found in:\n` +
      `  - ${slugsSeen.get(slug)}\n` +
      `  - ${filePath}\n` +
      `Rename one of the files to resolve this conflict.`
    );
  }
  slugsSeen.set(slug, filePath);
  modules[slug] = entry;
}
