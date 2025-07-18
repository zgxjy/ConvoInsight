from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Union

# 基本数据模型
class Metric(BaseModel):
    value: int
    trend: int
    status: str

class Metrics(BaseModel):
    satisfaction: Metric
    resolution: Metric
    attitude: Metric
    security: Metric

class ResolutionStatus(BaseModel):
    status: str
    description: str

class ConversationSummary(BaseModel):
    mainIssue: str
    resolutionStatus: ResolutionStatus
    mainSolution: str

class CustomerInfo(BaseModel):
    userId: str
    device: str
    history: str


class Message(BaseModel):
    type: str
    content: str
    time: str
    sender: Optional[str] = None

class InteractionAnalysis(BaseModel):
    totalMessages: int
    agentMessages: int
    imageMessages: int

# 完整会话数据模型
class ConversationData(BaseModel):
    id: str
    time: str
    agent: str
    metrics: Metrics
    customerInfo: CustomerInfo
    conversationSummary: ConversationSummary
    tags: List[str]
    messages: List[Message]
    improvementSuggestions: List[str]
    interactionAnalysis: InteractionAnalysis

# 简化的会话列表项模型
class ConversationListItem(BaseModel):
    id: str
    time: str
    agent: str
    customerId: str
    mainIssue: str
    resolutionStatus: str
    tags: List[str]

# 分页数据模型
class PaginationData(BaseModel):
    current: int
    pageSize: int
    total: int

# 筛选参数模型
class FilterParams(BaseModel):
    timeRange: Optional[List[str]] = None
    agent: Optional[str] = None
    resolutionStatus: Optional[str] = None
    tag: Optional[str] = None
    searchText: Optional[str] = None

# API响应模型
class ApiResponse(BaseModel):
    success: bool
    data: Any
    message: Optional[str] = None

# 分页列表响应模型
class PaginatedResponse(BaseModel):
    items: List[Any]
    pagination: PaginationData
