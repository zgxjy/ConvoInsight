import React from 'react';
import { Message } from '../../../types/conversationTypes';
import { styles } from '../styles';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
}

/**
 * 对话记录组件
 * 展示用户和客服之间的对话消息列表
 */
const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <Card>
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
        gap: styles.spacing.sm,
        width: '100%', // 确保宽度一致
        minWidth: 0, // 防止子元素撑开容器
        overflowX: 'hidden' // 防止水平滚动
      }}>
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </div>
    </Card>
  );
};

export default MessageList;
