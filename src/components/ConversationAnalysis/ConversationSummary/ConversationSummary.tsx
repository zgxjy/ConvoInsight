import React from 'react';
import { TagOutlined } from '@ant-design/icons';
import { styles } from '../styles';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';

interface ConversationSummaryProps {
  mainIssue: string;
  resolutionStatus: {
    status: string;
    description: string;
  };
  mainSolution: string;
  tags: string[];
}

/**
 * 会话摘要组件
 * 展示会话的主要问题、解决状态和主要解决方案
 */
const ConversationSummary: React.FC<ConversationSummaryProps> = ({
  mainIssue,
  resolutionStatus,
  mainSolution,
  tags
}) => {
  return (
    <Card style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <SectionTitle title="会话摘要" />
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: styles.spacing.lg,
        marginBottom: 'auto'
      }}>
        <div>
          <div style={{ 
            fontSize: styles.typography.small.fontSize,
            marginBottom: styles.spacing.sm,
            fontWeight: styles.typography.body.fontWeight,
            color: styles.colors.text.primary
          }}>主要问题</div>
          
          <div style={{ 
            display: 'flex', 
            gap: styles.spacing.sm, 
            flexWrap: 'wrap',
            marginBottom: styles.spacing.sm
          }}>
            {tags.map((tag: string, index: number) => (
              <span key={index} style={{
                padding: styles.spacing.xs,
                borderRadius: styles.borderRadius.sm,
                background: index === 0 ? styles.colors.background.primaryLight : 
                          index === 1 ? styles.colors.background.warningLight : 
                          styles.colors.background.successLight,
                color: index === 0 ? styles.colors.primary : 
                      index === 1 ? styles.colors.warning : 
                      styles.colors.success,
                fontSize: styles.typography.small.fontSize,
                fontWeight: styles.typography.body.fontWeight,
                display: 'flex',
                alignItems: 'center',
                gap: styles.spacing.xs
              }}>
                <TagOutlined style={{ fontSize: styles.typography.micro.fontSize }} />
                {tag}
              </span>
            ))}
          </div>
          
          <div style={{ 
            color: styles.colors.text.primary,
            lineHeight: 1.6,
            fontSize: styles.typography.body.fontSize
          }}>{mainIssue}</div>
        </div>

        <div>
          <div style={{ 
            fontSize: styles.typography.small.fontSize,
            marginBottom: styles.spacing.sm,
            display: 'flex',
            alignItems: 'center',
            gap: styles.spacing.sm,
            fontWeight: styles.typography.body.fontWeight,
            color: styles.colors.text.primary
          }}>
            问题解决状态
            <span style={{
              padding: styles.spacing.xs,
              background: styles.colors.background.warningLight,
              color: styles.colors.warning,
              borderRadius: styles.borderRadius.sm,
              fontSize: styles.typography.small.fontSize,
              fontWeight: styles.typography.body.fontWeight
            }}>{resolutionStatus.status}</span>
          </div>
          <div style={{ 
            color: styles.colors.text.primary,
            lineHeight: 1.6,
            fontSize: styles.typography.body.fontSize
          }}>{resolutionStatus.description}</div>
        </div>

        <div>
          <div style={{ 
            fontSize: styles.typography.small.fontSize,
            marginBottom: styles.spacing.sm,
            fontWeight: styles.typography.body.fontWeight,
            color: styles.colors.text.primary
          }}>主要解决方案</div>
          <div style={{ 
            color: styles.colors.text.primary,
            lineHeight: 1.6,
            fontSize: styles.typography.body.fontSize
          }}>{mainSolution}</div>
        </div>
      </div>
    </Card>
  );
};

export default ConversationSummary;
