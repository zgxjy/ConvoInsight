import React from 'react';
import { ExportOutlined, TagOutlined } from '@ant-design/icons';

interface Metric {
  value: number;
  trend: number;
  status: 'up' | 'down' | 'equal';
}

interface Metrics {
  satisfaction: Metric;    // 客户满意度
  resolution: Metric;      // 服务解决度
  attitude: Metric;        // 服务态度
  risk: Metric;           // 服务风险性
}

interface JourneyStep {
  id: number;
  title: string;
  time: string;
  status: 'completed' | 'pending';
  details: string;
  layer: number;
  type: 'customer' | 'service';
  emotion: number;
  emotionLabel: 'happy' | 'satisfied' | 'neutral' | 'worried' | 'sad';
}

interface Message {
  type: 'system' | 'agent' | 'user';
  content: string;
  time: string;
  sender?: string;
}

interface CustomerInfo {
  userId: string;
  device: string;
  history: string;
}

interface ConversationData {
  id: string;
  time: string;
  agent: string;
  metrics: Metrics;
  journey: {
    steps: JourneyStep[];
  };
  customerInfo: CustomerInfo;
  summary: string;
  tags: string[];
  messages: Message[];
}

const ConversationAnalysis: React.FC = () => {
  const conversationData: ConversationData = {
    id: "#16480",
    time: "2025-03-06 16:43-17:09",
    agent: "沐沐",
    metrics: {
      satisfaction: { value: 85, trend: 5, status: "up" },
      resolution: { value: 75, trend: -15, status: "down" },
      attitude: { value: 95, trend: 0, status: "equal" },
      risk: { value: 20, trend: 8, status: "up" }
    },
    journey: {
      steps: [
        {
          id: 1,
          title: "意图识别",
          time: "16:43",
          status: "completed",
          details: "用户希望恢复误删除的视频文件",
          layer: 1,
          type: "customer",
          emotion: 0, // 平静
          emotionLabel: "neutral" // 平静
        },
        {
          id: 2,
          title: "场景确认",
          time: "16:45",
          status: "completed",
          details: "在iOS App编辑时误删，通过闪传助手连接",
          layer: 1,
          type: "customer",
          emotion: -1, // 轻微焦虑
          emotionLabel: "worried" // 担忧
        },
        {
          id: 3,
          title: "解决方案",
          time: "16:47",
          status: "completed",
          details: "说明文件删除的两种情况及对应处理方法",
          layer: 2,
          type: "service",
          emotion: -1,
          emotionLabel: "worried" // 担忧
        },
        {
          id: 4,
          title: "方案补充",
          time: "16:50",
          status: "completed",
          details: "建议使用第三方恢复软件",
          layer: 2,
          type: "service",
          emotion: -2,
          emotionLabel: "sad" // 失望
        },
        {
          id: 5,
          title: "情绪变化",
          time: "16:51",
          status: "completed",
          details: "用户表现失望",
          layer: 3,
          type: "customer",
          emotion: -2,
          emotionLabel: "sad" // 失望
        },
        {
          id: 6,
          title: "安抚跟进",
          time: "16:52",
          status: "completed",
          details: "承诺反馈问题并提供预防建议",
          layer: 3,
          type: "service",
          emotion: -1,
          emotionLabel: "worried" // 担忧
        }
      ]
    },
    customerInfo: {
      userId: "827822984@qq.com",
      device: "Insta360 X4",
      history: "首次咨询"
    },
    summary: "用户咨询Insta360 X4视频误删除恢复问题，客服说明了删除情况下的处理方案，并建议用户使用第三方恢复软件。",
    tags: ["数据恢复", "文件删除", "App操作"],
    messages: [
      { type: 'system', content: '系统：有新的咨询进来了。', time: '16:43' },
      { type: 'agent', content: '您好，感谢您联系影石Insta360，我是沐沐，很高兴为您服务！', time: '16:44', sender: '沐沐' },
      { type: 'user', content: '你好，我在你们ios app上编辑InstaX4 视频时，不小心误操作删除了视频，是通过360X4闪传助手连接iPhone 12 pro max ，内存卡是闪迪 512G extreme pro 。请问你们有方法帮我恢復这条视频吗？', time: '16:45', sender: '827822984@qq.com' },
      { type: 'agent', content: '抱歉给您造成的不便，如果您在相机中删除/格式化文件，是无法找回的，目前并不支持回收站的功能。\n\n如果您在App中删除文件，有以下两种情况：\n1. 相机一直连接着App，在App内编辑文件删除的话，相机内的文件也会被删除掉，无法找回。\n2. 相机连接App，将文件下载/导出到手机后，断开相机与App的连接，再进行编辑删除文件的话，在相机内是有文件备份的。\n另外，建议您下次在删除文件/格式化内存等操作前，先备份好文件哦~', time: '16:47', sender: '沐沐' },
      { type: 'agent', content: '辛苦您在相机内查看下是否还有素材的哦', time: '16:48', sender: '沐沐' },
      { type: 'user', content: '那你们有提供数据恢复的相关业务吗？', time: '16:49', sender: '827822984@qq.com' },
      { type: 'agent', content: '非常抱歉，沐沐非常遗憾听到这个消息，目前官方暂时无法为您协助已经删除的内存卡文件，但是您可以自行在百度或其他平台搜索下，看是否有第三方的恢复软件可以协助您进行文件恢复的', time: '16:50', sender: '沐沐' },
      { type: 'user', content: '好吧', time: '16:51', sender: '827822984@qq.com' },
      { type: 'agent', content: '嗯嗯，关于您反馈的app等文件备份的问题，我们也会去反馈给相关部门进行评估的，同时也温馨提醒您，后续可以及时备份下文件，避免文件丢失的', time: '16:52', sender: '沐沐' },
      { type: 'agent', content: '请问还有其他可以帮到您的吗？', time: '17:00', sender: '沐沐' },
      { type: 'system', content: '系统发送满意度调查', time: '17:05' }
    ]
  };


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
          <h3 style={{ marginBottom: 16, color: '#1f1f1f' }}>客户信息</h3>
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
          <h3 style={{ color: '#1f1f1f', marginBottom: 16 }}>会话摘要</h3>
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

      {/* 客户旅程 */}
      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: 24, color: '#1f1f1f' }}>客户旅程</h3>
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
                background: '#fafafa',
                borderRadius: 8,
                padding: 16,
                marginTop: 24
              }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8
                }}>
                  <div style={{ color: '#1677ff' }}>
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
            <h3 style={{ marginBottom: 16, color: '#1f1f1f' }}>互动分析</h3>
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
                }}>16</div>
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
                }}>13</div>
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
                }}>0</div>
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
            <h3 style={{ marginBottom: 16, color: '#1f1f1f' }}>改进建议</h3>
            <ul style={{ 
              listStyleType: 'none',
              paddingLeft: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              flex: 1
            }}>
              <li style={{ 
                padding: 8,
                background: '#fffbe6',
                borderRadius: 4,
                fontSize: 14
              }}>建议提供更详细的文件恢复指导</li>
              <li style={{ 
                padding: 8,
                background: '#fffbe6',
                borderRadius: 4,
                fontSize: 14
              }}>可以增加预防性提醒</li>
              <li style={{ 
                padding: 8,
                background: '#fffbe6',
                borderRadius: 4,
                fontSize: 14
              }}>考虑添加自动备份功能建议</li>
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
            <h3 style={{ color: '#1f1f1f' }}>对话记录</h3>
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
                alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}>
                <div style={{ 
                  background: message.type === 'user' ? '#e6f4ff' : '#f5f5f5',
                  borderRadius: 8,
                  padding: 12,
                  position: 'relative'
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
                    marginTop: 8
                  }}>
                    {message.time} • {message.type === 'user' ? '用户' : '客服'}
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