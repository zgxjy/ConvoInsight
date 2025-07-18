import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Progress, Spin, Empty, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { fetchAgentList, AgentListItem } from '../../services/api';
import './AgentAnalysis.css';

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
        format={() => `${numValue.toFixed(1)}`}
        size="small"
        status="normal"
        strokeWidth={8}
        trailColor="#f5f5f5"
      />
    </div>
  );
};

// 客服列表组件
const AgentList: React.FC = () => {
  const navigate = useNavigate();
  const [agentList, setAgentList] = useState<AgentListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  
  // 加载客服列表数据
  useEffect(() => {
    const loadAgentList = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchAgentList();
        setAgentList(data);
      } catch (err) {
        console.error('加载客服列表失败:', err);
        setError('加载客服列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    loadAgentList();
  }, []);
  
  // 处理查看客服详情
  const handleViewAgentDetails = (agentName: string) => {
    navigate(`/agent/${encodeURIComponent(agentName)}`);
  };
  
  // 返回仪表盘
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  // 渲染加载状态
  if (loading && agentList.length === 0) {
    return (
      <div className="agent-list-container">
        <div className="agent-list-header">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToDashboard}
            className="back-button"
          >
            返回仪表盘
          </Button>
          <h1>客服表现分析</h1>
        </div>
        <div className="loading-container">
          <Spin size="large" tip="正在加载客服列表..." />
        </div>
      </div>
    );
  }
  
  // 渲染错误状态
  if (error && agentList.length === 0) {
    return (
      <div className="agent-list-container">
        <div className="agent-list-header">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToDashboard}
            className="back-button"
          >
            返回仪表盘
          </Button>
          <h1>客服表现分析</h1>
        </div>
        <div className="error-container">
          <Empty description={error} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="agent-list-container">
      <div className="agent-list-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToDashboard}
            className="back-button"
          >
            返回仪表盘
          </Button>
          <h1>客服表现分析</h1>
        </div>
        <div>
          <span style={{ color: '#8c8c8c', marginRight: '8px' }}>共 {agentList.length} 位客服</span>
        </div>
      </div>
      
      <Card title="客服表现列表" className="agent-list-card">
        <Table
          dataSource={agentList.map((agent, index) => ({
            ...agent,
            key: index
          }))}
          columns={[
            {
              title: '客服名称',
              dataIndex: 'agent',
              key: 'agent',
              render: (text) => (
                <a onClick={() => handleViewAgentDetails(text)}>{text}</a>
              )
            },
            {
              title: '会话数',
              dataIndex: 'count',
              key: 'count',
              sorter: (a, b) => a.count - b.count,
            },
            {
              title: '已解决率',
              dataIndex: 'resolved',
              key: 'resolved',
              sorter: (a, b) => a.resolved - b.resolved,
              render: (value) => (
                <div className="score-progress">
                  <Progress 
                    percent={value} 
                    strokeColor={value >= 80 ? '#52c41a' : value >= 60 ? '#faad14' : '#ff4d4f'}
                    format={() => `${value.toFixed(1)}%`}
                    size="small"
                    status="normal"
                    strokeWidth={8}
                    trailColor="#f5f5f5"
                  />
                </div>
              )
            },
            {
              title: '部分解决率',
              dataIndex: 'partially_resolved',
              key: 'partially_resolved',
              responsive: ['md'],
              sorter: (a, b) => a.partially_resolved - b.partially_resolved,
              render: (value) => (
                <div className="score-progress">
                  <Progress 
                    percent={value} 
                    strokeColor="#faad14"
                    format={() => `${value.toFixed(1)}%`}
                    size="small"
                    status="normal"
                    strokeWidth={8}
                    trailColor="#f5f5f5"
                  />
                </div>
              )
            },
            {
              title: '未解决率',
              dataIndex: 'unresolved',
              key: 'unresolved',
              responsive: ['md'],
              sorter: (a, b) => a.unresolved - b.unresolved,
              render: (value) => (
                <div className="score-progress">
                  <Progress 
                    percent={value} 
                    strokeColor={value <= 20 ? '#52c41a' : value <= 40 ? '#faad14' : '#ff4d4f'}
                    format={() => `${value.toFixed(1)}%`}
                    size="small"
                    status="normal"
                    strokeWidth={8}
                    trailColor="#f5f5f5"
                  />
                </div>
              )
            },
            {
              title: '满意度',
              dataIndex: 'avg_satisfaction',
              key: 'avg_satisfaction',
              responsive: ['lg'],
              sorter: (a, b) => a.avg_satisfaction - b.avg_satisfaction,
              render: (value) => <ScoreProgress value={value} />
            },
            {
              title: '解决度',
              dataIndex: 'avg_resolution',
              key: 'avg_resolution',
              responsive: ['lg'],
              sorter: (a, b) => a.avg_resolution - b.avg_resolution,
              render: (value) => <ScoreProgress value={value} />
            },
            {
              title: '态度评分',
              dataIndex: 'avg_attitude',
              key: 'avg_attitude',
              responsive: ['lg'],
              sorter: (a, b) => a.avg_attitude - b.avg_attitude,
              render: (value) => <ScoreProgress value={value} />
            },
            {
              title: '安全度',
              dataIndex: 'avg_security',
              key: 'avg_security',
              responsive: ['lg'],
              sorter: (a, b) => a.avg_security - b.avg_security,
              render: (value) => <ScoreProgress value={value} />
            },
            {
              title: '综合表现',
              dataIndex: 'overall_performance',
              key: 'overall_performance',
              sorter: (a, b) => a.overall_performance - b.overall_performance,
              defaultSortOrder: 'descend',
              render: (value) => <ScoreProgress value={value} />
            },
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Button 
                  type="primary" 
                  size="small" 
                  onClick={() => handleViewAgentDetails(record.agent)}
                >
                  查看详情
                </Button>
              )
            }
          ]}
          pagination={{ 
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `共 ${total} 个客服`,
            onChange: (page, size) => {
              if (size !== pageSize) {
                setPageSize(size);
              }
            }
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default AgentList;
