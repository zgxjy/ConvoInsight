import React, { useState, useEffect } from 'react';
import { TagOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Result, Empty } from 'antd';
import { 
  Message,
  ConversationData
} from '../types/conversationTypes';
import { fetchConversationDetail } from '../services/api';

// 设计系统变量
const styles = {
  // 颜色系统
  colors: {
    primary: '#1677ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    text: {
      primary: '#1f1f1f',
      secondary: '#595959',
      tertiary: '#8c8c8c',
    },
    background: {
      light: '#ffffff',
      grey: '#f5f5f5',
      primaryLight: 'rgba(22, 119, 255, 0.1)',
      successLight: 'rgba(82, 196, 26, 0.1)',
      warningLight: 'rgba(250, 173, 20, 0.1)',
      errorLight: 'rgba(255, 77, 79, 0.1)',
    },
    border: '#d9d9d9',
  },
  // 间距系统
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  // 阴影系统
  shadows: {
    primary: '0 2px 8px rgba(0,0,0,0.08)',
    hover: '0 4px 12px rgba(0,0,0,0.12)',
  },
  // 圆角系统
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
  // 字体系统
  typography: {
    h1: {
      fontSize: '24px',
      fontWeight: 600,
    },
    h2: {
      fontSize: '20px',
      fontWeight: 600,
    },
    h3: {
      fontSize: '16px',
      fontWeight: 600,
    },
    body: {
      fontSize: '14px',
      fontWeight: 400,
    },
    small: {
      fontSize: '12px',
      fontWeight: 400,
    },
    micro: {
      fontSize: '10px',
      fontWeight: 400,
    },
  },
  // 卡片样式
  card: {
    padding: '16px',
    borderRadius: '8px',
    background: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
};

