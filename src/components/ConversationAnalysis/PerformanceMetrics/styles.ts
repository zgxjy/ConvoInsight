import { styles } from '../styles';
import { CSSProperties } from 'react';

export const metricStyles: {
  container: CSSProperties;
  metricCard: CSSProperties;
  metricLabel: CSSProperties;
  metricValue: CSSProperties;
  metricUnit: CSSProperties;
  metricDescription: CSSProperties;
} = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: styles.spacing.sm
  },
  metricCard: {
    background: styles.colors.background.light,
    borderRadius: styles.borderRadius.md,
    padding: styles.spacing.lg,
    boxShadow: styles.shadows.primary,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  metricLabel: {
    fontSize: styles.typography.small.fontSize,
    color: styles.colors.text.tertiary,
    marginBottom: styles.spacing.md
  },
  metricValue: {
    fontSize: '56px',
    fontWeight: 600,
    lineHeight: 1
  },
  metricUnit: {
    color: styles.colors.text.tertiary,
    fontSize: styles.typography.small.fontSize,
    marginLeft: styles.spacing.sm
  },
  metricDescription: {
    fontSize: styles.typography.small.fontSize,
    color: styles.colors.text.secondary,
    marginTop: styles.spacing.sm
  }
};
