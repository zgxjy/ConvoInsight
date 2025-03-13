import { 
  ConversationData, 
  ConversationListItem, 
  PaginatedResponse, 
  FilterParams,
} from '../types/conversationTypes';
import axios from 'axios';

// API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

// 获取会话列表的API
export const fetchConversationList = async (
  page: number = 1, 
  pageSize: number = 10,
  filters?: FilterParams
): Promise<TagApiResponse<PaginatedResponse<ConversationListItem>>> => {
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
export const fetchConversationDetail = async (id: string): Promise<TagApiResponse<ConversationData>> => {
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
export const fetchOptions = async (): Promise<TagApiResponse<{agents: string[], statuses: string[], tags: string[]}>> => {
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
export const fetchStatistics = async (): Promise<TagApiResponse<any>> => {
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
  tag_resolution_rates: Array<{
    tag: string;
    resolved: number;
    partially_resolved: number;
    unresolved: number;
    count: number;
  }>;
  tag_cooccurrence: Array<{
    tag_pair: [string, string];
    count: number;
    percentage: number;
  }>;
  agent_service_rates: Array<{
    agent: string;
    count: number;
    resolved: number;
    partially_resolved: number;
    unresolved: number;
    avg_satisfaction: number;
    avg_resolution: number;
    avg_attitude: number;
    avg_risk: number;
    overall_performance: number;
  }>;
}

export const fetchDashboardData = async (): Promise<TagApiResponse<DashboardData>> => {
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

export interface TagAnalysisData {
  tag: string;
  count: number;
  resolved: number;
  partially_resolved: number;
  unresolved: number;
  conversations: Array<{
    id: string;
    title: string;
    time: string;
    agent: string;
    customerId: string;
    mainIssue: string;
    status: string;
    satisfaction: number;
    resolution: number;
    attitude: number;
    risk: number;
  }>;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

export interface TagApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const fetchTagAnalysisData = async (
  tagName: string,
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    searchText?: string;
    agent?: string;
    resolutionStatus?: string;
    timeStart?: string;
    timeEnd?: string;
  }
): Promise<TagAnalysisData> => {
  try {
    // 使用encodeURIComponent确保URL安全编码
    const encodedTagName = encodeURIComponent(tagName);
    
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
      
      if (filters.timeStart) {
        params.append('timeStart', filters.timeStart);
      }
      
      if (filters.timeEnd) {
        params.append('timeEnd', filters.timeEnd);
      }
    }
    
    console.log(`正在请求标签数据: ${API_BASE_URL}/tag/${encodedTagName}?${params.toString()}`);
    
    // 使用fetch API的完整选项
    const response = await fetch(`${API_BASE_URL}/tag/${encodedTagName}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      // 尝试解析错误响应
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || '获取标签分析数据失败');
      } catch (jsonError) {
        // 如果响应不是JSON格式，则返回状态文本
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }
    }
    
    const result = await response.json() as TagApiResponse<TagAnalysisData>;
    if (!result.success) {
      throw new Error(result.message || '获取标签分析数据失败');
    }
    return result.data;
  } catch (error) {
    console.error('获取标签分析数据出错:', error);
    throw error;
  }
};
