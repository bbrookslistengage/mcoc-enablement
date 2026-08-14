import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import ProgressOverview from '@site/src/components/ProgressOverview';

export default function Home(): ReactNode {
  return (
    <Layout
      title="Course Overview"
      description="Self-paced Marketing Cloud Next (Advanced Edition) enablement course by ListEngage."
    >
      <main>
        <section className="course-hero">
          <div className="course-hero__shapes" aria-hidden="true">
            <div className="course-hero__shape course-hero__shape--circle-1">
              <svg viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="26" stroke="#F19C2E" strokeWidth="4" />
              </svg>
            </div>
            <div className="course-hero__shape course-hero__shape--circle-2">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" stroke="#009AD7" strokeWidth="4" />
              </svg>
            </div>
            <div className="course-hero__shape course-hero__shape--square-1">
              <svg viewBox="0 0 50 50" fill="none">
                <rect x="3" y="3" width="44" height="44" stroke="#8FB339" strokeWidth="4" />
              </svg>
            </div>
            <div className="course-hero__shape course-hero__shape--square-2">
              <svg viewBox="0 0 40 40" fill="none">
                <rect x="3" y="3" width="34" height="34" stroke="#F19C2E" strokeWidth="4" />
              </svg>
            </div>
            <div className="course-hero__shape course-hero__shape--tri-1">
              <svg viewBox="0 0 60 52" fill="none">
                <polygon points="30,4 4,48 56,48" stroke="#009AD7" strokeWidth="4" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="course-hero__shape course-hero__shape--tri-2">
              <svg viewBox="0 0 50 44" fill="none">
                <polygon points="25,4 4,40 46,40" stroke="#8FB339" strokeWidth="4" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="course-hero__inner">
            <div className="course-hero__label">ListEngage Enablement</div>
            <h1 className="course-hero__title">
              Marketing Cloud{' '}
              <span className="course-hero__title-accent">Next</span>
            </h1>
            <p className="course-hero__subtitle">
              Self-paced training. Build a real Marketing Cloud Next implementation
              for LEOptical, from data model to multi-channel campaigns.
            </p>
          </div>
        </section>
        <ProgressOverview />
      </main>
    </Layout>
  );
}
