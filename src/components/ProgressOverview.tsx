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
    label: 'Part 1: Setup & Foundations',
    description: 'Provision your SDO, configure domains and business units, and build the consent framework.',
    modules: [
      {slug: 'getting-started', title: 'Module 1: Getting Started', path: '/part-1-foundations/getting-started'},
      {slug: 'domain-setup', title: 'Module 2: Domain Setup', path: '/part-1-foundations/domain-setup'},
      {slug: 'business-units', title: 'Module 3: Business Units and Governance', path: '/part-1-foundations/business-units'},
      {slug: 'consent-fundamentals', title: 'Module 4: Consent Fundamentals', path: '/part-1-foundations/consent-fundamentals'},
      {slug: 'consent-configuration', title: 'Module 5: Consent Configuration', path: '/part-1-foundations/consent-configuration'},
    ],
  },
  {
    label: 'Part 2: Data & Audiences',
    description: 'Ingest data, build your data model, resolve identities, and create segments.',
    modules: [
      {slug: 'data-360-dmos', title: 'Module 6: Data 360 and Data Model Objects', path: '/part-2-data/data-360-dmos'},
      {slug: 'crm-data-ingestion', title: 'Module 7: CRM Data Ingestion', path: '/part-2-data/crm-data-ingestion'},
      {slug: 'data-graphs', title: 'Module 8: Data Graphs', path: '/part-2-data/data-graphs'},
      {slug: 'identity-resolution', title: 'Module 9: Identity Resolution', path: '/part-2-data/identity-resolution'},
      {slug: 'segmentation', title: 'Module 10: Segmentation', path: '/part-2-data/segmentation'},
      {slug: 'consumption-entitlements', title: 'Module 11: Consumption and Entitlements', path: '/part-2-data/consumption-entitlements'},
    ],
  },
  {
    label: 'Part 3: Building for the Client',
    description: 'Create content, build emails, configure flows, design landing pages, and set up activations.',
    modules: [
      {slug: 'salesforce-cms', title: 'Module 12: Salesforce CMS and Content Management', path: '/part-3-building/salesforce-cms'},
      {slug: 'email-builder', title: 'Module 13: Email Builder Deep Dive', path: '/part-3-building/email-builder'},
      {slug: 'personalization', title: 'Module 14: Personalization: Handlebars and AMPscript', path: '/part-3-building/personalization'},
      {slug: 'flow-fundamentals', title: 'Module 15: Flow Fundamentals', path: '/part-3-building/flow-fundamentals'},
      {slug: 'flow-orchestration', title: 'Module 16: Flow Orchestration', path: '/part-3-building/flow-orchestration'},
      {slug: 'landing-pages', title: 'Module 17: Landing Pages and Forms', path: '/part-3-building/landing-pages'},
      {slug: 'landing-pages-advanced', title: 'Module 18: Landing Pages: Advanced', path: '/part-3-building/landing-pages-advanced'},
      {slug: 'activation-templates', title: 'Module 19: Activation Templates', path: '/part-3-building/activation-templates'},
      {slug: 'messaging-channels', title: 'Module 20: Messaging Channels', path: '/part-3-building/messaging-channels'},
    ],
  },
  {
    label: 'Part 4: AI & Intelligence',
    description: 'Explore Agentforce, conversational messaging, and predictive AI features.',
    modules: [
      {slug: 'agentforce', title: 'Module 21: Agentforce for Marketing', path: '/part-4-ai/agentforce'},
      {slug: 'conversational-messaging', title: 'Module 22: Conversational Messaging', path: '/part-4-ai/conversational-messaging'},
      {slug: 'predictive-ai', title: 'Module 23: Predictive AI', path: '/part-4-ai/predictive-ai'},
    ],
  },
  {
    label: 'Part 5: Analytics',
    description: 'Build dashboards and surface marketing data across the Salesforce platform.',
    modules: [
      {slug: 'reporting-dashboards', title: 'Module 24: Reporting and Dashboards', path: '/part-5-analytics/reporting-dashboards'},
    ],
  },
  {
    label: 'Part 6: Capstone',
    description: 'Put it all together with a multi-channel implementation project.',
    modules: [
      {slug: 'capstone-project', title: 'Module 25: Capstone Project', path: '/part-6-capstone/capstone-project'},
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
    <div className="course-overview">
      <div className="course-overview__header">
        <h1 className="course-overview__title">MCA Enablement Course</h1>
        <p className="course-overview__subtitle">
          Self-paced Marketing Cloud Advanced training, modeled after The Odin Project.
          Build a real MCA implementation for LEOptical, a fictional eyecare client.
        </p>
      </div>

      <div className="course-overview__progress-bar">
        <div className="course-overview__progress-track">
          <div
            className="course-overview__progress-fill"
            style={{width: `${pct}%`}}
          />
        </div>
        <p className="course-overview__progress-text">
          {completedCount} of {totalModules} modules complete ({pct}%)
        </p>
      </div>

      {COURSE_PARTS.map(part => (
        <div key={part.label} className="course-overview__part">
          <div className="course-overview__part-header">
            <h2 className="course-overview__part-title">{part.label}</h2>
          </div>
          <p className="course-overview__part-description">{part.description}</p>
          <ul className="course-overview__module-list">
            {part.modules.map(mod => {
              const complete = isModuleComplete(mod.slug);
              return (
                <li key={mod.slug} className="course-overview__module-item">
                  <span
                    className={`course-overview__module-status ${complete ? 'course-overview__module-status--complete' : ''}`}
                  />
                  <Link to={mod.path} className="course-overview__module-link">
                    {mod.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="course-overview__reset">
        <button
          type="button"
          className="course-overview__reset-btn"
          onClick={handleReset}
        >
          Reset all progress
        </button>
      </div>
    </div>
  );
}

export {COURSE_PARTS};
export type {ModuleInfo, PartInfo};
