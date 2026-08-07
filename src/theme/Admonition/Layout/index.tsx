import React, {type ReactNode} from 'react';
import type {Props} from '@theme/Admonition/Layout';
import styles from './styles.module.css';

export default function AdmonitionLayout({
  type,
  icon,
  title,
  children,
  className,
}: Props): ReactNode {
  return (
    <div className={`${styles.admonition} ${styles[`admonition--${type}`] ?? ''} ${className ?? ''}`}>
      <div className={styles.admonitionHeader}>
        {icon && <span className={styles.admonitionIcon}>{icon}</span>}
        <span className={styles.admonitionTitle}>{title}</span>
      </div>
      {children && <div className={styles.admonitionContent}>{children}</div>}
    </div>
  );
}
