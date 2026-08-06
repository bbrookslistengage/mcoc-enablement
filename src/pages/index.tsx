import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import ProgressOverview from '@site/src/components/ProgressOverview';

export default function Home(): ReactNode {
  return (
    <Layout
      title="Course Overview"
      description="Self-paced Marketing Cloud Advanced enablement course."
    >
      <main>
        <ProgressOverview />
      </main>
    </Layout>
  );
}
