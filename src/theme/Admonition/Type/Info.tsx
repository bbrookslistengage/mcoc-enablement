import React, {type ReactNode} from 'react';
import AdmonitionLayout from '@theme/Admonition/Layout';
import type {Props} from '@theme/Admonition/Type/Info';

function IconInfo() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <line x1="8" y1="7" x2="8" y2="11" />
      <circle cx="8" cy="5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function AdmonitionTypeInfo(props: Props): ReactNode {
  return (
    <AdmonitionLayout
      {...props}
      type="info"
      icon={<IconInfo />}
      title={props.title ?? 'info'}
    />
  );
}
