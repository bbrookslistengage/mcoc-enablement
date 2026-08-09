import {type ReactNode, useState, useEffect, useCallback} from 'react';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';

interface ModuleEntry {
  title: string;
  path: string;
  parent?: string;
  part: string;
  position: number;
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

function getModuleProgress(slug: string): {lesson: boolean; assignment: boolean} {
  if (typeof window === 'undefined') return {lesson: false, assignment: false};
  return {
    lesson: localStorage.getItem(`progress:${slug}:lesson`) === 'true',
    assignment: localStorage.getItem(`progress:${slug}:assignment`) === 'true',
  };
}

function isModuleComplete(slug: string): boolean {
  const p = getModuleProgress(slug);
  return p.lesson && p.assignment;
}

function extractPartNumber(label: string): string {
  const match = label.match(/Part (\d+)/);
  return match ? match[1] : '';
}

function extractPartName(label: string): string {
  const match = label.match(/Part \d+:\s*(.+)/);
  return match ? match[1] : label;
}

interface BuiltPart {
  label: string;
  description: string;
  modules: Array<{
    slug: string;
    title: string;
    path: string;
    children: Array<{
      slug: string;
      title: string;
      path: string;
      position: number;
    }>;
    position: number;
  }>;
}

function buildPartsFromRegistry(data: RegistryData): BuiltPart[] {
  const {modules, parts} = data;

  return parts.map(part => {
    // Get all modules in this part
    const partModules = Object.entries(modules)
      .filter(([, entry]) => entry.part === part.dirName)
      .map(([slug, entry]) => ({slug, ...entry}));

    // Separate top-level modules (no parent) from children
    const topLevel = partModules
      .filter(m => !m.parent)
      .sort((a, b) => a.position - b.position);

    // Build module list with children
    const builtModules = topLevel.map(mod => {
      const children = partModules
        .filter(m => m.parent === mod.slug)
        .sort((a, b) => a.position - b.position)
        .map(m => ({
          slug: m.slug,
          title: m.title,
          path: m.path,
          position: m.position,
        }));

      return {
        slug: mod.slug,
        title: mod.title,
        path: mod.path,
        children,
        position: mod.position,
      };
    });

    return {
      label: part.label,
      description: part.description,
      modules: builtModules,
    };
  });
}

function AccordionModule({
  mod,
}: {
  mod: BuiltPart['modules'][number];
}): ReactNode {
  const [expanded, setExpanded] = useState(false);

  const childComplete = mod.children.filter(c => isModuleComplete(c.slug)).length;
  const allChildrenComplete = childComplete === mod.children.length;

  return (
    <li className="part-section__module part-section__module--accordion">
      <div className="part-section__module-header">
        <span
          className={`part-section__status${allChildrenComplete ? ' part-section__status--complete' : ''}`}
        />
        <Link to={mod.path} className="part-section__module-link">
          {mod.title}
        </Link>
        <button
          type="button"
          className={`part-section__accordion-toggle${expanded ? ' part-section__accordion-toggle--open' : ''}`}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${mod.title} sub-modules`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="part-section__child-count">
          {childComplete}/{mod.children.length}
        </span>
      </div>
      {expanded && (
        <ul className="part-section__submodules">
          {mod.children.map(child => {
            const complete = isModuleComplete(child.slug);
            return (
              <li key={child.slug} className="part-section__module part-section__module--sub">
                <span
                  className={`part-section__status${complete ? ' part-section__status--complete' : ''}`}
                />
                <Link to={child.path} className="part-section__module-link">
                  {child.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

export default function ProgressOverview(): ReactNode {
  const registryData = usePluginData('module-registry') as RegistryData;
  const builtParts = buildPartsFromRegistry(registryData);

  // Collect all leaf-level slugs for progress counting
  const allLeafSlugs: string[] = [];
  for (const part of builtParts) {
    for (const mod of part.modules) {
      if (mod.children.length > 0) {
        allLeafSlugs.push(...mod.children.map(c => c.slug));
      } else {
        allLeafSlugs.push(mod.slug);
      }
    }
  }

  const [completedCount, setCompletedCount] = useState(0);
  const totalModules = allLeafSlugs.length;

  const recalculate = useCallback(() => {
    const count = allLeafSlugs.filter(slug => isModuleComplete(slug)).length;
    setCompletedCount(count);
  }, [allLeafSlugs]);

  useEffect(() => {
    recalculate();
    window.addEventListener('progress-updated', recalculate);
    return () => window.removeEventListener('progress-updated', recalculate);
  }, [recalculate]);

  const handleReset = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      for (const slug of allLeafSlugs) {
        localStorage.removeItem(`progress:${slug}:lesson`);
        localStorage.removeItem(`progress:${slug}:assignment`);
      }
      window.dispatchEvent(new Event('progress-updated'));
      recalculate();
    }
  }, [allLeafSlugs, recalculate]);

  const pct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <>
      <div className="course-progress">
        <div className="course-progress__bar-wrap">
          <div className="course-progress__track">
            <div
              className="course-progress__fill"
              style={{width: `${pct}%`}}
            />
          </div>
          <span className="course-progress__label">
            {completedCount}/{totalModules} complete
          </span>
        </div>
      </div>

      <div className="course-parts">
        {builtParts.map(part => {
          const partNum = extractPartNumber(part.label);
          const partName = extractPartName(part.label);

          // Count completed leaf modules in this part
          let partLeafCount = 0;
          let partLeafComplete = 0;
          for (const mod of part.modules) {
            if (mod.children.length > 0) {
              partLeafCount += mod.children.length;
              partLeafComplete += mod.children.filter(c => isModuleComplete(c.slug)).length;
            } else {
              partLeafCount += 1;
              partLeafComplete += isModuleComplete(mod.slug) ? 1 : 0;
            }
          }

          const firstModulePath = part.modules[0]?.path ?? '#';

          return (
            <div key={part.label} className="part-section">
              <Link to={firstModulePath} className="part-section__header">
                <div className="part-section__top-row">
                  <span className="part-section__number">Part {partNum}</span>
                  <span className="part-section__count">
                    {partLeafComplete}/{partLeafCount}
                  </span>
                </div>
                <h2 className="part-section__title">{partName}</h2>
                <p className="part-section__description">{part.description}</p>
              </Link>
              <ul className="part-section__modules">
                {part.modules.map(mod => {
                  if (mod.children.length > 0) {
                    return <AccordionModule key={mod.slug} mod={mod} />;
                  }
                  const complete = isModuleComplete(mod.slug);
                  return (
                    <li key={mod.slug} className="part-section__module">
                      <span
                        className={`part-section__status${complete ? ' part-section__status--complete' : ''}`}
                      />
                      <Link to={mod.path} className="part-section__module-link">
                        {mod.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="course-footer-actions">
        <button
          type="button"
          className="course-footer-actions__reset-btn"
          onClick={handleReset}
        >
          Reset all progress
        </button>
      </div>
    </>
  );
}
