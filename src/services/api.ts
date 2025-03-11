import { 
  ConversationData, 
  ConversationListItem, 
  PaginatedResponse, 
  FilterParams,
  ApiResponse
} from '../types/conversationTypes';
import axios from 'axios';

// API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

// 获取会话列表的API
export const fetchConversationList = async (
  page: number = 1, 
  pageSize: number = 10,
  filters?: FilterParams
): Promise<ApiResponse<PaginatedResponse<ConversationListItem>>> => {
  try {
    // 构建查询参数
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    
    if (filters) {
      if (filters.searchText) {
        params.append('searchText', filters.searchText);
      }
      
      if (filters.agent) {
        params.append('agent', filters.agent);
      }
      
      if (filters.resolutionStatus) {
        params.append('resolutionStatus', filters.resolutionStatus);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        // 处理多标签筛选 - 将多个标签合并为一个逗号分隔的字符串
        params.append('tags', filters.tags.join(','));
      }
      
      if (filters.timeRange && filters.timeRange.length === 2) {
        params.append('timeStart', filters.timeRange[0]);
        params.append('timeEnd', filters.timeRange[1]);
      }
    }
    
    // 发送请求
    const response = await axios.get(`${API_BASE_URL}/conversations`, { params });
    
    // 如果成功，直接使用后端返回的列表项数据
    if (response.data.success) {
      return response.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('获取会话列表出错:', error);
    // 返回错误响应
    return {
      success: false,
      message: '获取会话列表失败',
      data: {
        items: [],
        pagination: {
          current: page,
          pageSize,
          total: 0
        }
      }
    };
  }
};

// 获取会话详情的API
export const fetchConversationDetail = async (id: string): Promise<ApiResponse<ConversationData>> => {
  try {
    console.log('API服务接收到的ID:', id);
    
    // 处理ID中可能的特殊字符
    // 如果ID不包含#号但应该包含，则添加#号
    const normalizedId = id.startsWith('#') ? id : `#${id}`;
    console.log('标准化后的ID:', normalizedId);
    
    // 发送请求，尝试使用标准化后的ID
    const response = await axios.get(`${API_BASE_URL}/conversations/${encodeURIComponent(normalizedId)}`);
    return response.data;
  } catch (error) {
    console.error('获取会话详情出错:', error);
    
    // 返回错误响应
    return {
      success: false,
      message: '获取会话详情失败',
      data: {} as ConversationData
    };
  }
};

// 获取筛选选项的API
export const fetchOptions = async (): Promise<ApiResponse<{agents: string[], statuses: string[], tags: string[]}>> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/options`);
    return response.data;
  } catch (error) {
    console.error('获取选项数据出错:', error);
    
    // 返回错误响应
    return {
      success: false,
      message: '获取选项数据失败',
      data: {
        agents: [],
        statuses: [],
        tags: []
      }
    };
  }
};

// 获取统计数据的API
export const fetchStatistics = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/statistics`);
    return response.data;
  } catch (error) {
    console.error('获取统计数据出错:', error);
    
    // 返回错误响应
    return {
      success: false,
      message: '获取统计数据失败',
      data: {}
    };
  }
};

// 获取看板数据的API
export interface DashboardData {
  overview: {
    totalConversations: number;
    avg_totalMessages: number;
    avg_agentMessages: number;
    avg_userMessages: number;
  };
  conversationMetrics: {
    avg_satisfaction: number;
    avg_resolution: number;
    avg_attitude: number;
    avg_risk: number;
  };
  Top_tags: Array<{
    _id: string;
    count: number;
    percentage: number;
  }>;
  Top_hotwords: Array<{
    _id: string;
    count: number;
    percentage: number;
  }>;
}

export const fetchDashboardData = async (): Promise<ApiResponse<DashboardData>> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard`);
    return response.data;
  } catch (error) {
    console.error('获取看板数据出错:', error);
    return {
      success: false,
      message: '获取看板数据失败',
      data: {} as DashboardData
    };
  }
};
