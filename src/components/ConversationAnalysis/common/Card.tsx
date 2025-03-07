import React, { ReactNode } from 'react';
import { styles } from '../styles';

interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, style }) => (
  <div style={{
    background: styles.colors.background.light,
    borderRadius: styles.borderRadius.md,
    padding: styles.spacing.lg,
    boxShadow: styles.shadows.primary,
    ...style
  }}>
    {children}
  </div>
);

export default Card;
