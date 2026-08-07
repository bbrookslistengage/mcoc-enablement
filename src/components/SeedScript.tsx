import React, { useState, useMemo } from 'react';
import { Highlight } from 'prism-react-renderer';
import { useColorMode } from '@docusaurus/theme-common';

const CONTACTS = [
  { displayName: 'Maria Chen',       first: 'Maria',   last: 'Chen',       slug: 'mariac',  scenario: 'VIP customer with overdue eye exam and multiple products' },
  { displayName: 'James Okafor',     first: 'James',   last: 'Okafor',     slug: 'jokafar', scenario: 'Top loyalty tier, recent exam' },
  { displayName: 'Sofia Reyes',      first: 'Sofia',   last: 'Reyes',      slug: 'sofiar',  scenario: 'New signup, no purchases, no engagement' },
  { displayName: 'David Kim',        first: 'David',   last: 'Kim',        slug: 'davidk',  scenario: 'Lapsed buyer (last purchase over 200 days ago), overdue exam' },
  { displayName: 'Aisha Patel',      first: 'Aisha',   last: 'Patel',      slug: 'aishap',  scenario: 'VIP, single product family' },
  { displayName: 'Carlos Mendez',    first: 'Carlos',  last: 'Mendez',     slug: 'carlosm', scenario: 'Low loyalty tier, one purchase' },
  { displayName: 'Wei Zhang',        first: 'Wei',     last: 'Zhang',      slug: 'weiz',    scenario: 'Power buyer, all 4 products, recent exam' },
  { displayName: 'Fatima Al-Hassan', first: 'Fatima',  last: 'Al-Hassan',  slug: 'fatimaa', scenario: 'Loyalty tier boundary case (exactly 25,000 points)' },
  { displayName: "Ryan O'Brien",     first: 'Ryan',    last: "O\\'Brien",  slug: 'ryano',   scenario: 'Has had an exam but no purchases' },
  { displayName: 'Priya Sharma',     first: 'Priya',   last: 'Sharma',     slug: 'priyas',  scenario: 'Multi-product buyer, recent exam' },
];

const PLACEHOLDER_EMAIL = 'you@yourdomain.com';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function deriveAlias(email: string, slug: string): string {
  const atIndex = email.lastIndexOf('@');
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  return `${local}+${slug}@${domain}`;
}

function buildScript(email: string, valid: boolean): string {
  const contactLines = CONTACTS.map(({ first, last, slug }) => {
    const contactEmail = valid ? deriveAlias(email, slug) : `you+${slug}@yourdomain.com`;
    return `    new Contact(FirstName='${first}', LastName='${last}', Email='${contactEmail}'),`;
  }).join('\n');

  return `// =============================================================
// LEOptical Seed Script - TBD
// Full implementation coming soon. This script will create:
//   - ~60,000 Contacts with realistic names and loyalty data
//   - 5 Products (4 lens families + frames)
//   - 3 Campaigns (Spring Collection 2026, VisionCare Rewards
//     Launch, Back to School)
//   - 10 test contacts with your email address (shown below)
//
// Run in: Developer Console > Debug > Open Execute Anonymous Window
// =============================================================

// --- Test contacts (your email address) ---
// These are the only contacts with a real deliverable email.
// The remaining ~59,990 contacts will use @example.com addresses.

List<Contact> testContacts = new List<Contact>{
${contactLines}
};

insert testContacts;
System.debug('>>> Inserted ' + testContacts.size() + ' test contacts.');
for (Contact c : testContacts) {
    System.debug('>>> ' + c.FirstName + ' ' + c.LastName + ' | ' + c.Email + ' | ID: ' + c.Id);
}`;
}

// Light and dark themes matching Docusaurus defaults
const LIGHT_THEME = {
  plain: { backgroundColor: '#f6f8fa', color: '#24292e' },
  styles: [
    { types: ['comment', 'block-comment', 'prolog', 'doctype', 'cdata'], style: { color: '#6a737d', fontStyle: 'italic' as const } },
    { types: ['string', 'char'], style: { color: '#032f62' } },
    { types: ['keyword', 'operator'], style: { color: '#d73a49' } },
    { types: ['class-name', 'function'], style: { color: '#6f42c1' } },
    { types: ['number'], style: { color: '#005cc5' } },
    { types: ['punctuation'], style: { color: '#24292e' } },
  ],
};

const DARK_THEME = {
  plain: { backgroundColor: '#1e1e1e', color: '#d4d4d4' },
  styles: [
    { types: ['comment', 'block-comment', 'prolog', 'doctype', 'cdata'], style: { color: '#6a9955', fontStyle: 'italic' as const } },
    { types: ['string', 'char'], style: { color: '#ce9178' } },
    { types: ['keyword', 'operator'], style: { color: '#569cd6' } },
    { types: ['class-name', 'function'], style: { color: '#dcdcaa' } },
    { types: ['number'], style: { color: '#b5cea8' } },
    { types: ['punctuation'], style: { color: '#d4d4d4' } },
  ],
};

export default function SeedScript(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const { colorMode } = useColorMode();

  const valid = isValidEmail(email);
  const theme = colorMode === 'dark' ? DARK_THEME : LIGHT_THEME;

  const script = useMemo(() => buildScript(email, valid), [email, valid]);

  function handleCopy() {
    navigator.clipboard.writeText(script).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Email input */}
      <label
        htmlFor="seed-email"
        style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}
      >
        Your email address
      </label>
      <input
        id="seed-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={PLACEHOLDER_EMAIL}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '0.5rem 0.75rem',
          fontSize: '1rem',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: '4px',
          marginBottom: '0.5rem',
          background: 'var(--ifm-background-color)',
          color: 'var(--ifm-font-color-base)',
        }}
      />
      {email && !valid && (
        <p style={{ color: 'var(--ifm-color-danger)', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>
          Enter a valid email address to update the script.
        </p>
      )}
      {valid && (
        <p style={{ color: 'var(--ifm-color-success)', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>
          Script updated. The 10 test contacts will be created with your email address.
        </p>
      )}

      {/* Highlighted code block */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Highlight code={script} language="java" theme={theme}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              style={{
                ...style,
                padding: '1rem',
                paddingTop: '2.75rem',
                borderRadius: '6px',
                overflowX: 'auto',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
        <button
          onClick={handleCopy}
          disabled={!valid}
          title={valid ? 'Copy script' : 'Enter your email address above to enable copying'}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            padding: '0.3rem 0.9rem',
            fontSize: '0.8rem',
            cursor: valid ? 'pointer' : 'not-allowed',
            background: copied ? 'var(--ifm-color-success)' : 'var(--ifm-color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            opacity: valid ? 1 : 0.4,
            transition: 'background 0.2s',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {!valid && (
        <p style={{ fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
          Enter your email address above to enable copying. Only the 10 test contacts will use your address. The remaining ~59,990 contacts use <code>@example.com</code> addresses that never deliver to a real inbox.
        </p>
      )}

      {/* Dynamic contact table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>Contact</th>
            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>Email in the script</th>
            <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>What they test</th>
          </tr>
        </thead>
        <tbody>
          {CONTACTS.map(({ displayName, slug, scenario }) => {
            const contactEmail = valid ? deriveAlias(email, slug) : `you+${slug}@yourdomain.com`;
            return (
              <tr key={slug} style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>
                <td style={{ padding: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}>{displayName}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>
                  <code style={{ fontSize: '0.8rem' }}>{contactEmail}</code>
                </td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{scenario}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
