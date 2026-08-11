import {type ReactNode, useState, useEffect, useCallback} from 'react';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';

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

function getModuleProgress(slug: string): {lesson: boolean; assignment: boolean} {
  if (typeof window === 'undefined') return {lesson: false, assignment: false};
  return {
    lesson: localStorage.getItem(`progress:${slug}:lesson`) === 'true',
    assignment: localStorage.getItem(`progress:${slug}:assignment`) === 'true',
  };
}

function isModuleComplete(slug: string, hasAssignment = true): boolean {
  const p = getModuleProgress(slug);
  return hasAssignment ? (p.lesson && p.assignment) : p.lesson;
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
    hasAssignment: boolean;
    children: Array<{
      slug: string;
      title: string;
      path: string;
      position: number;
      hasAssignment: boolean;
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
          hasAssignment: m.hasAssignment,
        }));

      return {
        slug: mod.slug,
        title: mod.title,
        path: mod.path,
        hasAssignment: mod.hasAssignment,
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

  const childComplete = mod.children.filter(c => isModuleComplete(c.slug, c.hasAssignment)).length;
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
            const complete = isModuleComplete(child.slug, child.hasAssignment);
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

  // Collect all leaf-level modules for progress counting
  const allLeafModules: Array<{slug: string; hasAssignment: boolean}> = [];
  for (const part of builtParts) {
    for (const mod of part.modules) {
      if (mod.children.length > 0) {
        allLeafModules.push(...mod.children.map(c => ({slug: c.slug, hasAssignment: c.hasAssignment})));
      } else {
        allLeafModules.push({slug: mod.slug, hasAssignment: mod.hasAssignment});
      }
    }
  }

  const [completedCount, setCompletedCount] = useState(0);
  const totalModules = allLeafModules.length;

  const recalculate = useCallback(() => {
    const count = allLeafModules.filter(m => isModuleComplete(m.slug, m.hasAssignment)).length;
    setCompletedCount(count);
  }, [allLeafModules]);

  useEffect(() => {
    recalculate();
    window.addEventListener('progress-updated', recalculate);
    return () => window.removeEventListener('progress-updated', recalculate);
  }, [recalculate]);

  const handleReset = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      for (const {slug} of allLeafModules) {
        localStorage.removeItem(`progress:${slug}:lesson`);
        localStorage.removeItem(`progress:${slug}:assignment`);
      }
      window.dispatchEvent(new Event('progress-updated'));
      recalculate();
    }
  }, [allLeafModules, recalculate]);

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
              partLeafComplete += mod.children.filter(c => isModuleComplete(c.slug, c.hasAssignment)).length;
            } else {
              partLeafCount += 1;
              partLeafComplete += isModuleComplete(mod.slug, mod.hasAssignment) ? 1 : 0;
            }
          }

          const firstModulePath = part.modules[0]?.path ?? '#';

          return (
            <div key={part.label} className="part-section">
              <Link to={firstModulePath} className="part-section__header">
                <div className="part-section__top-row">
                  <span className="part-section__number">{partNum ? `Part ${partNum}` : partName}</span>
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
                  const complete = isModuleComplete(mod.slug, mod.hasAssignment);
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
