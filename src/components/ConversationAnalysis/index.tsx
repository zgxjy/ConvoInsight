import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Alert, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { styles } from './styles';
import { useConversationData } from './hooks/useConversationData';
import CustomerInfo from './CustomerInfo/CustomerInfo';
import ConversationSummary from './ConversationSummary/ConversationSummary';
import PerformanceMetrics from './PerformanceMetrics/PerformanceMetrics';
import MessageList from './MessageList/MessageList';
import AnalysisPanel from './AnalysisPanel/AnalysisPanel';
import { ConversationData, Message } from '../../types/conversationTypes';

/**
 * 会话分析主组件
 * 整合各个子组件，展示完整的会话分析页面
 */
const ConversationAnalysis: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // 使用自定义Hook获取会话数据
  const { loading, error, conversation }: { loading: boolean, error: string | null, conversation: ConversationData | null } = useConversationData(id);

  // 返回上一页
  const handleBack = () => {
    navigate('/conversations');
  };

  // 加载状态
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 80px)',
        backgroundColor: styles.colors.background.light
      }}>
        <Spin size="large" tip="加载会话数据中..." />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 80px)',
        padding: styles.spacing.lg,
        backgroundColor: styles.colors.background.light
      }}>
        <Alert 
          message="加载失败" 
          description={error} 
          type="error" 
          showIcon 
          style={{ marginBottom: styles.spacing.lg }}
        />
        <Button type="primary" onClick={handleBack}>
          返回会话列表
        </Button>
      </div>
    );
  }

  // 数据为空状态
  if (!conversation) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 80px)',
        padding: styles.spacing.lg,
        backgroundColor: styles.colors.background.light
      }}>
        <Empty description="未找到会话数据" />
        <Button type="primary" onClick={handleBack} style={{ marginTop: styles.spacing.md }}>
          返回会话列表
        </Button>
      </div>
    );
  }

  // 数据不完整状态
  if (!conversation.customerInfo || !conversation.conversationSummary || 
      !conversation.metrics || !conversation.messages) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 80px)',
        padding: styles.spacing.lg,
        backgroundColor: styles.colors.background.light
      }}>
        <Empty description="会话数据不完整" />
        <Button type="primary" onClick={handleBack} style={{ marginTop: styles.spacing.md }}>
          返回会话列表
        </Button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: 1200,
      margin: '0 auto',
      padding: styles.spacing.lg,
      display: 'flex',
      flexDirection: 'column',
      gap: styles.spacing.lg,
      backgroundColor: styles.colors.background.light
    }}>
      {/* 顶部导航 */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: styles.spacing.md
      }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          style={{ marginRight: styles.spacing.md }}
        >
          返回会话列表
        </Button>
        <h1 style={{ 
          margin: 0,
          ...styles.typography.h1
        }}>
          会话 {conversation.id}
        </h1>
      </div>

      {/* 客服表现评估 */}
      <PerformanceMetrics 
        satisfaction={conversation.metrics.satisfaction}
        resolution={conversation.metrics.resolution}
        attitude={conversation.metrics.attitude}
        risk={conversation.metrics.risk}
      />

      {/* 摘要信息行 */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: styles.spacing.lg
      }}>
        {/* 客户信息 */}
        <CustomerInfo 
          userId={conversation.customerInfo.userId}
          device={conversation.customerInfo.device}
          history={conversation.customerInfo.history}
        />
        
        {/* 会话摘要 */}
        <ConversationSummary 
          mainIssue={conversation.conversationSummary.mainIssue}
          resolutionStatus={conversation.conversationSummary.resolutionStatus}
          mainSolution={conversation.conversationSummary.mainSolution}
          tags={conversation.tags}
        />
      </div>

      {/* 底部区块 */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: styles.spacing.lg
      }}>
        {/* 左侧对话记录 */}
        <MessageList messages={conversation.messages} />
        
        {/* 右侧分析区域 */}
        <AnalysisPanel 
          tags={conversation.tags || []}
          emotionSummary={{
            positive: conversation.messages
              .filter((msg: Message) => msg.type === 'user' && msg.sentiment === '正向').length,
            neutral: conversation.messages
              .filter((msg: Message) => msg.type === 'user' && msg.sentiment === '中立').length,
            negative: conversation.messages
              .filter((msg: Message) => msg.type === 'user' && msg.sentiment === '负向').length
          }}
          hotWords={conversation.hotWords || []}
          improvementSuggestions={conversation.improvementSuggestions || []}
          interactionAnalysis={{
            totalMessages: conversation.messages.length,
            agentMessages: conversation.messages.filter((msg: Message) => msg.type === 'agent').length,
            userMessages: conversation.messages.filter((msg: Message) => msg.type === 'user').length
          }}
        />
      </div>
    </div>
  );
};

export default ConversationAnalysis;
