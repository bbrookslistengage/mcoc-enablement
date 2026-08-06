import type {ReactNode} from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import ProgressCheckbox from '@site/src/components/ProgressCheckbox';

type Props = WrapperProps<typeof LayoutType>;

function extractSlug(docId: string): string {
  const parts = docId.split('/');
  return parts[parts.length - 1];
}

export default function LayoutWrapper(props: Props): ReactNode {
  const {metadata} = useDoc();
  const {previous, next} = metadata;
  const slug = extractSlug(metadata.id);

  return (
    <>
      <Layout {...props} />
      <div className="module-footer">
        <ProgressCheckbox moduleSlug={slug} />
        <nav className="module-footer__nav">
          <div>
            {previous && (
              <Link to={previous.permalink} className="module-footer__nav-link">
                &larr; {previous.title}
              </Link>
            )}
          </div>
          <div>
            {next && (
              <Link to={next.permalink} className="module-footer__nav-link">
                {next.title} &rarr;
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
