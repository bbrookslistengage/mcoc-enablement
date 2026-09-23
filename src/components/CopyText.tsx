import React, { useState, useCallback } from 'react';

interface CopyTextProps {
  children: string;
}

export default function CopyText({ children }: CopyTextProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [children]);

  return (
    <div
      onClick={handleCopy}
      role="button"
      tabIndex={0}
      title="Click to copy"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCopy(); }}
      style={{
        position: 'relative',
        padding: '1rem 3.5rem 1rem 1.25rem',
        background: 'var(--color-surface-sunken)',
        border: 'var(--border-width-default) solid var(--color-border-default)',
        borderRadius: 'var(--border-radius-md)',
        fontSize: 'var(--font-size-body-small)',
        lineHeight: 'var(--line-height-body)',
        color: 'var(--color-text-primary)',
        margin: '0.75rem 0 1rem',
        cursor: 'pointer',
      }}
    >
      {children}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '0.625rem',
          right: '0.625rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2rem',
          height: '2rem',
          color: copied ? 'var(--color-status-success)' : 'var(--color-text-tertiary)',
          transition: 'color var(--transition-fast)',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {copied ? (
            <polyline points="20 6 9 17 4 12" />
          ) : (
            <>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </>
          )}
        </svg>
      </span>
    </div>
  );
}
