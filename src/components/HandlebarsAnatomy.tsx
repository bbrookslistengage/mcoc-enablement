import React from 'react';
import styles from './HandlebarsAnatomy.module.css';

interface SegmentDef {
  text: string;
  colorClass: string;
  label: string;
  description: string;
}

const SEGMENTS: SegmentDef[] = [
  {
    text: '@root',
    colorClass: styles.root,
    label: '@root',
    description: 'Root context of the Handlebars template',
  },
  {
    text: '$dataGraph',
    colorClass: styles.graph,
    label: '$dataGraph',
    description: 'The default Data Graph configured in MCA Setup',
  },
  {
    text: 'ssot__FirstName__c',
    colorClass: styles.field,
    label: 'Field name',
    description: 'A field on a DMO, using the Salesforce namespace prefix (ssot__) and custom field suffix (__c)',
  },
];

export default function HandlebarsAnatomy(): React.JSX.Element {
  /*
    Grid layout: 7 columns — bracket | seg | dot | seg | dot | seg | bracket
    Row 1 = expression bar cells (all share one visual border via per-cell borders)
    Row 2 = label columns (bracket/sep slots are empty placeholders)
  */
  return (
    <div
      className={styles.wrapper}
      role="img"
      aria-label="Anatomy of a Handlebars expression: {{@root.$dataGraph.ssot__FirstName__c}} — @root is the root template context, $dataGraph is the default Data Graph, ssot__FirstName__c is a field on a DMO"
    >
      <div className={styles.anatomy}>

        {/* ── ROW 1: expression bar ── */}

        {/* Opening {{ */}
        <div className={`${styles.cell} ${styles.cellFirst} ${styles.bracketCell}`}>
          {'{{'}
        </div>

        {SEGMENTS.map((seg, i) => (
          <React.Fragment key={seg.text}>
            <div className={`${styles.cell} ${styles.segmentCell} ${seg.colorClass}`}>
              {seg.text}
            </div>
            {i < SEGMENTS.length - 1 && (
              <div className={`${styles.cell} ${styles.separatorCell}`}>.</div>
            )}
          </React.Fragment>
        ))}

        {/* Closing }} */}
        <div className={`${styles.cell} ${styles.cellLast} ${styles.bracketCell}`}>
          {'}}'}
        </div>

        {/* ── ROW 2: labels ── */}

        {/* Empty placeholder under opening {{ */}
        <div className={styles.noLabel} />

        {SEGMENTS.map((seg, i) => (
          <React.Fragment key={`label-${seg.text}`}>
            <div className={`${styles.labelCol} ${seg.colorClass}`}>
              <div className={styles.labelLine} />
              <div className={styles.labelColInner}>
                <span className={styles.labelChip}>{seg.label}</span>
                <span className={styles.labelDesc}>{seg.description}</span>
              </div>
            </div>
            {/* Empty placeholder under dot separator */}
            {i < SEGMENTS.length - 1 && <div className={styles.noLabel} />}
          </React.Fragment>
        ))}

        {/* Empty placeholder under closing }} */}
        <div className={styles.noLabel} />

      </div>
    </div>
  );
}
