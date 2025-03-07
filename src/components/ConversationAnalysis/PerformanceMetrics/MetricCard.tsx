import React from 'react';
import { styles } from '../styles';
import Card from '../common/Card';

interface MetricCardProps {
  title: string;
  value: number;
}

/**
 * 指标卡片组件
 * 展示单个性能指标，包括标题和数值
 */
const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => {
  return (
    <Card style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: styles.spacing.lg,
    }}>
      <div style={{ 
        fontSize: styles.typography.small.fontSize,
        color: styles.colors.text.tertiary,
        marginBottom: styles.spacing.md
      }}>{title}</div>
      <div style={{ 
        fontSize: styles.typography.h1.fontSize,
        fontWeight: styles.typography.h1.fontWeight,
        color: value > 50 ? styles.colors.success : styles.colors.error
      }}>
        {value}
        <span style={{ 
          color: styles.colors.text.tertiary,
          fontSize: styles.typography.small.fontSize,
          marginLeft: styles.spacing.sm
        }}>/100</span>
      </div>
    </Card>
  );
};

export default MetricCard;
