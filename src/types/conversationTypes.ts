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

export interface JourneyStep {
  id: number;
  title: string;
  time: string;
  status: 'completed' | 'pending';
  details: string;
  layer: number;
  type: 'customer' | 'service';
  emotion: number;
  emotionLabel: 'happy' | 'satisfied' | 'neutral' | 'worried' | 'sad';
}

export interface Message {
  type: 'system' | 'agent' | 'user';
  content: string;
  time: string;
  sender?: string;
}

export interface CustomerInfo {
  userId: string;
  device: string;
  history: string;
}

export interface ConversationData {
  id: string;
  time: string;
  agent: string;
  metrics: Metrics;
  journey: {
    steps: JourneyStep[];
  };
  customerInfo: CustomerInfo;
  summary: string;
  tags: string[];
  messages: Message[];
}

export interface InteractionAnalysis {
  totalMessages: number;
  agentMessages: number;
  imageMessages: number;
}
