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
    <div className="conversation-analysis">
      <div className="left-panel">
        <div className="metrics-section">
          <h3 className="section-title">会话指标</h3>
          <div className="metrics-grid">
            {Object.entries(conversationData.metrics).map(([key, metric]) => (
              <div key={key} className="metric-card">
                <div className="metric-label">{key}</div>
                <div className="metric-value">{metric.value}</div>
                <div className={`metric-trend trend-${metric.status}`}>
                  {metric.status === 'up' ? '↑' : metric.status === 'down' ? '↓' : '='}{Math.abs(metric.trend)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3 className="section-title">会话摘要</h3>
          <p className="info-text">{conversationData.summary}</p>
          <div className="tag-group">
            {conversationData.tags.map((tag, index) => (
              <span key={index} className={`tag ${index === 0 ? 'tag-primary' : index === 1 ? 'tag-warning' : ''}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="journey-section">
          <h3 className="section-title">客户旅程</h3>
          <div className="journey-timeline">
            <div className="timeline-track">
              {conversationData.journey.steps.map((step, index) => (
                <div key={step.id} className={`timeline-step ${step.status} ${step.type}`}>
                  <div className="step-content">
                    <div className="step-phase">
                      {step.layer === 1 ? '意图识别' : step.layer === 2 ? '解决方案' : '情绪识别'}
                    </div>
                    <div className="step-icon">{step.id}</div>
                    <div className="step-info">
                      <div className="step-header">
                        <div className="step-source">{step.type === 'customer' ? '客户' : '客服'}</div>
                        <div className="step-time">{step.time}</div>
                      </div>
                      <div className="step-title">{step.title}</div>
                      <div className="step-details">{step.details}</div>
                      <div className="step-emotion">
                        <span className="emotion-text">
                          {step.emotionLabel === 'happy' && '开心'}
                          {step.emotionLabel === 'satisfied' && '满意'}
                          {step.emotionLabel === 'neutral' && '平静'}
                          {step.emotionLabel === 'worried' && '担忧'}
                          {step.emotionLabel === 'sad' && '失望'}
                        </span>
                        <span className="emotion-emoji">
                          {step.emotionLabel === 'happy' && '😊'}
                          {step.emotionLabel === 'satisfied' && '🙂'}
                          {step.emotionLabel === 'neutral' && '😐'}
                          {step.emotionLabel === 'worried' && '😟'}
                          {step.emotionLabel === 'sad' && '😞'}
                        </span>
                      </div>
                    </div>
                    {index < conversationData.journey.steps.length - 1 && (
                      <div className="timeline-connector" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="conversation-info">
          <div className="info-section">
            <h3 className="info-section-title">客户信息</h3>
            <div className="info-item">
              <div className="info-label">用户ID</div>
              <div className="info-value">{conversationData.customerInfo.userId}</div>
            </div>
            <div className="info-item">
              <div className="info-label">设备型号</div>
              <div className="info-value">{conversationData.customerInfo.device}</div>
            </div>
            <div className="info-item">
              <div className="info-label">联系历史</div>
              <div className="info-value">{conversationData.customerInfo.history}</div>
            </div>
          </div>

          <div className="info-section">
            <h3 className="info-section-title">改进建议</h3>
            <ul style={{ fontSize: '0.8125rem', paddingLeft: '16px' }}>
              <li style={{ marginBottom: '8px' }}>建议提供更详细的文件恢复指导</li>
              <li style={{ marginBottom: '8px' }}>可以增加预防性提醒</li>
              <li>考虑添加自动备份功能建议</li>
            </ul>
            <div className="disclaimer">AI建议仅供参考</div>
          </div>
        </div>

        <div className="conversation-messages card">
          <div className="messages-header">
            <h3 className="card-title">对话记录</h3>
            <div>
              <span className="tag">{conversationData.messages.length}条消息</span>
            </div>
          </div>
          <div className="messages-content">
            {conversationData.messages.map((message, index) => (
              <div key={index} className={`message message-${message.type}`}>
                <div className="message-bubble">
                  {message.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                  <div className="message-meta">
                    {message.time} • {message.type === 'user' ? '用户' : message.type === 'agent' ? '客服' : ''}: {message.sender}
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
