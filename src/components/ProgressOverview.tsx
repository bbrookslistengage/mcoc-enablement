import {type ReactNode, useState, useEffect, useCallback} from 'react';
import Link from '@docusaurus/Link';

interface ModuleInfo {
  slug: string;
  title: string;
  path: string;
}

interface PartInfo {
  label: string;
  description: string;
  modules: ModuleInfo[];
}

const COURSE_PARTS: PartInfo[] = [
  {
    label: 'Introduction',
    description: 'Course orientation, platform context, and the mindset you need before diving in.',
    modules: [
      {slug: 'how-this-course-works', title: 'How This Course Works', path: '/introduction/how-this-course-works'},
      {slug: 'mca-vs-mce', title: 'MCA vs. MCE', path: '/introduction/mca-vs-mce'},
      {slug: 'intro-to-data-360', title: 'Introduction to Data 360', path: '/introduction/intro-to-data-360'},
      {slug: 'navigating-a-new-platform', title: 'Navigating a New Platform', path: '/introduction/navigating-a-new-platform'},
    ],
  },
  {
    label: 'Part 1: Setup & Foundations',
    description: 'Provision your SDO, configure domains and business units, and build the consent framework.',
    modules: [
      {slug: 'getting-started', title: 'Getting Started', path: '/part-1-foundations/getting-started'},
      {slug: 'domain-setup', title: 'Domain Setup', path: '/part-1-foundations/domain-setup'},
      {slug: 'business-units', title: 'Business Units and Governance', path: '/part-1-foundations/business-units'},
      {slug: 'consent-fundamentals', title: 'Consent Fundamentals', path: '/part-1-foundations/consent-fundamentals'},
      {slug: 'consent-configuration', title: 'Consent Configuration', path: '/part-1-foundations/consent-configuration'},
    ],
  },
  {
    label: 'Part 2: Data & Audiences',
    description: 'Ingest data, build your data model, resolve identities, and create segments.',
    modules: [
      {slug: 'data-360-dmos', title: 'Data 360 and Data Model Objects', path: '/part-2-data/data-360-dmos'},
      {slug: 'crm-data-ingestion', title: 'CRM Data Ingestion', path: '/part-2-data/crm-data-ingestion'},
      {slug: 'data-graphs', title: 'Data Graphs', path: '/part-2-data/data-graphs'},
      {slug: 'identity-resolution', title: 'Identity Resolution', path: '/part-2-data/identity-resolution'},
      {slug: 'segmentation', title: 'Segmentation', path: '/part-2-data/segmentation'},
      {slug: 'consumption-entitlements', title: 'Consumption and Entitlements', path: '/part-2-data/consumption-entitlements'},
    ],
  },
  {
    label: 'Part 3: Building for the Client',
    description: 'Create content, build emails, configure flows, design landing pages, and set up activations.',
    modules: [
      {slug: 'salesforce-cms', title: 'Salesforce CMS and Content Management', path: '/part-3-building/salesforce-cms'},
      {slug: 'email-builder', title: 'Email Builder Deep Dive', path: '/part-3-building/email-builder'},
      {slug: 'personalization', title: 'Personalization: Handlebars and AMPscript', path: '/part-3-building/personalization'},
      {slug: 'flow-fundamentals', title: 'Flow Fundamentals', path: '/part-3-building/flow-fundamentals'},
      {slug: 'flow-orchestration', title: 'Flow Orchestration', path: '/part-3-building/flow-orchestration'},
      {slug: 'landing-pages', title: 'Landing Pages and Forms', path: '/part-3-building/landing-pages'},
      {slug: 'landing-pages-advanced', title: 'Landing Pages: Advanced', path: '/part-3-building/landing-pages-advanced'},
      {slug: 'activation-templates', title: 'Activation Templates', path: '/part-3-building/activation-templates'},
      {slug: 'messaging-channels', title: 'Messaging Channels', path: '/part-3-building/messaging-channels'},
    ],
  },
  {
    label: 'Part 4: AI & Intelligence',
    description: 'Explore Agentforce, conversational messaging, and predictive AI features.',
    modules: [
      {slug: 'agentforce', title: 'Agentforce for Marketing', path: '/part-4-ai/agentforce'},
      {slug: 'conversational-messaging', title: 'Conversational Messaging', path: '/part-4-ai/conversational-messaging'},
      {slug: 'predictive-ai', title: 'Predictive AI', path: '/part-4-ai/predictive-ai'},
    ],
  },
  {
    label: 'Part 5: Analytics',
    description: 'Build dashboards and surface marketing data across the Salesforce platform.',
    modules: [
      {slug: 'reporting-dashboards', title: 'Reporting and Dashboards', path: '/part-5-analytics/reporting-dashboards'},
    ],
  },
  {
    label: 'Part 6: Capstone',
    description: 'Put it all together with a multi-channel implementation project.',
    modules: [
      {slug: 'capstone-project', title: 'Capstone Project', path: '/part-6-capstone/capstone-project'},
    ],
  },
];

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

function clearAllProgress(): void {
  if (typeof window === 'undefined') return;
  const allModules = COURSE_PARTS.flatMap(p => p.modules);
  for (const m of allModules) {
    localStorage.removeItem(`progress:${m.slug}:lesson`);
    localStorage.removeItem(`progress:${m.slug}:assignment`);
  }
  window.dispatchEvent(new Event('progress-updated'));
}

function extractPartNumber(label: string): string {
  const match = label.match(/Part (\d+)/);
  return match ? match[1] : '';
}

function extractPartName(label: string): string {
  const match = label.match(/Part \d+:\s*(.+)/);
  return match ? match[1] : label;
}

export default function ProgressOverview(): ReactNode {
  const [completedCount, setCompletedCount] = useState(0);
  const totalModules = COURSE_PARTS.reduce((sum, p) => sum + p.modules.length, 0);

  const recalculate = useCallback(() => {
    const count = COURSE_PARTS
      .flatMap(p => p.modules)
      .filter(m => isModuleComplete(m.slug))
      .length;
    setCompletedCount(count);
  }, []);

  useEffect(() => {
    recalculate();
    window.addEventListener('progress-updated', recalculate);
    return () => window.removeEventListener('progress-updated', recalculate);
  }, [recalculate]);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      clearAllProgress();
      recalculate();
    }
  }, [recalculate]);

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
        {COURSE_PARTS.map(part => {
          const partNum = extractPartNumber(part.label);
          const partName = extractPartName(part.label);
          const partComplete = part.modules.filter(m => isModuleComplete(m.slug)).length;
          const firstModulePath = part.modules[0]?.path ?? '#';

          return (
            <div key={part.label} className="part-section">
              <Link to={firstModulePath} className="part-section__header">
                <div className="part-section__top-row">
                  <span className="part-section__number">Part {partNum}</span>
                  <span className="part-section__count">
                    {partComplete}/{part.modules.length}
                  </span>
                </div>
                <h2 className="part-section__title">{partName}</h2>
                <p className="part-section__description">{part.description}</p>
              </Link>
              <ul className="part-section__modules">
                {part.modules.map(mod => {
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

export {COURSE_PARTS};
export type {ModuleInfo, PartInfo};
