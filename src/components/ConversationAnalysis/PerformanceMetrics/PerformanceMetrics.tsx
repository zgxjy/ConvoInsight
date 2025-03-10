import React from 'react';
import { styles } from '../styles';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';
import { metricStyles } from './styles';

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

interface MetricCardProps {
  label: string;
  value: number;
  description?: string;
}

/**
 * 指标卡片组件
 * 展示单个指标的值和描述
 */
const MetricCard: React.FC<MetricCardProps> = ({ label, value, description }) => {
  return (
    <div style={metricStyles.metricCard}>
      <div style={metricStyles.metricLabel}>{label}</div>
      <div style={{
        ...metricStyles.metricValue,
        color: value > 50 ? styles.colors.success : styles.colors.error
      }}>
        {value}
        <span style={metricStyles.metricUnit}>/100</span>
      </div>
      {description && (
        <div style={metricStyles.metricDescription}>
          {description}
        </div>
      )}
    </div>
  );
};

/**
 * 客服表现评估组件
 * 展示客户满意度、解决能力和礼貌表现、安全程度指标
 */
const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  satisfaction,
  resolution,
  attitude,
  risk
}) => {
  return (
    <Card style={{ marginBottom: styles.spacing.xs }}>
      <SectionTitle title="客服表现评估" />
      <div style={metricStyles.container}>
        <MetricCard 
          label="客户满意度" 
          value={satisfaction.value} 
          description={satisfaction.description} 
        />
        <MetricCard 
          label="解决能力" 
          value={resolution.value} 
          description={resolution.description} 
        />
        <MetricCard 
          label="礼貌表现" 
          value={attitude.value} 
          description={attitude.description} 
        />
        <MetricCard 
          label="安全程度" 
          value={risk.value} 
          description={risk.description} 
        />
      </div>
    </Card>
  );
};

export default PerformanceMetrics;
