import React from 'react';
import { styles } from '../styles';
import Card from '../common/Card';
import SectionTitle from '../common/SectionTitle';
import { Tag, Divider } from 'antd';
import { TagOutlined } from '@ant-design/icons';

interface AnalysisPanelProps {
  tags: string[];
  emotionSummary?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  hotWords?: string[];
  improvementSuggestions: string[];
  interactionAnalysis: {
    totalMessages: number;
    agentMessages: number;
    userMessages: number;
  };
}

/**
 * 分析面板组件
 * 用于展示会话的分析内容，包括互动分析、情感分析、热门关键词等
 */
const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  tags,
  emotionSummary,
  hotWords,
  improvementSuggestions,
  interactionAnalysis
}) => {
  // 计算情绪百分比
  const calculateEmotionPercentage = () => {
    if (!emotionSummary) return { positive: 0, neutral: 0, negative: 0 };
    
    const total = emotionSummary.positive + emotionSummary.neutral + emotionSummary.negative;
    if (total === 0) return { positive: 0, neutral: 0, negative: 0 };
    
    return {
      positive: Math.round((emotionSummary.positive / total) * 100),
      neutral: Math.round((emotionSummary.neutral / total) * 100),
      negative: Math.round((emotionSummary.negative / total) * 100)
    };
  };
  
  const emotionPercentages = calculateEmotionPercentage();

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: styles.spacing.lg,
      height: '100%'
    }}>
      {/* 互动分析 */}
      <Card style={{ flexShrink: 0 }}>
        <SectionTitle title="互动分析" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: styles.spacing.sm
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: styles.typography.h1.fontSize, 
              fontWeight: styles.typography.h1.fontWeight, 
              color: styles.colors.primary,
              marginBottom: styles.spacing.sm
            }}>{interactionAnalysis.totalMessages}</div>
            <div style={{ 
              fontSize: styles.typography.small.fontSize,
              color: styles.colors.text.tertiary
            }}>互动消息数</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: styles.typography.h1.fontSize, 
              fontWeight: styles.typography.h1.fontWeight, 
              color: styles.colors.primary,
              marginBottom: styles.spacing.sm
            }}>{interactionAnalysis.agentMessages}</div>
            <div style={{ 
              fontSize: styles.typography.small.fontSize,
              color: styles.colors.text.tertiary
            }}>客服消息数</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: styles.typography.h1.fontSize, 
              fontWeight: styles.typography.h1.fontWeight, 
              color: styles.colors.primary,
              marginBottom: styles.spacing.sm
            }}>{interactionAnalysis.userMessages}</div>
            <div style={{ 
              fontSize: styles.typography.small.fontSize,
              color: styles.colors.text.tertiary
            }}>用户消息数</div>
          </div>
        </div>
      </Card>

      {/* 会话分析 */}
      <Card style={{ flexShrink: 0 }}>
        <SectionTitle title="会话分析" />
        
        {/* 命中标签 */}
        <div style={{ marginBottom: styles.spacing.md }}>
          <div style={{ 
            fontSize: styles.typography.small.fontSize,
            marginBottom: styles.spacing.sm,
            fontWeight: styles.typography.body.fontWeight,
            color: styles.colors.text.primary
          }}>命中标签</div>
          
          <div style={{ 
            display: 'flex', 
            gap: styles.spacing.sm, 
            flexWrap: 'wrap',
            marginBottom: styles.spacing.sm
          }}>
            {tags && tags.map((tag, index) => (
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
        </div>
        
        {/* 情感分析 */}
        {emotionSummary && (
          <>
            <Divider style={{ margin: `${styles.spacing.sm} 0` }} />
            <div style={{ marginBottom: styles.spacing.md }}>
              <div style={{ 
                fontSize: styles.typography.small.fontSize,
                marginBottom: styles.spacing.sm,
                fontWeight: styles.typography.body.fontWeight,
                color: styles.colors.text.primary
              }}>情绪总结</div>
              <div style={{ 
                display: 'flex', 
                gap: styles.spacing.lg,
                padding: styles.spacing.md,
                background: styles.colors.background.grey,
                borderRadius: styles.borderRadius.sm
              }}>
                <div>
                  <div style={{ color: styles.colors.text.tertiary, fontSize: styles.typography.small.fontSize }}>正向</div>
                  <div style={{ 
                    color: styles.colors.success, 
                    fontWeight: styles.typography.h3.fontWeight,
                    fontSize: styles.typography.h3.fontSize 
                  }}>{emotionPercentages.positive}%</div>
                </div>
                <div>
                  <div style={{ color: styles.colors.text.tertiary, fontSize: styles.typography.small.fontSize }}>中立</div>
                  <div style={{ 
                    color: styles.colors.text.secondary, 
                    fontWeight: styles.typography.h3.fontWeight,
                    fontSize: styles.typography.h3.fontSize 
                  }}>{emotionPercentages.neutral}%</div>
                </div>
                <div>
                  <div style={{ color: styles.colors.text.tertiary, fontSize: styles.typography.small.fontSize }}>负向</div>
                  <div style={{ 
                    color: styles.colors.error, 
                    fontWeight: styles.typography.h3.fontWeight,
                    fontSize: styles.typography.h3.fontSize 
                  }}>{emotionPercentages.negative}%</div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* 热门关键词 */}
        {hotWords && hotWords.length > 0 && (
          <>
            <Divider style={{ margin: `${styles.spacing.sm} 0` }} />
            <div style={{ marginBottom: styles.spacing.md }}>
              <div style={{ 
                fontSize: styles.typography.small.fontSize,
                marginBottom: styles.spacing.sm,
                fontWeight: styles.typography.body.fontWeight,
                color: styles.colors.text.primary
              }}>热门关键词</div>
              <div style={{ 
                display: 'flex', 
                gap: styles.spacing.sm, 
                flexWrap: 'wrap'
              }}>
                {hotWords.map((word, index) => (
                  <Tag key={index} style={{
                    borderRadius: styles.borderRadius.sm,
                    padding: `${styles.spacing.xs} ${styles.spacing.sm}`,
                    margin: 0
                  }}>
                    {word}
                  </Tag>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* 改进建议 */}
        {improvementSuggestions && improvementSuggestions.length > 0 && (
          <>
            <Divider style={{ margin: `${styles.spacing.sm} 0` }} />
            <div>
              <div style={{ 
                fontSize: styles.typography.small.fontSize,
                marginBottom: styles.spacing.sm,
                fontWeight: styles.typography.body.fontWeight,
                color: styles.colors.text.primary
              }}>改进建议</div>
              <ul style={{ 
                paddingLeft: styles.spacing.lg,
                margin: 0,
                fontSize: styles.typography.small.fontSize,
                color: styles.colors.text.secondary
              }}>
                {improvementSuggestions.map((suggestion, index) => (
                  <li key={index} style={{ marginBottom: styles.spacing.xs }}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AnalysisPanel;
