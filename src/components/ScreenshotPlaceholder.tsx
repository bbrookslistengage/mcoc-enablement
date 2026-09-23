import React from 'react';
import styles from './ScreenshotPlaceholder.module.css';

type ScreenshotSize = 'full' | 'wide' | 'narrow';

interface ScreenshotPlaceholderProps {
  alt: string;
  /** Controls max-width: full (100%), wide (75%), narrow (50%). Default: full. */
  size?: ScreenshotSize;
}

export default function ScreenshotPlaceholder({ alt, size = 'full' }: ScreenshotPlaceholderProps): React.JSX.Element {
  return (
    <figure className={`${styles.figure} ${styles[size]}`}>
      <div className={styles.frame}>
        <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <p className={styles.label}>Screenshot needed</p>
        <p className={styles.description}>{alt}</p>
      </div>
    </figure>
  );
}
