import React, { useState, useEffect } from 'react';
import { Table, Card, Tag as AntTag, Progress, Spin, Empty, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { fetchTagList, TagListItem } from '../../services/api';
import './TagAnalysis.css';

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

// 标签列表组件
const TagList: React.FC = () => {
  const navigate = useNavigate();
  const [tagList, setTagList] = useState<TagListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  
  // 加载标签列表数据
  useEffect(() => {
    const loadTagList = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchTagList();
        setTagList(data);
      } catch (err) {
        console.error('加载标签列表失败:', err);
        setError('加载标签列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    loadTagList();
  }, []);
  
  // 处理查看标签详情
  const handleViewTagDetails = (tagName: string) => {
    navigate(`/tag-analysis/${encodeURIComponent(tagName)}`);
  };
  
  // 返回仪表盘
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  // 渲染加载状态
  if (loading && tagList.length === 0) {
    return (
      <div className="tag-list-container">
        <div className="tag-list-header">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToDashboard}
            className="back-button"
          >
            返回仪表盘
          </Button>
          <h1>标签解决率分析</h1>
        </div>
        <div className="loading-container">
          <Spin size="large" tip="正在加载标签列表..." />
        </div>
      </div>
    );
  }
  
  // 渲染错误状态
  if (error && tagList.length === 0) {
    return (
      <div className="tag-list-container">
        <div className="tag-list-header">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToDashboard}
            className="back-button"
          >
            返回仪表盘
          </Button>
          <h1>标签解决率分析</h1>
        </div>
        <div className="error-container">
          <Empty description={error} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="tag-list-container">
      <div className="tag-list-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToDashboard}
            className="back-button"
          >
            返回仪表盘
          </Button>
          <h1>标签解决率分析</h1>
        </div>
        <div>
          <span style={{ color: '#8c8c8c', marginRight: '8px' }}>共 {tagList.length} 个标签</span>
        </div>
      </div>
      
      <Card title="标签解决率列表" className="tag-list-card">
        <Table
          dataSource={tagList.map((tag, index) => ({
            ...tag,
            key: index
          }))}
          columns={[
            {
              title: '标签名称',
              dataIndex: 'tag',
              key: 'tag',
              render: (text) => (
                <AntTag 
                  color="#1677ff" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleViewTagDetails(text)}
                >
                  {text}
                </AntTag>
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
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Button 
                  type="primary" 
                  size="small" 
                  onClick={() => handleViewTagDetails(record.tag)}
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
            showTotal: (total) => `共 ${total} 个标签`,
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

export default TagList;