const SectionTitle: React.FC<{title: string}> = ({title}) => (
  <h3 style={{ 
    color: styles.colors.text.primary, 
    marginBottom: styles.spacing.md,
    position: 'relative',
    paddingLeft: '12px',
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

const ConversationAnalysis: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  
  // 加载会话详情数据
  useEffect(() => {
    console.log('会话详情页面接收到的ID:', id);
    
    const loadConversationDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!id) {
          throw new Error('会话ID不能为空');
        }
        
        // 确保ID正确解码，处理可能包含特殊字符的ID
        const decodedId = decodeURIComponent(id);
        console.log('解码后的ID:', decodedId);
        
        const response = await fetchConversationDetail(decodedId);
        console.log('API响应:', response);
        
        if (response.success) {
          setConversation(response.data);
        } else {
          setError(response.message || '获取会话详情失败');
        }
      } catch (err) {
        console.error('获取会话详情出错:', err);
        setError('获取会话详情出错');
      } finally {
        setLoading(false);
      }
    };
    
    loadConversationDetail();
  }, [id]);
  
  const handleBackClick = () => {
    navigate('/conversations');
  };

  // 显示加载状态
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: styles.colors.background.light
      }}>
        <Spin size="large" tip="加载会话详情..." />
      </div>
    );
  }
  
  // 显示错误信息
  if (error || !conversation) {
    return (
      <div style={{
        background: styles.colors.background.light,
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Result
          status="error"
          title="加载失败"
          subTitle={error || '无法加载会话详情'}
          extra={
            <Button type="primary" onClick={handleBackClick}>
              返回会话列表
            </Button>
          }
        />
      </div>
    );
  }

  // 确保所有必需的数据都存在
  if (!conversation.customerInfo || !conversation.conversationSummary || 
      !conversation.metrics || !conversation.messages) {
    return (
      <div style={{
        background: styles.colors.background.light,
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <Empty description="会话数据不完整" />
        <Button 
          type="primary" 
          onClick={handleBackClick}
          style={{ marginTop: styles.spacing.md }}
        >
          返回会话列表
        </Button>
      </div>
    );
  }

  // 调试输出
  console.log('渲染会话数据:', conversation);

  return (
    <div className="conversation-analysis" style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: styles.spacing.lg,
      display: 'flex',
      flexDirection: 'column',
      gap: styles.spacing.lg,
      backgroundColor: styles.colors.background.light
    }}>
      {/* 返回按钮和会话ID */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        marginBottom: styles.spacing.md
      }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBackClick}
          style={{ marginRight: styles.spacing.sm }}
        >
          返回会话列表
        </Button>
        <h2 style={{ margin: 0 }}>会话 {conversation.id}</h2>
      </div>

      {/* 顶部信息行 */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: styles.spacing.lg
      }}>
        {/* 客户信息 */}
        <div style={{
          background: styles.colors.background.light,
          borderRadius: styles.borderRadius.md,
          padding: styles.spacing.md,
          boxShadow: styles.shadows.primary
        }}>
          <SectionTitle title="客户信息" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: styles.spacing.sm }}>
            <div>
              <div style={{ fontSize: styles.typography.small.fontSize, color: styles.colors.text.tertiary }}>用户ID</div>
              <div style={{ fontWeight: styles.typography.body.fontWeight }}>{conversation.customerInfo.userId}</div>
            </div>
            <div>
              <div style={{ fontSize: styles.typography.small.fontSize, color: styles.colors.text.tertiary }}>设备型号</div>
              <div style={{ fontWeight: styles.typography.body.fontWeight }}>{conversation.customerInfo.device}</div>
            </div>
            <div>
              <div style={{ fontSize: styles.typography.small.fontSize, color: styles.colors.text.tertiary }}>联系历史</div>
              <div style={{ fontWeight: styles.typography.body.fontWeight }}>{conversation.customerInfo.history}</div>
            </div>
          </div>
        </div>

        {/* 会话摘要 */}
        <div style={{
          background: styles.colors.background.light,
          borderRadius: styles.borderRadius.md,
          padding: styles.spacing.md,
          boxShadow: styles.shadows.primary,
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
                {conversation.tags.map((tag: string, index: number) => (
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
              }}>{conversation.conversationSummary.mainIssue}</div>
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
                }}>{conversation.conversationSummary.resolutionStatus.status}</span>
              </div>
              <div style={{ 
                color: styles.colors.text.primary,
                lineHeight: 1.6,
                fontSize: styles.typography.body.fontSize
              }}>{conversation.conversationSummary.resolutionStatus.description}</div>
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
              }}>{conversation.conversationSummary.mainSolution}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 指标卡片 */}
      <div style={{
        background: styles.colors.background.light,
        borderRadius: styles.borderRadius.md,
        padding: styles.spacing.md,
        boxShadow: styles.shadows.primary,
        marginBottom: styles.spacing.lg
      }}>
        <SectionTitle title="客服表现评估" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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
              color: conversation.metrics.satisfaction.value > 50 ? styles.colors.success : styles.colors.error
            }}>
              {conversation.metrics.satisfaction.value}
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
              color: conversation.metrics.resolution.value > 50 ? styles.colors.success : styles.colors.error
            }}>
              {conversation.metrics.resolution.value}
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
              color: conversation.metrics.attitude.value > 50 ? styles.colors.success : styles.colors.error
            }}>
              {conversation.metrics.attitude.value}
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
              color: conversation.metrics.risk.value > 50 ? styles.colors.success : styles.colors.error
            }}>
              {conversation.metrics.risk.value}
              <span style={{ 
                color: styles.colors.text.tertiary,
                fontSize: styles.typography.small.fontSize,
                marginLeft: styles.spacing.sm
              }}>/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部区块 */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: styles.spacing.lg
      }}>
        {/* 左侧对话记录 */}
        <div style={{
          background: styles.colors.background.light,
          borderRadius: styles.borderRadius.md,
          padding: styles.spacing.md,
          boxShadow: styles.shadows.primary
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: styles.spacing.md
          }}>
            <SectionTitle title="对话记录" />
          </div>
          <div style={{ 
            maxHeight: '60vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: styles.spacing.sm
          }}>
            {conversation.messages.map((message: Message, index: number) => (
              <div key={index} style={{ 
                alignSelf: message.type === 'system' ? 'center' : 
                          message.type === 'user' ? 'flex-start' : 'flex-end',
                maxWidth: message.type === 'system' ? '90%' : '80%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: message.type === 'system' ? 'auto' : '100%',
                justifyContent: message.type === 'system' ? 'center' : 
                               message.type === 'user' ? 'flex-start' : 'flex-end'
              }}>
                <div style={{ 
                  background: message.type === 'system' ? styles.colors.background.grey :
                              message.type === 'user' ? styles.colors.background.successLight : 
                              styles.colors.background.primaryLight,
                  borderRadius: styles.borderRadius.md,
                  padding: styles.spacing.md,
                  position: 'relative',
                  textAlign: message.type === 'system' ? 'center' : 'left',
                  order: message.type === 'user' ? 1 : 0,
                  maxWidth: message.type === 'user' ? 'calc(100% - 40px)' : '100%'
                }}>
                  {message.content.split('\n').map((line: string, i: number) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                  <div style={{
                    fontSize: styles.typography.small.fontSize,
                    color: styles.colors.text.tertiary,
                    marginTop: styles.spacing.sm,
                    textAlign: 'left'
                  }}>
                    {message.time} • {message.type === 'user' ? '用户' : 
                                      message.type === 'system' ? '系统' : '客服'}
                  </div>
                </div>
                {/* 用户消息情感标记 - 放在对话框外侧 */}
                {message.type === 'user' && message.sentiment && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: message.sentiment === '正向' ? styles.colors.success :
                              message.sentiment === '负向' ? styles.colors.error : 
                              styles.colors.warning,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: styles.typography.micro.fontSize,
                    fontWeight: styles.typography.body.fontWeight,
                    marginLeft: styles.spacing.sm,
                    order: 2,
                    flexShrink: 0
                  }} title={message.sentiment}>
                    {message.sentiment === '正向' ? '正' : 
                     message.sentiment === '负向' ? '负' : '中'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 右侧分析区域 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: styles.spacing.lg,
          height: '100%'
        }}>
          {/* 互动分析 */}
          <div style={{
            background: styles.colors.background.light,
            borderRadius: styles.borderRadius.md,
            padding: styles.spacing.md,
            boxShadow: styles.shadows.primary,
            flexShrink: 0
          }}>
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
                }}>{conversation.interactionAnalysis.totalMessages}</div>
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
                }}>{conversation.interactionAnalysis.agentMessages}</div>
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
                }}>{conversation.interactionAnalysis.userMessages}</div>
                <div style={{ 
                  fontSize: styles.typography.small.fontSize,
                  color: styles.colors.text.tertiary
                }}>用户消息数</div>
              </div>
            </div>
          </div>

          {/* 会话分析 */}
          <div style={{
            background: styles.colors.background.light,
            borderRadius: styles.borderRadius.md,
            padding: styles.spacing.md,
            boxShadow: styles.shadows.primary,
            flexShrink: 0
          }}>
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
                {conversation.tags && conversation.tags.map((tag: string, index: number) => (
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
            
            {/* 情绪总结 */}
            <div style={{ marginBottom: styles.spacing.md }}>
              <div style={{ 
                fontSize: styles.typography.small.fontSize,
                marginBottom: styles.spacing.sm,
                fontWeight: styles.typography.body.fontWeight,
                color: styles.colors.text.primary
              }}>情绪总结</div>
              
              <div style={{ 
                display: 'flex', 
                gap: styles.spacing.sm, 
                flexWrap: 'wrap'
              }}>
                {(() => {
                  // 统计各种情绪的数量
                  const sentimentCounts = {
                    '正向': 0,
                    '中立': 0,
                    '负向': 0
                  };
                  
                  // 遍历所有用户消息并统计情绪
                  conversation.messages.forEach(msg => {
                    if (msg.type === 'user' && msg.sentiment) {
                      sentimentCounts[msg.sentiment]++;
                    }
                  });
                  
                  // 返回情绪统计标签
                  return (
                    <>
                      {sentimentCounts['正向'] > 0 && (
                        <span style={{
                          padding: styles.spacing.xs,
                          borderRadius: styles.borderRadius.sm,
                          background: styles.colors.background.successLight,
                          color: styles.colors.success,
                          fontSize: styles.typography.small.fontSize,
                          fontWeight: styles.typography.body.fontWeight,
                          display: 'flex',
                          alignItems: 'center',
                          gap: styles.spacing.xs
                        }}>
                          正向 × {sentimentCounts['正向']}
                        </span>
                      )}
                      
                      {sentimentCounts['中立'] > 0 && (
                        <span style={{
                          padding: styles.spacing.xs,
                          borderRadius: styles.borderRadius.sm,
                          background: styles.colors.background.warningLight,
                          color: styles.colors.warning,
                          fontSize: styles.typography.small.fontSize,
                          fontWeight: styles.typography.body.fontWeight,
                          display: 'flex',
                          alignItems: 'center',
                          gap: styles.spacing.xs
                        }}>
                          中立 × {sentimentCounts['中立']}
                        </span>
                      )}
                      
                      {sentimentCounts['负向'] > 0 && (
                        <span style={{
                          padding: styles.spacing.xs,
                          borderRadius: styles.borderRadius.sm,
                          background: styles.colors.background.errorLight,
                          color: styles.colors.error,
                          fontSize: styles.typography.small.fontSize,
                          fontWeight: styles.typography.body.fontWeight,
                          display: 'flex',
                          alignItems: 'center',
                          gap: styles.spacing.xs
                        }}>
                          负向 × {sentimentCounts['负向']}
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
            
            {/* 热词 */}
            <div>
              <div style={{ 
                fontSize: styles.typography.small.fontSize,
                marginBottom: styles.spacing.sm,
                fontWeight: styles.typography.body.fontWeight,
                color: styles.colors.text.primary
              }}>热词</div>
              
              <div style={{ 
                display: 'flex', 
                gap: styles.spacing.sm, 
                flexWrap: 'wrap'
              }}>
                {conversation.hotWords && conversation.hotWords.map((word: string, index: number) => (
                  <span key={index} style={{
                    padding: styles.spacing.xs,
                    borderRadius: styles.borderRadius.sm,
                    background: styles.colors.background.light,
                    border: `1px solid ${styles.colors.border}`,
                    color: styles.colors.text.secondary,
                    fontSize: styles.typography.small.fontSize
                  }}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 改进建议 */}
          <div style={{
            background: styles.colors.background.light,
            borderRadius: styles.borderRadius.md,
            padding: styles.spacing.md,
            boxShadow: styles.shadows.primary,
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <SectionTitle title="改进建议" />
            <ul style={{ 
              listStyleType: 'none',
              paddingLeft: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: styles.spacing.sm,
              flex: 1
            }}>
              {conversation.improvementSuggestions.map((suggestion, index) => (
                <li key={index} style={{ 
                  padding: styles.spacing.sm,
                  background: styles.colors.background.warningLight,
                  borderRadius: styles.borderRadius.sm,
                  fontSize: styles.typography.body.fontSize
                }}>{suggestion}</li>
              ))}
            </ul>
            <div style={{ 
              marginTop: styles.spacing.sm,
              color: styles.colors.text.tertiary,
              fontSize: styles.typography.micro.fontSize,
              fontStyle: 'italic',
              textAlign: 'right'
            }}>AI建议仅供参考</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationAnalysis;