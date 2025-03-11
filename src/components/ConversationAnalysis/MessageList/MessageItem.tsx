import React from 'react';
import { Message } from '../../../types/conversationTypes';
import { styles } from '../styles';

interface MessageItemProps {
  message: Message;
}

/**
 * 消息项组件
 * 展示单条消息，包括内容、发送时间和发送者类型
 */
const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div style={{ 
      alignSelf: message.type === 'system' ? 'center' : 
                message.type === 'user' ? 'flex-start' : 'flex-end',
      maxWidth: message.type === 'system' ? '90%' : '80%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: message.type === 'system' ? 'auto' : 'fit-content',
      minWidth: message.type === 'system' ? '60%' : 'auto',
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
        maxWidth: '100%', 
        width: message.type === 'system' ? '100%' : 'auto',
        wordWrap: 'break-word', 
        wordBreak: 'break-word', 
        overflowWrap: 'break-word', 
        whiteSpace: 'pre-wrap', 
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
  );
};

export default MessageItem;
