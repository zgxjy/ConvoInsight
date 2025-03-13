import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Table, Tag, Progress, Button, Spin, Empty, Input, Select, DatePicker, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { fetchTagAnalysisData } from '../../services/api';
import './TagAnalysis.css';
import type { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;

interface TagAnalysisData {
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

interface FilterParams {
  searchText?: string;
  agent?: string;
  resolutionStatus?: string;
  timeStart?: string;
  timeEnd?: string;
}

const TagAnalysis: React.FC = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [tagData, setTagData] = useState<TagAnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filters, setFilters] = useState<FilterParams>({});

  const loadTagData = useCallback(async (currentPage = page, currentPageSize = pageSize, currentFilters = filters) => {
    try {
      setLoading(true);
      if (tagName) {
        const data = await fetchTagAnalysisData(tagName, currentPage, currentPageSize, currentFilters);
        if (data) {
          setTagData(data);
        }
      }
    } catch (err) {
      setError('加载标签数据失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tagName, page, pageSize, filters]);

  useEffect(() => {
    loadTagData();
  }, [loadTagData]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, searchText: value };
    setFilters(newFilters);
    setPage(1); // 重置到第一页
    loadTagData(1, pageSize, newFilters);
  };

  const handleAgentChange = (value: string) => {
    const newFilters = { ...filters, agent: value };
    setFilters(newFilters);
    setPage(1);
    loadTagData(1, pageSize, newFilters);
  };

  const handleStatusChange = (value: string) => {
    const newFilters = { ...filters, resolutionStatus: value };
    setFilters(newFilters);
    setPage(1);
    loadTagData(1, pageSize, newFilters);
  };

  const handleDateRangeChange = (
    dates: RangePickerProps['value'],
    dateStrings: [string, string]
  ) => {
    const newFilters = { 
      ...filters, 
      timeStart: dateStrings[0] ? dateStrings[0] : undefined, 
      timeEnd: dateStrings[1] ? dateStrings[1] : undefined 
    };
    setFilters(newFilters);
    setPage(1);
    loadTagData(1, pageSize, newFilters);
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // 自定义评分组件，确保统一的样式
  const ScoreProgress: React.FC<{
    value: number | string | null | undefined;
  }> = ({ value }) => {
    // 确保值是数字类型
    const numValue = typeof value === 'number' ? value : 
                    typeof value === 'string' ? parseFloat(value) : 0;
    
    // 根据统一色彩系统设置颜色
    let color = '';
    if (numValue >= 80) color = '#52c41a'; // 成功色
    else if (numValue >= 60) color = '#faad14'; // 警告色
    else color = '#ff4d4f'; // 错误色
    
    // 使用统一的样式
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

  if (loading && !tagData) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="正在加载标签数据..." />
      </div>
    );
  }

  if (error || !tagData) {
    return (
      <div className="error-container">
        <Empty
          description={error || '未找到标签数据'}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button type="primary" onClick={handleBack} style={{ marginTop: 16 }}>
          返回仪表盘
        </Button>
      </div>
    );
  }

  return (
    <div className="tag-analysis-container">
      <div className="tag-analysis-header">
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          style={{ marginRight: 8, fontSize: '16px' }}
        >
          返回仪表盘
        </Button>
        <h1>
          <Tag color="#1677ff" style={{ fontSize: '16px', padding: '4px 8px' }}>
            {tagName}
          </Tag>
          标签分析
        </h1>
      </div>

      <Row gutter={[16, 16]} className="tag-metrics">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="会话总数"
              value={tagData.count}
              valueStyle={{ color: '#1677ff', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已解决率"
              value={Math.round(tagData.resolved)}
              suffix="%"
              valueStyle={{ color: '#52c41a', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="部分解决率"
              value={Math.round(tagData.partially_resolved)}
              suffix="%"
              valueStyle={{ color: '#faad14', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="未解决率"
              value={Math.round(tagData.unresolved)}
              suffix="%"
              valueStyle={{ color: '#ff4d4f', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="解决率分布" className="resolution-chart">
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ display: 'inline-block', width: 80 }}>已解决:</span>
            <div style={{ display: 'inline-block', width: 'calc(100% - 100px)' }}>
              <div style={{ width: '100%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <div 
                  style={{ 
                    width: `${tagData.resolved}%`, 
                    backgroundColor: '#52c41a', 
                    height: '20px', 
                    borderRadius: '4px' 
                  }} 
                />
              </div>
            </div>
            <span style={{ marginLeft: 8 }}>{Math.round(tagData.resolved)}%</span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ display: 'inline-block', width: 80 }}>部分解决:</span>
            <div style={{ display: 'inline-block', width: 'calc(100% - 100px)' }}>
              <div style={{ width: '100%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <div 
                  style={{ 
                    width: `${tagData.partially_resolved}%`, 
                    backgroundColor: '#faad14', 
                    height: '20px', 
                    borderRadius: '4px' 
                  }} 
                />
              </div>
            </div>
            <span style={{ marginLeft: 8 }}>{Math.round(tagData.partially_resolved)}%</span>
          </div>
          <div>
            <span style={{ display: 'inline-block', width: 80 }}>未解决:</span>
            <div style={{ display: 'inline-block', width: 'calc(100% - 100px)' }}>
              <div style={{ width: '100%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <div 
                  style={{ 
                    width: `${tagData.unresolved}%`, 
                    backgroundColor: '#ff4d4f', 
                    height: '20px', 
                    borderRadius: '4px' 
                  }} 
                />
              </div>
            </div>
            <span style={{ marginLeft: 8 }}>{Math.round(tagData.unresolved)}%</span>
          </div>
        </div>
      </Card>

      <Card title="相关会话列表" className="conversations-table">
        <div className="filter-section" style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input.Search
              placeholder="搜索会话"
              allowClear
              onSearch={handleSearch}
              style={{ width: 200 }}
            />
            <Select
              placeholder="客服筛选"
              allowClear
              onChange={handleAgentChange}
              style={{ width: 120 }}
              options={[
                { value: '客服A', label: '客服A' },
                { value: '客服B', label: '客服B' },
                { value: '客服C', label: '客服C' },
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
              title: '客服',
              dataIndex: 'agent',
              key: 'agent',
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
              render: (value) => {
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
              }
            },
            {
              title: '解决度',
              dataIndex: 'resolution',
              key: 'resolution',
              responsive: ['md'],
              width: 120,
              render: (value) => {
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
              }
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
          dataSource={tagData.conversations.map((conv, index) => ({
            ...conv,
            key: index
          }))}
          pagination={{
            current: tagData.pagination.current,
            pageSize: tagData.pagination.pageSize,
            total: tagData.pagination.total,
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

export default TagAnalysis;
