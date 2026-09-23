import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './Screenshot.module.css';

type ScreenshotSize = 'full' | 'wide' | 'narrow';

interface ScreenshotProps {
  src: string;
  alt: string;
  caption?: string;
  /** Controls max-width: full (100%), wide (75%), narrow (50%). Default: full. */
  size?: ScreenshotSize;
  /** Constrains image height (e.g. "400px", "50vh"). Use for tall, narrow images like property panels. */
  maxHeight?: string;
}

export default function Screenshot({ src, alt, caption, size = 'full', maxHeight }: ScreenshotProps): React.JSX.Element {
  const resolvedSrc = useBaseUrl(src);
  const imageStyle = maxHeight ? { width: 'auto', maxWidth: '100%', maxHeight } : undefined;
  return (
    <figure className={`${styles.figure} ${styles[size]}`}>
      <div className={styles.frame}>
        <img src={resolvedSrc} alt={alt} className={styles.image} style={imageStyle} />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
