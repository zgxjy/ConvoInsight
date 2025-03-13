import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Table, Tag, Progress, Button, Spin, Empty, Input, Select, DatePicker, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { fetchAgentAnalysisData } from '../../services/api';
import './AgentAnalysis.css';

const { Search } = Input;
const { RangePicker } = DatePicker;

// 定义客服分析数据接口
interface AgentAnalysisData {
  agent: string;
  count: number;
  performance: {
    resolved: number;
    partially_resolved: number;
    unresolved: number;
    avg_satisfaction: number;
    avg_resolution: number;
    avg_attitude: number;
    avg_risk: number;
    overall_performance: number;
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
    risk: number;
    tags: string[];
  }>;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

// 定义筛选参数接口
interface FilterParams {
  searchText?: string;
  tag?: string;
  resolutionStatus?: string;
  timeStart?: string;
  timeEnd?: string;
}

// 进度条评分组件
const ScoreProgress: React.FC<{ value: number }> = ({ value }) => {
  // 确保值是数字类型
  const numValue = typeof value === 'number' ? value : 
                typeof value === 'string' ? parseFloat(value) : 0;
  
  // 根据统一色彩系统设置颜色
  let color = '';
  if (numValue >= 80) color = '#52c41a'; // 成功色
  else if (numValue >= 60) color = '#faad14'; // 警告色
  else color = '#ff4d4f'; // 错误色
  
  return (
    <div className="score-progress">
      <Progress 
        percent={numValue} 
        strokeColor={color}
        format={() => `${numValue}`}
        size="small"
        status="normal"
        strokeWidth={8}
        trailColor="#f5f5f5"
      />
    </div>
  );
};

// 指标卡片组件
const MetricCard: React.FC<{
  title: string;
  value: number;
  suffix?: string;
  precision?: number;
  color?: string;
}> = ({ title, value, suffix = '', precision = 0, color }) => {
  return (
    <Card className="metric-card">
      <Statistic
        title={title}
        value={value}
        precision={precision}
        suffix={suffix}
        valueStyle={{ color: color }}
      />
    </Card>
  );
};

// 客服分析组件
const AgentAnalysis: React.FC = () => {
  // 获取URL参数
  const { agentName } = useParams<{ agentName: string }>();
  const navigate = useNavigate();
  
  // 状态管理
  const [agentData, setAgentData] = useState<AgentAnalysisData>({
    agent: '',
    count: 0,
    performance: {
      resolved: 0,
      partially_resolved: 0,
      unresolved: 0,
      avg_satisfaction: 0,
      avg_resolution: 0,
      avg_attitude: 0,
      avg_risk: 0,
      overall_performance: 0,
    },
    conversations: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filters, setFilters] = useState<FilterParams>({});
  
  // 加载客服分析数据
  const loadAgentData = useCallback(async () => {
    if (!agentName) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAgentAnalysisData(agentName, page, pageSize, filters);
      setAgentData(data);
    } catch (err) {
      console.error('加载客服分析数据失败:', err);
      setError('加载客服分析数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [agentName, page, pageSize, filters]);
  
  // 组件挂载或依赖项变化时加载数据
  useEffect(() => {
    loadAgentData();
  }, [loadAgentData]);
  
  // 处理搜索
  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, searchText: value }));
    setPage(1);
  };
  
  // 处理标签筛选
  const handleTagChange = (value: string) => {
    setFilters(prev => ({ ...prev, tag: value }));
    setPage(1);
  };
  
  // 处理状态筛选
  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, resolutionStatus: value }));
    setPage(1);
  };
  
  // 处理日期范围筛选
  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setFilters(prev => ({
      ...prev,
      timeStart: dateStrings[0],
      timeEnd: dateStrings[1]
    }));
    setPage(1);
  };
  
  // 处理表格变化
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };
  
  // 返回仪表盘
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  // 渲染加载状态
  if (loading && !agentData.agent) {
    return (
      <div className="agent-analysis-container">
        <div className="loading-container">
          <Spin size="large" tip="正在加载客服分析数据..." />
        </div>
      </div>
    );
  }
  
  // 渲染错误状态
  if (error && !agentData.agent) {
    return (
      <div className="agent-analysis-container">
        <div className="error-container">
          <Empty description={error} />
          <Button type="primary" onClick={handleBackToDashboard} style={{ marginTop: 16 }}>
            返回仪表盘
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="agent-analysis-container">
      {/* 页面标题 */}
      <div className="agent-analysis-header">
        <h1>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToDashboard}
            style={{ marginRight: 8 }}
          />
          客服分析: {agentData.agent}
        </h1>
      </div>
      
      {/* 客服指标卡片 */}
      <Row gutter={[16, 16]} className="agent-metrics">
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card className="metric-card">
            <Statistic
              title="总会话数"
              value={agentData.count}
              valueStyle={{ fontSize: '56px', fontWeight: 800, color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card className="metric-card">
            <Statistic
              title="综合表现"
              value={agentData.performance.overall_performance}
              precision={1}
              valueStyle={{ 
                fontSize: '56px', 
                fontWeight: 800,
                color: agentData.performance.overall_performance >= 80 ? '#52c41a' : 
                      agentData.performance.overall_performance >= 60 ? '#faad14' : '#ff4d4f'
              }}
            />
            <Progress 
              percent={agentData.performance.overall_performance} 
              showInfo={false} 
              strokeColor={
                agentData.performance.overall_performance >= 80 ? '#52c41a' : 
                agentData.performance.overall_performance >= 60 ? '#faad14' : '#ff4d4f'
              }
              className="metric-progress"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card className="metric-card">
            <Statistic
              title="平均满意度"
              value={agentData.performance.avg_satisfaction}
              precision={1}
              valueStyle={{ 
                fontSize: '56px', 
                fontWeight: 800,
                color: agentData.performance.avg_satisfaction >= 80 ? '#52c41a' : 
                      agentData.performance.avg_satisfaction >= 60 ? '#faad14' : '#ff4d4f'
              }}
            />
            <Progress 
              percent={agentData.performance.avg_satisfaction} 
              showInfo={false} 
              strokeColor={
                agentData.performance.avg_satisfaction >= 80 ? '#52c41a' : 
                agentData.performance.avg_satisfaction >= 60 ? '#faad14' : '#ff4d4f'
              }
              className="metric-progress"
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} className="agent-metrics">
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card className="metric-card">
            <Statistic
              title="已解决率"
              value={agentData.performance.resolved}
              suffix="%"
              precision={1}
              valueStyle={{ 
                fontSize: '36px', 
                fontWeight: 800,
                color: agentData.performance.resolved >= 80 ? '#52c41a' : 
                      agentData.performance.resolved >= 60 ? '#faad14' : '#ff4d4f'
              }}
            />
            <Progress 
              percent={agentData.performance.resolved} 
              showInfo={false} 
              strokeColor={
                agentData.performance.resolved >= 80 ? '#52c41a' : 
                agentData.performance.resolved >= 60 ? '#faad14' : '#ff4d4f'
              }
              className="metric-progress"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card className="metric-card">
            <Statistic
              title="部分解决率"
              value={agentData.performance.partially_resolved}
              suffix="%"
              precision={1}
              valueStyle={{ 
                fontSize: '36px', 
                fontWeight: 800,
                color: '#faad14'
              }}
            />
            <Progress 
              percent={agentData.performance.partially_resolved} 
              showInfo={false} 
              strokeColor="#faad14"
              className="metric-progress"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card className="metric-card">
            <Statistic
              title="未解决率"
              value={agentData.performance.unresolved}
              suffix="%"
              precision={1}
              valueStyle={{ 
                fontSize: '36px', 
                fontWeight: 800,
                color: agentData.performance.unresolved <= 20 ? '#52c41a' : 
                      agentData.performance.unresolved <= 40 ? '#faad14' : '#ff4d4f'
              }}
            />
            <Progress 
              percent={agentData.performance.unresolved} 
              showInfo={false} 
              strokeColor={
                agentData.performance.unresolved <= 20 ? '#52c41a' : 
                agentData.performance.unresolved <= 40 ? '#faad14' : '#ff4d4f'
              }
              className="metric-progress"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card className="metric-card">
            <Statistic
              title="平均解决度"
              value={agentData.performance.avg_resolution}
              precision={1}
              valueStyle={{ 
                fontSize: '36px', 
                fontWeight: 800,
                color: agentData.performance.avg_resolution >= 80 ? '#52c41a' : 
                      agentData.performance.avg_resolution >= 60 ? '#faad14' : '#ff4d4f'
              }}
            />
            <Progress 
              percent={agentData.performance.avg_resolution} 
              showInfo={false} 
              strokeColor={
                agentData.performance.avg_resolution >= 80 ? '#52c41a' : 
                agentData.performance.avg_resolution >= 60 ? '#faad14' : '#ff4d4f'
              }
              className="metric-progress"
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} className="agent-metrics">
        <Col xs={24} sm={12} md={12} lg={12}>
          <Card className="metric-card">
            <Statistic
              title="平均态度评分"
              value={agentData.performance.avg_attitude}
              precision={1}
              valueStyle={{ 
                fontSize: '36px', 
                fontWeight: 800,
                color: agentData.performance.avg_attitude >= 80 ? '#52c41a' : 
                      agentData.performance.avg_attitude >= 60 ? '#faad14' : '#ff4d4f'
              }}
            />
            <Progress 
              percent={agentData.performance.avg_attitude} 
              showInfo={false} 
              strokeColor={
                agentData.performance.avg_attitude >= 80 ? '#52c41a' : 
                agentData.performance.avg_attitude >= 60 ? '#faad14' : '#ff4d4f'
              }
              className="metric-progress"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Card className="metric-card">
            <Statistic
              title="平均风险度"
              value={agentData.performance.avg_risk}
              precision={1}
              valueStyle={{ 
                fontSize: '36px', 
                fontWeight: 800,
                color: agentData.performance.avg_risk <= 20 ? '#52c41a' : 
                      agentData.performance.avg_risk <= 40 ? '#faad14' : '#ff4d4f'
              }}
            />
            <Progress 
              percent={agentData.performance.avg_risk} 
              showInfo={false} 
              strokeColor={
                agentData.performance.avg_risk <= 20 ? '#52c41a' : 
                agentData.performance.avg_risk <= 40 ? '#faad14' : '#ff4d4f'
              }
              className="metric-progress"
            />
          </Card>
        </Col>
      </Row>
      
      {/* 会话列表 */}
      <Card title="会话列表" className="conversations-table">
        <div className="filter-section">
          <Space wrap>
            <Search
              placeholder="搜索会话ID或客户ID"
              allowClear
              onSearch={handleSearch}
              style={{ width: 200 }}
            />
            <Select
              placeholder="标签筛选"
              allowClear
              onChange={handleTagChange}
              style={{ width: 120 }}
              options={[
                { value: '投诉', label: '投诉' },
                { value: '咨询', label: '咨询' },
                { value: '退款', label: '退款' },
              ]}
            />
            <Select
              placeholder="状态筛选"
              allowClear
              onChange={handleStatusChange}
              style={{ width: 120 }}
              options={[
                { value: '已解决', label: '已解决' },
                { value: '部分解决', label: '部分解决' },
                { value: '未解决', label: '未解决' },
              ]}
            />
            <RangePicker onChange={handleDateRangeChange} />
          </Space>
        </div>

        <Table
          columns={[
            {
              title: '会话ID',
              dataIndex: 'id',
              key: 'id',
              width: 180,
              render: (text, record: any) => (
                <a href={`/conversation/${encodeURIComponent(text)}`} onClick={(e) => {
                  e.preventDefault();
                  navigate(`/conversation/${encodeURIComponent(text)}`);
                }}>
                  {text}
                </a>
              )
            },
            {
              title: '主要问题',
              dataIndex: 'mainIssue',
              key: 'mainIssue',
            },
            {
              title: '标签',
              dataIndex: 'tags',
              key: 'tags',
              render: (tags: string[]) => (
                <>
                  {tags && tags.map(tag => (
                    <Tag color="blue" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </>
              )
            },
            {
              title: '客户ID',
              dataIndex: 'customerId',
              key: 'customerId',
              responsive: ['lg'],
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status) => {
                let color = '';
                let text = status;
                
                if (status.toLowerCase() === '已解决') {
                  color = '#52c41a';
                } else if (status.toLowerCase() === '部分解决') {
                  color = '#faad14';
                } else if (status.toLowerCase() === '未解决') {
                  color = '#ff4d4f';
                } else {
                  color = '#8c8c8c';
                }
                
                return <Tag color={color}>{text}</Tag>;
              }
            },
            {
              title: '满意度',
              dataIndex: 'satisfaction',
              key: 'satisfaction',
              width: 120,
              render: (value) => <ScoreProgress value={value} />
            },
            {
              title: '解决度',
              dataIndex: 'resolution',
              key: 'resolution',
              responsive: ['md'],
              width: 120,
              render: (value) => <ScoreProgress value={value} />
            },
            {
              title: '态度评分',
              dataIndex: 'attitude',
              key: 'attitude',
              responsive: ['lg'],
              width: 120,
              render: (value) => <ScoreProgress value={value} />
            },
            {
              title: '风险度',
              dataIndex: 'risk',
              key: 'risk',
              responsive: ['lg'],
              width: 120,
              render: (value) => <ScoreProgress value={value} />
            },
            {
              title: '时间',
              dataIndex: 'time',
              key: 'time',
              render: (text) => new Date(text).toLocaleString('zh-CN')
            }
          ]}
          dataSource={agentData.conversations.map((conv, index) => ({
            ...conv,
            key: index
          }))}
          pagination={{
            current: agentData.pagination.current,
            pageSize: agentData.pagination.pageSize,
            total: agentData.pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `共 ${total} 个会话`,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            }
          }}
          onChange={handleTableChange}
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default AgentAnalysis;
