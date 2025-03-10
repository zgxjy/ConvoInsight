export interface Metric {
  value: number;
  trend: number;
  status: 'up' | 'down' | 'equal';
}

export interface Metrics {
  satisfaction: Metric;    // 客户满意度
  resolution: Metric;      // 服务解决度
  attitude: Metric;        // 服务态度
  risk: Metric;           // 服务风险性
}


export interface Message {
  type: 'system' | 'agent' | 'user';
  content: string;
  time: string;
  sender?: string;
  sentiment?: '正向' | '中立' | '负向';
}

export interface CustomerInfo {
  userId: string;
  device: string;
  history: string;
}

export interface ResolutionStatus {
  status: string;
  description: string;
}

export interface ConversationSummary {
  mainIssue: string;
  resolutionStatus: ResolutionStatus;
  mainSolution: string;
}

export interface InteractionAnalysis {
  totalMessages: number;
  agentMessages: number;
  userMessages: number;
}

export interface ConversationData {
  id: string;
  time: string;
  agent: string;
  metrics: Metrics;
  customerInfo: CustomerInfo;
  summary: string;
  conversationSummary: ConversationSummary;
  tags: string[];
  messages: Message[];
  improvementSuggestions: string[];
  interactionAnalysis: InteractionAnalysis;
  emotionSummary?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  hotWords?: string[];
}

// 列表页面使用的简化会话数据类型
export interface ConversationListItem {
  id: string;
  time: string;
  agent: string;
  customerId: string;
  mainIssue: string;
  resolutionStatus: string;
  tags: string[];
  satisfaction: number; // 客户满意度分数
}

// 分页数据结构
export interface PaginationData {
  current: number;
  pageSize: number;
  total: number;
}

// 筛选条件类型
export interface FilterParams {
  timeRange?: [string, string];
  agent?: string;
  resolutionStatus?: string;
  tag?: string;
  searchText?: string;
}

// 后端API响应数据结构
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 分页列表响应数据结构
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationData;
}
