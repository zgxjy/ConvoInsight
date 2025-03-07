import React, { useState, useEffect } from 'react';
import { TagOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Result, Empty } from 'antd';
import { 
  Message,
  ConversationData
} from '../types/conversationTypes';
import { fetchConversationDetail } from '../services/api';

const SectionTitle: React.FC<{title: string}> = ({title}) => (
  <h3 style={{ 
    color: '#1f1f1f', 
    marginBottom: 16,
    position: 'relative',
    paddingLeft: '12px',
    display: 'flex',
    alignItems: 'center'
  }}>
    <div style={{
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '4px',
      height: '18px',
      background: '#1677ff',
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
        background: '#fff'
      }}>
        <Spin size="large" tip="加载会话详情..." />
      </div>
    );
  }
  
  // 显示错误信息
  if (error || !conversation) {
    return (
      <div style={{
        background: '#fff',
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
        background: '#fff',
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
          style={{ marginTop: 16 }}
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
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      backgroundColor: '#fff'
    }}>
      {/* 返回按钮和会话ID */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        marginBottom: 16
      }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBackClick}
          style={{ marginRight: 16 }}
        >
          返回会话列表
        </Button>
        <h2 style={{ margin: 0 }}>会话 {conversation.id}</h2>
      </div>

      {/* 顶部信息行 */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: 24
      }}>
        {/* 客户信息 */}
        <div style={{
          background: '#fff',
          borderRadius: 8,
          padding: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <SectionTitle title="客户信息" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: '#666' }}>用户ID</div>
              <div style={{ fontWeight: 500 }}>{conversation.customerInfo.userId}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666' }}>设备型号</div>
              <div style={{ fontWeight: 500 }}>{conversation.customerInfo.device}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666' }}>联系历史</div>
              <div style={{ fontWeight: 500 }}>{conversation.customerInfo.history}</div>
            </div>
          </div>
        </div>

        {/* 会话摘要 */}
        <div style={{
          background: '#fff',
          borderRadius: 8,
          padding: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <SectionTitle title="会话摘要" />
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            marginBottom: 'auto'
          }}>
            <div>
              <div style={{ 
                fontSize: 13,
                marginBottom: 8,
                fontWeight: 600,
                color: '#1f1f1f'
              }}>主要问题</div>
              
              <div style={{ 
                display: 'flex', 
                gap: 8, 
                flexWrap: 'wrap',
                marginBottom: 8
              }}>
                {conversation.tags.map((tag: string, index: number) => (
                  <span key={index} style={{
                    padding: '4px 8px',
                    borderRadius: 12,
                    background: index === 0 ? 'rgba(22, 119, 255, 0.1)' : 
                              index === 1 ? 'rgba(250, 140, 22, 0.1)' : 
                              'rgba(82, 196, 26, 0.1)',
                    color: index === 0 ? '#1677ff' : 
                          index === 1 ? '#fa8c16' : 
                          '#52c41a',
                    fontSize: 12,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <TagOutlined style={{ fontSize: 10 }} />
                    {tag}
                  </span>
                ))}
              </div>
              
              <div style={{ 
                color: '#1f1f1f',
                lineHeight: 1.6,
                fontSize: 14
              }}>{conversation.conversationSummary.mainIssue}</div>
            </div>

            <div>
              <div style={{ 
                fontSize: 13,
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 600,
                color: '#1f1f1f'
              }}>
                问题解决状态
                <span style={{
                  padding: '2px 8px',
                  background: '#fff7e6',
                  color: '#fa8c16',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 400
                }}>{conversation.conversationSummary.resolutionStatus.status}</span>
              </div>
              <div style={{ 
                color: '#1f1f1f',
                lineHeight: 1.6,
                fontSize: 14
              }}>{conversation.conversationSummary.resolutionStatus.description}</div>
            </div>

            <div>
              <div style={{ 
                fontSize: 13,
                marginBottom: 4,
                fontWeight: 600,
                color: '#1f1f1f'
              }}>主要解决方案</div>
              <div style={{ 
                color: '#1f1f1f',
                lineHeight: 1.6,
                fontSize: 14
              }}>{conversation.conversationSummary.mainSolution}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 指标卡片 */}
      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: 24
      }}>
        <SectionTitle title="客服表现评估" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24
        }}>
          {/* 客户满意度 */}
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: '32px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: 14,
              color: '#666',
              marginBottom: 16
            }}>客户满意度</div>
            <div style={{ 
              fontSize: 36,
              fontWeight: 600,
              color: conversation.metrics.satisfaction.value > 50 ? '#52c41a' : '#ff4d4f'
            }}>
              {conversation.metrics.satisfaction.value}
              <span style={{ 
                color: '#8c8c8c',
                fontSize: 24,
                marginLeft: 4
              }}>/100</span>
            </div>
          </div>

          {/* 专业能力 */}
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: '32px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: 14,
              color: '#666',
              marginBottom: 16
            }}>专业能力</div>
            <div style={{ 
              fontSize: 36,
              fontWeight: 600,
              color: conversation.metrics.resolution.value > 50 ? '#52c41a' : '#ff4d4f'
            }}>
              {conversation.metrics.resolution.value}
              <span style={{ 
                color: '#8c8c8c',
                fontSize: 24,
                marginLeft: 4
              }}>/100</span>
            </div>
          </div>

          {/* 解决能力 */}
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: '32px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: 14,
              color: '#666',
              marginBottom: 16
            }}>解决能力</div>
            <div style={{ 
              fontSize: 36,
              fontWeight: 600,
              color: conversation.metrics.attitude.value > 50 ? '#52c41a' : '#ff4d4f'
            }}>
              {conversation.metrics.attitude.value}
              <span style={{ 
                color: '#8c8c8c',
                fontSize: 24,
                marginLeft: 4
              }}>/100</span>
            </div>
          </div>

          {/* 礼貌表现 */}
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: '32px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: 14,
              color: '#666',
              marginBottom: 16
            }}>礼貌表现</div>
            <div style={{ 
              fontSize: 36,
              fontWeight: 600,
              color: conversation.metrics.risk.value > 50 ? '#52c41a' : '#ff4d4f'
            }}>
              {conversation.metrics.risk.value}
              <span style={{ 
                color: '#8c8c8c',
                fontSize: 24,
                marginLeft: 4
              }}>/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部区块 */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 24
      }}>
        {/* 左侧对话记录 */}
        <div style={{
          background: '#fff',
          borderRadius: 8,
          padding: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <SectionTitle title="对话记录" />
          </div>
          <div style={{ 
            maxHeight: '60vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
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
                  background: message.type === 'system' ? '#f0f0f0' :
                              message.type === 'user' ? '#e6ffed' : '#e6f7ff',
                  borderRadius: 8,
                  padding: 12,
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
                    fontSize: 12,
                    color: '#8c8c8c',
                    marginTop: 8,
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
                    background: message.sentiment === '正向' ? '#52c41a' : 
                              message.sentiment === '负向' ? '#ff4d4f' : '#faad14',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginLeft: '8px',
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
          gap: 16,
          height: '100%'
        }}>
          {/* 互动分析 */}
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            flexShrink: 0
          }}>
            <SectionTitle title="互动分析" />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: 24, 
                  fontWeight: 600, 
                  color: '#1677ff',
                  marginBottom: 4
                }}>{conversation.interactionAnalysis.totalMessages}</div>
                <div style={{ 
                  fontSize: 13,
                  color: '#666'
                }}>互动消息数</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: 24, 
                  fontWeight: 600, 
                  color: '#1677ff',
                  marginBottom: 4
                }}>{conversation.interactionAnalysis.agentMessages}</div>
                <div style={{ 
                  fontSize: 13,
                  color: '#666'
                }}>客服消息数</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: 24, 
                  fontWeight: 600, 
                  color: '#1677ff',
                  marginBottom: 4
                }}>{conversation.interactionAnalysis.userMessages}</div>
                <div style={{ 
                  fontSize: 13,
                  color: '#666'
                }}>用户消息数</div>
              </div>
            </div>
          </div>

          {/* 会话分析 */}
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            flexShrink: 0
          }}>
            <SectionTitle title="会话分析" />
            
            {/* 命中标签 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ 
                fontSize: 13,
                marginBottom: 8,
                fontWeight: 600,
                color: '#1f1f1f'
              }}>命中标签</div>
              
              <div style={{ 
                display: 'flex', 
                gap: 8, 
                flexWrap: 'wrap',
                marginBottom: 8
              }}>
                {conversation.tags && conversation.tags.map((tag: string, index: number) => (
                  <span key={index} style={{
                    padding: '4px 8px',
                    borderRadius: 12,
                    background: index === 0 ? 'rgba(22, 119, 255, 0.1)' : 
                              index === 1 ? 'rgba(250, 140, 22, 0.1)' : 
                              'rgba(82, 196, 26, 0.1)',
                    color: index === 0 ? '#1677ff' : 
                          index === 1 ? '#fa8c16' : 
                          '#52c41a',
                    fontSize: 12,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <TagOutlined style={{ fontSize: 10 }} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* 情绪总结 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ 
                fontSize: 13,
                marginBottom: 8,
                fontWeight: 600,
                color: '#1f1f1f'
              }}>情绪总结</div>
              
              <div style={{ 
                display: 'flex', 
                gap: 8, 
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
                          padding: '4px 8px',
                          borderRadius: 12,
                          background: 'rgba(82, 196, 26, 0.1)',
                          color: '#52c41a',
                          fontSize: 12,
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          正向 × {sentimentCounts['正向']}
                        </span>
                      )}
                      
                      {sentimentCounts['中立'] > 0 && (
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: 12,
                          background: 'rgba(250, 173, 20, 0.1)',
                          color: '#faad14',
                          fontSize: 12,
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          中立 × {sentimentCounts['中立']}
                        </span>
                      )}
                      
                      {sentimentCounts['负向'] > 0 && (
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: 12,
                          background: 'rgba(255, 77, 79, 0.1)',
                          color: '#ff4d4f',
                          fontSize: 12,
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
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
                fontSize: 13,
                marginBottom: 8,
                fontWeight: 600,
                color: '#1f1f1f'
              }}>热词</div>
              
              <div style={{ 
                display: 'flex', 
                gap: 8, 
                flexWrap: 'wrap'
              }}>
                {conversation.hotWords && conversation.hotWords.map((word: string, index: number) => (
                  <span key={index} style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: '#fff',
                    border: '1px solid #d9d9d9',
                    color: '#595959',
                    fontSize: 12
                  }}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 改进建议 */}
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
              gap: 12,
              flex: 1
            }}>
              {conversation.improvementSuggestions.map((suggestion, index) => (
                <li key={index} style={{ 
                  padding: 8,
                  background: '#fffbe6',
                  borderRadius: 4,
                  fontSize: 14
                }}>{suggestion}</li>
              ))}
            </ul>
            <div style={{ 
              marginTop: 12,
              color: 'var(--grey-500)',
              fontSize: '0.75rem',
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