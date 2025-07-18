import { 
  ConversationData, 
  ConversationListItem, 
  PaginatedResponse, 
  FilterParams,
} from '../types/conversationTypes';
import axios from 'axios';

// API基础URL - 使用相对路径，使其可以被任何域托管
const API_BASE_URL = '/api';

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
    
    // 发送请求，直接使用原始ID
    const response = await axios.get(`${API_BASE_URL}/conversations/${encodeURIComponent(id)}`);
    return response.data;
  } catch (error: any) {
    console.error('获取会话详情出错:', error);
    
    // 返回更详细的错误响应
    const errorMessage = error.response?.data?.message || `未找到ID为 ${id} 的会话`;
    return {
      success: false,
      message: errorMessage,
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
    avg_security: number;
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
    avg_security: number;
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
    security: number;
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

// 客服分析数据接口
export interface AgentAnalysisData {
  agent: string;
  count: number;
  performance: {
    resolved: number;
    partially_resolved: number;
    unresolved: number;
    avg_satisfaction: number;
    avg_resolution: number;
    avg_attitude: number;
    avg_security: number;
    overall_performance: number;
    avg_response_time: number;
    avg_resolution_time: number;
  };
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
    security: number;
    tags: string[];
  }>;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

// 获取客服分析数据的API
export const fetchAgentAnalysisData = async (
  agentName: string,
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    searchText?: string;
    tag?: string;
    resolutionStatus?: string;
    timeStart?: string;
    timeEnd?: string;
  }
): Promise<AgentAnalysisData> => {
  try {
    // 使用encodeURIComponent确保URL安全编码
    const encodedAgentName = encodeURIComponent(agentName);
    
    // 构建查询参数
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    
    if (filters) {
      if (filters.searchText) {
        params.append('searchText', filters.searchText);
      }
      
      if (filters.tag) {
        params.append('tag', filters.tag);
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
    
    console.log(`正在请求客服数据: ${API_BASE_URL}/agent/${encodedAgentName}?${params.toString()}`);
    
    // 使用fetch API的完整选项
    const response = await fetch(`${API_BASE_URL}/agent/${encodedAgentName}?${params.toString()}`, {
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
        throw new Error(errorData.message || '获取客服分析数据失败');
      } catch (jsonError) {
        // 如果响应不是JSON格式，则返回状态文本
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }
    }
    
    const result = await response.json() as TagApiResponse<AgentAnalysisData>;
    if (!result.success) {
      throw new Error(result.message || '获取客服分析数据失败');
    }
    return result.data;
  } catch (error) {
    console.error('获取客服分析数据出错:', error);
    throw error;
  }
};

// 获取所有客服列表的API
export interface AgentListItem {
  agent: string;
  count: number;
  resolved: number;
  partially_resolved: number;
  unresolved: number;
  avg_satisfaction: number;
  avg_resolution: number;
  avg_attitude: number;
  avg_security: number;
  overall_performance: number;
}

export const fetchAgentList = async (): Promise<AgentListItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/agents`, {
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
        throw new Error(errorData.message || '获取客服列表失败');
      } catch (jsonError) {
        // 如果响应不是JSON格式，则返回状态文本
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }
    }
    
    const result = await response.json() as TagApiResponse<AgentListItem[]>;
    if (!result.success) {
      throw new Error(result.message || '获取客服列表失败');
    }
    return result.data;
  } catch (error) {
    console.error('获取客服列表出错:', error);
    throw error;
  }
};

// 标签列表项接口
export interface TagListItem {
  tag: string;
  count: number;
  resolved: number;
  partially_resolved: number;
  unresolved: number;
  avg_satisfaction: number;
  avg_resolution: number;
}

// 获取所有标签列表的API
export const fetchTagList = async (): Promise<TagListItem[]> => {
  try {
    // 获取仪表盘数据，其中包含tag_resolution_rates
    const dashboardResponse = await axios.get(`${API_BASE_URL}/dashboard`);
    const dashboardResult = dashboardResponse.data;
    
    if (!dashboardResult.success) {
      throw new Error(dashboardResult.message || '获取标签列表失败');
    }
    
    // 从仪表盘数据中提取标签解决率数据
    const tagResolutionRates = dashboardResult.data.tag_resolution_rates || [];
    
    // 转换为TagListItem格式
    return tagResolutionRates.map((item: any) => ({
      tag: item.tag,
      count: item.count || 0,
      resolved: item.resolved || 0,
      partially_resolved: item.partially_resolved || 0,
      unresolved: item.unresolved || 0,
      // 估算满意度和解决度（模拟数据）
      avg_satisfaction: Math.round((item.resolved * 90 + item.partially_resolved * 60 + item.unresolved * 30) / 100),
      avg_resolution: Math.round((item.resolved * 95 + item.partially_resolved * 50) / 100)
    }));
  } catch (error) {
    console.error('获取标签列表出错:', error);
    throw error;
  }
};
