import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './Screenshot.module.css';

interface ScreenshotProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function Screenshot({ src, alt, caption }: ScreenshotProps): React.JSX.Element {
  const resolvedSrc = useBaseUrl(src);
  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        <img src={resolvedSrc} alt={alt} className={styles.image} />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
