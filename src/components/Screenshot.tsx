import React from 'react';
import styles from './Screenshot.module.css';

interface ScreenshotProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function Screenshot({ src, alt, caption }: ScreenshotProps): React.JSX.Element {
  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        <img src={src} alt={alt} className={styles.image} />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
