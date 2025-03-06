import React from 'react';
import { ExportOutlined, TagOutlined } from '@ant-design/icons';
import { 
  ConversationData, 
  JourneyStep, 
  Message 
} from '../types/conversationTypes';
import { 
  conversationData, 
  improvementSuggestions, 
  interactionAnalysis 
} from '../data/conversationData';

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
  // 创建一个可重用的带有蓝色竖条的标题组件

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
              <div style={{ fontWeight: 500 }}>{conversationData.customerInfo.userId}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666' }}>设备型号</div>
              <div style={{ fontWeight: 500 }}>{conversationData.customerInfo.device}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666' }}>联系历史</div>
              <div style={{ fontWeight: 500 }}>{conversationData.customerInfo.history}</div>
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
                {conversationData.tags.map((tag: string, index: number) => (
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
              }}>用户反映相机在室内拍摄太暗，室外拍摄曝光严重</div>
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
                }}>部分解决</span>
              </div>
              <div style={{ 
                color: '#1f1f1f',
                lineHeight: 1.6,
                fontSize: 14
              }}>提供了参数解释和教程链接</div>
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
              }}>解释相机参数（EV、WB、ISO、快门速度）并分享夜景拍摄教程</div>
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
              color: conversationData.metrics.satisfaction.value > 50 ? '#52c41a' : '#ff4d4f'
            }}>
              {conversationData.metrics.satisfaction.value}
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
              color: conversationData.metrics.resolution.value > 50 ? '#52c41a' : '#ff4d4f'
            }}>
              {conversationData.metrics.resolution.value}
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
              color: conversationData.metrics.attitude.value > 50 ? '#52c41a' : '#ff4d4f'
            }}>
              {conversationData.metrics.attitude.value}
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
              color: conversationData.metrics.risk.value > 50 ? '#52c41a' : '#ff4d4f'
            }}>
              {conversationData.metrics.risk.value}
              <span style={{ 
                color: '#8c8c8c',
                fontSize: 24,
                marginLeft: 4
              }}>/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 客户旅程 */}
      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <SectionTitle title="客户旅程" />
        <div style={{ 
          display: 'flex',
          flexDirection: 'row',
          gap: 24,
          position: 'relative',
          overflowX: 'auto',
          padding: '20px 0'
        }}>
          {conversationData.journey.steps.map((step: JourneyStep, index: number) => (
            <div key={step.id} style={{ 
              position: 'relative',
              minWidth: '280px'
            }}>
              {/* 时间线节点和连接线 */}
              <div style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: step.status === 'completed' ? '#52c41a' : '#1677ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 12,
                zIndex: 2
              }}>
                {index + 1}
              </div>
              
              {/* 连接线 */}
              {index < conversationData.journey.steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  width: '100%',
                  height: 2,
                  background: '#f0f0f0',
                  zIndex: 1
                }} />
              )}
              
              {/* 内容区块 */}
              <div style={{ 
                background: step.type === 'customer' ? '#f6ffed' : '#f0f5ff',
                borderRadius: 8,
                padding: 16,
                marginTop: 24
              }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8
                }}>
                  <div style={{ color: step.type === 'customer' ? '#52c41a' : '#1677ff' }}>
                    {step.layer === 1 ? '意图识别' : 
                     step.layer === 2 ? '解决方案' : '情绪识别'}
                  </div>
                  <div style={{ color: '#8c8c8c', fontSize: 12 }}>{step.time}</div>
                </div>
                <div style={{ 
                  fontWeight: 500,
                  marginBottom: 8,
                  color: '#1f1f1f'
                }}>{step.title}</div>
                <div style={{ 
                  color: '#434343',
                  lineHeight: 1.6,
                  marginBottom: 12,
                  fontSize: 13
                }}>{step.details}</div>
                
                {/* 情绪状态 */}
                {step.emotionLabel && (
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#8c8c8c',
                    fontSize: 12
                  }}>
                    <span>{
                      step.emotionLabel === 'happy' ? '😊 开心' :
                      step.emotionLabel === 'satisfied' ? '🙂 满意' :
                      step.emotionLabel === 'neutral' ? '😐 平静' :
                      step.emotionLabel === 'worried' ? '😟 担忧' : '😞 失望'
                    }</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部区块 */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: 24
      }}>
        {/* 左侧分析区域 */}
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
                }}>{interactionAnalysis.totalMessages}</div>
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
                }}>{interactionAnalysis.agentMessages}</div>
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
                }}>{interactionAnalysis.imageMessages}</div>
                <div style={{ 
                  fontSize: 13,
                  color: '#666'
                }}>图片消息数</div>
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
              {improvementSuggestions.map((suggestion, index) => (
                <li key={index} style={{ 
                  padding: 8,
                  background: '#fffbe6',
                  borderRadius: 4,
                  fontSize: 14
                }}>{suggestion}</li>
              ))}
            </ul>
            <div style={{ 
              marginTop: 16,
              color: '#8c8c8c',
              fontSize: 12,
              textAlign: 'right'
            }}>AI建议仅供参考</div>
          </div>
        </div>

        {/* 对话记录 */}
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
            {conversationData.messages.map((message: Message, index: number) => (
              <div key={index} style={{ 
                alignSelf: message.type === 'system' ? 'center' : 
                          message.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: message.type === 'system' ? '90%' : '80%'
              }}>
                <div style={{ 
                  background: message.type === 'system' ? '#f0f0f0' :
                              message.type === 'user' ? '#e6ffed' : '#e6f7ff',
                  borderRadius: 8,
                  padding: 12,
                  position: 'relative',
                  textAlign: message.type === 'system' ? 'center' : 'left'
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationAnalysis;