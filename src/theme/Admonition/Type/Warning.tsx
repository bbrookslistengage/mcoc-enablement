import React, {type ReactNode} from 'react';
import AdmonitionLayout from '@theme/Admonition/Layout';
import type {Props} from '@theme/Admonition/Type/Warning';

function IconWarning() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M7.12 2.5L1.25 13h13.5L8.88 2.5a1 1 0 00-1.76 0z" />
      <line x1="8" y1="7" x2="8" y2="10" />
      <circle cx="8" cy="12" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function AdmonitionTypeWarning(props: Props): ReactNode {
  return (
    <AdmonitionLayout
      {...props}
      type="warning"
      icon={<IconWarning />}
      title={props.title ?? 'heads up'}
    />
  );
}
