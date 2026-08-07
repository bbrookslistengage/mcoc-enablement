import React, {type ReactNode} from 'react';
import AdmonitionLayout from '@theme/Admonition/Layout';
import type {Props} from '@theme/Admonition/Type/Tip';

function IconGlasses() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="4.5" cy="9" r="2.5" />
      <circle cx="11.5" cy="9" r="2.5" />
      <path d="M2 9C2 6.5 3.5 5 5 5" />
      <line x1="7" y1="9" x2="9" y2="9" />
      <path d="M14 9C14 6.5 12.5 5 11 5" />
    </svg>
  );
}

export default function AdmonitionTypeTip(props: Props): ReactNode {
  return (
    <AdmonitionLayout
      {...props}
      type="tip"
      icon={<IconGlasses />}
      title={props.title ?? 'coming from mce?'}
    />
  );
}
