import React from 'react';
import { ExportOutlined, TagOutlined } from '@ant-design/icons';

const ConversationAnalysis: React.FC = () => {
  // 模拟数据
  const conversationData = {
    id: "#16480",
    time: "2025-03-06 16:43-17:09",
    agent: "沐沐",
    metrics: {
      resolution: { value: 75, trend: 5, status: "up" },
      responseTime: { value: 30, trend: -15, status: "down" },
      satisfaction: { value: 65, trend: 0, status: "equal" },
      performance: { value: 85, trend: 8, status: "up" }
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
      { type: 'system', content: '系统：有新的咨询进来了。', time: '16:43', sender: '系统' },
      { type: 'agent', content: '您好，感谢您联系影石Insta360，我是沐沐，很高兴为您服务！', time: '16:44', sender: '沐沐' },
      { type: 'user', content: '你好，我在你们ios app上编辑InstaX4 视频时，不小心误操作删除了视频，是通过360X4闪传助手连接iPhone 12 pro max ，内存卡是闪迪 512G extreme pro 。请问你们有方法帮我恢復这条视频吗？', time: '16:45', sender: '827822984@qq.com' },
      { type: 'agent', content: '抱歉给您造成的不便，如果您在相机中删除/格式化文件，是无法找回的，目前并不支持回收站的功能。\n\n如果您在App中删除文件，有以下两种情况：\n1. 相机一直连接着App，在App内编辑文件删除的话，相机内的文件也会被删除掉，无法找回。\n2. 相机连接App，将文件下载/导出到手机后，断开相机与App的连接，再进行编辑删除文件的话，在相机内是有文件备份的。\n另外，建议您下次在删除文件/格式化内存等操作前，先备份好文件哦~', time: '16:47', sender: '沐沐' },
      { type: 'agent', content: '辛苦您在相机内查看下是否还有素材的哦', time: '16:48', sender: '沐沐' },
      { type: 'user', content: '那你们有提供数据恢复的相关业务吗？', time: '16:49', sender: '827822984@qq.com' },
      { type: 'agent', content: '非常抱歉，沐沐非常遗憾听到这个消息，目前官方暂时无法为您协助已经删除的内存卡文件，但是您可以自行在百度或其他平台搜索下，看是否有第三方的恢复软件可以协助您进行文件恢复的', time: '16:50', sender: '沐沐' },
      { type: 'user', content: '好吧', time: '16:51', sender: '827822984@qq.com' },
      { type: 'agent', content: '非常抱歉给您带来不便，我们会将这个问题反馈给产品团队，建议未来可以增加文件恢复功能。同时，为了避免类似情况，建议您在编辑重要文件时先创建备份。', time: '16:52', sender: '沐沐' }
    ]
  };

  return (
    <div className="conversation-analysis" style={{ 
      display: 'grid',
      gridTemplateColumns: '320px 1fr 280px',
      gap: '16px',
      height: '100vh',
      padding: '16px',
      backgroundColor: '#f5f5f5'
    }}>
      {/* 左侧分析面板 */}
      <div className="left-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflowY: 'auto'
      }}>
        {/* 指标卡片组 */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#1f2937' }}>会话指标</h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {Object.entries(conversationData.metrics).map(([key, metric]) => (
              <div key={key} style={{
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>{key}</span>
                  <span style={{
                    fontSize: '12px',
                    color: metric.status === 'up' ? '#10b981' : metric.status === 'down' ? '#ef4444' : '#64748b'
                  }}>
                    {metric.status === 'up' ? '↑' : metric.status === 'down' ? '↓' : '='}{Math.abs(metric.trend)}%
                  </span>
                </div>
                <div style={{ 
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginTop: '4px'
                }}>{metric.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 改进建议模块 */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#1f2937' }}>改进建议</h3>
          <ul style={{ 
            listStyle: 'none',
            padding: 0,
            margin: 0,
            fontSize: '14px',
            color: '#374151'
          }}>
            <li style={{
              padding: '8px 12px',
              marginBottom: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <TagOutlined style={{ marginRight: '8px', color: '#3b82f6' }} />
              建议提供更详细的文件恢复指导
            </li>
            <li style={{
              padding: '8px 12px',
              marginBottom: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <TagOutlined style={{ marginRight: '8px', color: '#3b82f6' }} />
              可以增加预防性提醒
            </li>
            <li style={{
              padding: '8px 12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <TagOutlined style={{ marginRight: '8px', color: '#3b82f6' }} />
              考虑添加自动备份功能建议
            </li>
          </ul>
          <div style={{ 
            fontSize: '0.75rem',
            color: 'var(--grey-500, #6b7280)',
            marginTop: '12px',
            textAlign: 'right',
            fontStyle: 'italic'
          }}>AI建议仅供参考</div>
        </div>
      </div>

      {/* 中央内容区 */}
      <div className="main-content" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflowY: 'auto'
      }}>
        {/* 摘要卡片 */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#1f2937' }}>会话摘要</h3>
          <p style={{ 
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#374151',
            marginBottom: '12px'
          }}>{conversationData.summary}</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {conversationData.tags.map((tag, index) => (
              <span key={index} style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                backgroundColor: index === 0 ? '#eff6ff' : index === 1 ? '#fef3c7' : '#ecfdf5',
                color: index === 0 ? '#1d4ed8' : index === 1 ? '#d97706' : '#065f46'
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 旅程时间轴 */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#1f2937' }}>客户旅程</h3>
          <div style={{ position: 'relative', paddingLeft: '24px' }}>
            {conversationData.journey.steps.map((step, index) => (
              <div key={step.id} style={{ 
                position: 'relative',
                paddingBottom: '24px',
                borderLeft: '2px solid #e5e7eb',
                marginLeft: '16px'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-10px',
                  top: '0',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: step.type === 'customer' ? '#3b82f6' : '#10b981',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  {step.id}
                </div>
                <div style={{ 
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  padding: '12px',
                  marginLeft: '24px'
                }}>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <span style={{ 
                      fontSize: '12px',
                      color: step.type === 'customer' ? '#3b82f6' : '#10b981'
                    }}>
                      {step.type === 'customer' ? '客户' : '客服'} • {step.time}
                    </span>
                    <span style={{ 
                      fontSize: '12px',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {step.emotionLabel === 'happy' && '😊'}
                      {step.emotionLabel === 'satisfied' && '🙂'}
                      {step.emotionLabel === 'neutral' && '😐'}
                      {step.emotionLabel === 'worried' && '😟'}
                      {step.emotionLabel === 'sad' && '😞'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>
                    {step.title}
                  </div>
                  <div style={{ 
                    fontSize: '14px',
                    color: '#4b5563',
                    marginTop: '4px'
                  }}>
                    {step.details}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧信息面板 */}
      <div className="right-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflowY: 'auto'
      }}>
        {/* 客户信息卡片 */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#1f2937' }}>客户信息</h3>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>用户ID</div>
            <div style={{ 
              fontSize: '14px',
              color: '#1f2937',
              padding: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              wordBreak: 'break-all'
            }}>
              {conversationData.customerInfo.userId}
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>设备型号</div>
            <div style={{ 
              fontSize: '14px',
              color: '#1f2937',
              padding: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px'
            }}>
              {conversationData.customerInfo.device}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>联系历史</div>
            <div style={{ 
              fontSize: '14px',
              color: '#1f2937',
              padding: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px'
            }}>
              {conversationData.customerInfo.history}
            </div>
          </div>
        </div>

        {/* 对话记录 */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>对话记录</h3>
            <span style={{
              fontSize: '12px',
              color: '#3b82f6',
              backgroundColor: '#eff6ff',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              {conversationData.messages.length}条消息
            </span>
          </div>
          <div style={{ 
            flex: 1,
            overflowY: 'auto',
            padding: '16px'
          }}>
            {conversationData.messages.map((message, index) => (
              <div key={index} style={{ 
                marginBottom: '16px',
                display: 'flex',
                flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '12px',
                  borderRadius: message.type === 'user' ? 
                    '12px 12px 0 12px' : 
                    '12px 12px 12px 0',
                  backgroundColor: message.type === 'user' ? 
                    '#3b82f6' : message.type === 'agent' ? 
                    '#e5e7eb' : '#f3f4f6',
                  color: message.type === 'user' ? 'white' : '#1f2937'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
                  <div style={{ 
                    fontSize: '12px',
                    color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : '#6b7280',
                    marginTop: '8px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>{message.time}</span>
                    <span>
                      {message.type === 'user' ? '用户' : 
                       message.type === 'agent' ? '客服' : '系统'} • 
                      {message.sender}
                    </span>
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