import React from 'react';
import { styles } from '../styles';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';

interface MetricItem {
  value: number;
  description?: string;
}

interface PerformanceMetricsProps {
  satisfaction: MetricItem;
  resolution: MetricItem;
  attitude: MetricItem;
  risk: MetricItem;
}

/**
 * 客服表现评估组件
 * 展示客户满意度、专业能力、解决能力和礼貌表现等指标
 */
const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  satisfaction,
  resolution,
  attitude,
  risk
}) => {
  return (
    <Card style={{ marginBottom: styles.spacing.lg }}>
      <SectionTitle title="客服表现评估" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: styles.spacing.lg
      }}>
        {/* 客户满意度 */}
        <div style={{
          background: styles.colors.background.light,
          borderRadius: styles.borderRadius.md,
          padding: styles.spacing.lg,
          boxShadow: styles.shadows.primary,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: styles.typography.small.fontSize,
            color: styles.colors.text.tertiary,
            marginBottom: styles.spacing.md
          }}>客户满意度</div>
          <div style={{ 
            fontSize: styles.typography.h1.fontSize,
            fontWeight: styles.typography.h1.fontWeight,
            color: satisfaction.value > 50 ? styles.colors.success : styles.colors.error
          }}>
            {satisfaction.value}
            <span style={{ 
              color: styles.colors.text.tertiary,
              fontSize: styles.typography.small.fontSize,
              marginLeft: styles.spacing.sm
            }}>/100</span>
          </div>
        </div>

        {/* 专业能力 */}
        <div style={{
          background: styles.colors.background.light,
          borderRadius: styles.borderRadius.md,
          padding: styles.spacing.lg,
          boxShadow: styles.shadows.primary,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: styles.typography.small.fontSize,
            color: styles.colors.text.tertiary,
            marginBottom: styles.spacing.md
          }}>专业能力</div>
          <div style={{ 
            fontSize: styles.typography.h1.fontSize,
            fontWeight: styles.typography.h1.fontWeight,
            color: resolution.value > 50 ? styles.colors.success : styles.colors.error
          }}>
            {resolution.value}
            <span style={{ 
              color: styles.colors.text.tertiary,
              fontSize: styles.typography.small.fontSize,
              marginLeft: styles.spacing.sm
            }}>/100</span>
          </div>
        </div>

        {/* 解决能力 */}
        <div style={{
          background: styles.colors.background.light,
          borderRadius: styles.borderRadius.md,
          padding: styles.spacing.lg,
          boxShadow: styles.shadows.primary,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: styles.typography.small.fontSize,
            color: styles.colors.text.tertiary,
            marginBottom: styles.spacing.md
          }}>解决能力</div>
          <div style={{ 
            fontSize: styles.typography.h1.fontSize,
            fontWeight: styles.typography.h1.fontWeight,
            color: attitude.value > 50 ? styles.colors.success : styles.colors.error
          }}>
            {attitude.value}
            <span style={{ 
              color: styles.colors.text.tertiary,
              fontSize: styles.typography.small.fontSize,
              marginLeft: styles.spacing.sm
            }}>/100</span>
          </div>
        </div>

        {/* 礼貌表现 */}
        <div style={{
          background: styles.colors.background.light,
          borderRadius: styles.borderRadius.md,
          padding: styles.spacing.lg,
          boxShadow: styles.shadows.primary,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: styles.typography.small.fontSize,
            color: styles.colors.text.tertiary,
            marginBottom: styles.spacing.md
          }}>礼貌表现</div>
          <div style={{ 
            fontSize: styles.typography.h1.fontSize,
            fontWeight: styles.typography.h1.fontWeight,
            color: risk.value > 50 ? styles.colors.success : styles.colors.error
          }}>
            {risk.value}
            <span style={{ 
              color: styles.colors.text.tertiary,
              fontSize: styles.typography.small.fontSize,
              marginLeft: styles.spacing.sm
            }}>/100</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceMetrics;
