import { useState, useEffect } from 'react';
import { ConversationData } from '../../../types/conversationTypes';
import { fetchConversationDetail } from '../../../services/api';

interface UseConversationDataReturn {
  loading: boolean;
  error: string | null;
  conversation: ConversationData | null;
}

/**
 * 自定义Hook用于获取会话数据
 * 负责数据获取、加载状态和错误处理
 */
export const useConversationData = (id: string | undefined): UseConversationDataReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  
  useEffect(() => {
    console.log('会话详情页面接收到的ID:', id);
    
    const loadConversationDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!id) {
          throw new Error('会话ID不能为空');
        }
        
        const response = await fetchConversationDetail(id);
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

  return { loading, error, conversation };
};
