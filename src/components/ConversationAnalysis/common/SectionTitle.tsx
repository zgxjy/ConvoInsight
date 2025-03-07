import React from 'react';
import { styles } from '../styles';

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => (
  <h3 style={{ 
    color: styles.colors.text.primary, 
    marginBottom: styles.spacing.md,
    position: 'relative',
    paddingLeft: styles.spacing.md, // 使用设计系统中的间距
    display: 'flex',
    alignItems: 'center',
    ...styles.typography.h3,
  }}>
    <div style={{
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '4px',
      height: '18px',
      background: styles.colors.primary,
      borderRadius: '2px'
    }}></div>
    {title}
  </h3>
);

export default SectionTitle;
