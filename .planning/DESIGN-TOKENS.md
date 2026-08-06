# Design Token Rules

This document defines the rules for visual styling in this project. The actual token values (colors, spacing, typography) will be defined in `src/css/tokens.css` when the Docusaurus project is scaffolded. This document governs how those tokens are created, named, used, and enforced.

## Core Principles

1. **Every visual value has a name.** If a color, spacing, font size, shadow, border radius, or transition appears in code, it comes from a named token. No raw hex values. No magic pixel numbers. No hardcoded rem values outside the token file.

2. **Names describe purpose, not appearance.** `--color-brand-primary` not `--color-blue`. `--space-stack-section` not `--space-32`. `--color-status-warning` not `--color-orange`. A developer reading the token name should understand *why* it is used, not what it looks like.

3. **One source of truth.** All tokens live in a single file: `src/css/tokens.css`. This file defines CSS custom properties on `:root`. Every component, page, and style references these properties. Nothing else defines visual values.

4. **No Tailwind default scale.** If we use Tailwind, its default color palette, spacing scale, and font sizes must be fully replaced with our token system. No `bg-blue-500`, no `p-4`, no `text-lg` from Tailwind defaults. Only semantic utility classes mapped to our tokens.

5. **No icon library dependencies.** No Lucide React. No Heroicons. No Font Awesome. No icon library that imports hundreds of unused icons. If an icon is needed, source or create the SVG individually and place it in `src/icons/`. Keep the icon count minimal. This is a documentation site.

## Token Categories

The token file should be organized into these sections:

- **Color: Brand** (primary, secondary, hover states, subtle backgrounds)
- **Color: Surface** (page, raised, sunken, overlay backgrounds)
- **Color: Text** (primary, secondary, tertiary, inverse, link)
- **Color: Border** (default, strong, focus)
- **Color: Status** (info, success, warning, caution, with subtle variants for backgrounds)
- **Color: Progress** (module completion states, mapped to status colors where possible)
- **Color: Code** (code block background/text, inline code background/text)
- **Typography: Font family** (body, heading, mono)
- **Typography: Size** (named by role: body, body-small, h1, h2, etc.)
- **Typography: Weight** (normal, medium, semibold, bold)
- **Typography: Line height** (tight, body, relaxed)
- **Spacing** (named by usage: inline-xs through inline-md, stack-xs through stack-2xl, padding-card, padding-page)
- **Borders** (radius: sm, md, lg, full; width: default, strong)
- **Shadows** (sm, md, lg)
- **Transitions** (fast, default, slow)
- **Layout** (content max width, sidebar width)

## Naming Convention

```
--{category}-{subcategory}-{variant}

Examples:
--color-brand-primary
--color-text-secondary
--space-stack-lg
--font-size-h2
--border-radius-md
--shadow-sm
```

## Usage Rules

### In CSS
Always reference tokens via `var()`:
```css
.module-card {
  background: var(--color-surface-raised);
  padding: var(--space-padding-card);
}
```

Never write raw values:
```css
/* WRONG */
.module-card {
  background: #f8fafc;
  padding: 24px;
}
```

### In React/JSX
Avoid inline styles. If you must use them for dynamic values, reference tokens via CSS custom properties:
```jsx
<div style={{ color: 'var(--color-text-secondary)' }}>
```

### If Using Tailwind
Configure `tailwind.config.js` to replace (not extend) all scales with our tokens:
```js
theme: {
  // Replace, do not extend. This disables all defaults.
  colors: { /* mapped to our --color-* tokens */ },
  spacing: { /* mapped to our --space-* tokens */ },
  fontSize: { /* mapped to our --font-size-* tokens */ },
  // ... etc
}
```

## Adding New Tokens

1. Check if an existing token covers the use case. Reuse before creating.
2. Name it by purpose. `--color-exam-overdue` not `--color-red-dark`.
3. Add it to `src/css/tokens.css` in the appropriate section with a comment if the name is not self-explanatory.
4. Do not create one-off tokens. If only one element uses it, ask whether an existing token works instead.

## Dark Mode

Not planned for v1. The token system makes dark mode straightforward to add later: override token values inside `[data-theme='dark']`.

## Enforcement

During code review, reject any change that:
- Contains a raw hex color outside of `tokens.css`
- Contains a raw pixel or rem value for spacing, sizing, or borders outside of `tokens.css`
- Imports from an icon library (Lucide, Heroicons, Font Awesome, etc.)
- Uses Tailwind default utility classes
- Adds a new visual value without a corresponding token in `tokens.css`
