import React, { useState, useEffect } from 'react';
import { Table, Input, Select, DatePicker, Button, Tag, Space, Typography, Spin, message } from 'antd';
import { SearchOutlined, FilterOutlined, TagOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { ConversationListItem, FilterParams } from '../types/conversationTypes';
import { fetchConversationList } from '../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ConversationList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ConversationListItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // 筛选条件状态
  const [filters, setFilters] = useState<FilterParams>({});
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [timeRange, setTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  
  // 表格列定义
  const columns: ColumnsType<ConversationListItem> = [
    {
      title: '会话ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text) => <a>{text}</a>,
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '客服',
      dataIndex: 'agent',
      key: 'agent',
      width: 100,
    },
    {
      title: '客户ID',
      dataIndex: 'customerId',
      key: 'customerId',
      width: 180,
      ellipsis: true,
    },
    {
      title: '主要问题',
      dataIndex: 'mainIssue',
      key: 'mainIssue',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'resolutionStatus',
      key: 'resolutionStatus',
      width: 120,
      render: (status) => {
        let color = 'green';
        if (status === '部分解决') {
          color = 'orange';
        } else if (status === '未解决') {
          color = 'red';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      width: 220,
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags.map((tag, index) => (
            <Tag 
              key={index}
              color={index % 3 === 0 ? "blue" : index % 3 === 1 ? "orange" : "green"}
              icon={<TagOutlined />}
              style={{ marginRight: 0 }}
            >
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  // 加载数据函数
  const loadData = async (page: number = pagination.current, pageSize: number = pagination.pageSize) => {
    setLoading(true);
    try {
      const currentFilters: FilterParams = {
        ...filters,
        searchText: searchText || undefined,
        agent: selectedAgent || undefined,
        resolutionStatus: selectedStatus || undefined,
        timeRange: timeRange ? [timeRange[0].format('YYYY-MM-DD'), timeRange[1].format('YYYY-MM-DD')] : undefined
      };
      
      const response = await fetchConversationList(page, pageSize, currentFilters);
      
      if (response.success) {
        setData(response.data.items);
        setPagination({
          ...pagination,
          current: response.data.pagination.current,
          total: response.data.pagination.total,
        });
      } else {
        message.error('获取会话列表失败');
      }
    } catch (error) {
      console.error('获取会话列表出错:', error);
      message.error('获取会话列表出错');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和筛选条件变化时重新加载数据
  useEffect(() => {
    loadData(1);
  }, []);

  // 处理表格分页变化
  const handleTableChange = (newPagination: any) => {
    loadData(newPagination.current, newPagination.pageSize);
  };

  // 处理搜索
  const handleSearch = () => {
    loadData(1);
  };

  // 重置筛选条件
  const handleReset = () => {
    setSearchText('');
    setSelectedStatus('');
    setSelectedAgent('');
    setTimeRange(null);
    setFilters({});
    loadData(1);
  };

  // 处理行点击，导航到详情页
  const handleRowClick = (record: ConversationListItem) => {
    // 使用encodeURIComponent确保ID中的特殊字符被正确编码
    const encodedId = encodeURIComponent(record.id);
    navigate(`/conversation/${encodedId}`);
    console.log('导航到:', `/conversation/${encodedId}`);
  };

  return (
    <div className="conversation-list" style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: 24,
      backgroundColor: '#fff'
    }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>会话列表</Title>
        <Text type="secondary">查看所有客服会话记录及分析</Text>
      </div>

      {/* 筛选器区域 */}
      <div style={{ 
        marginBottom: 24, 
        padding: 16, 
        background: '#f5f5f5', 
        borderRadius: 8,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'flex-end'
      }}>
        <div style={{ minWidth: 200 }}>
          <div style={{ marginBottom: 4 }}>搜索</div>
          <Input 
            placeholder="搜索会话ID/客户/问题" 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
        
        <div style={{ minWidth: 200 }}>
          <div style={{ marginBottom: 4 }}>时间范围</div>
          <RangePicker 
            value={timeRange}
            onChange={(dates) => setTimeRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ minWidth: 120 }}>
          <div style={{ marginBottom: 4 }}>客服</div>
          <Select
            placeholder="选择客服"
            style={{ width: '100%' }}
            value={selectedAgent}
            onChange={setSelectedAgent}
            allowClear
          >
            <Option value="沐沐">沐沐</Option>
            <Option value="小林">小林</Option>
            <Option value="阿强">阿强</Option>
          </Select>
        </div>
        
        <div style={{ minWidth: 120 }}>
          <div style={{ marginBottom: 4 }}>状态</div>
          <Select
            placeholder="选择状态"
            style={{ width: '100%' }}
            value={selectedStatus}
            onChange={setSelectedStatus}
            allowClear
          >
            <Option value="已解决">已解决</Option>
            <Option value="部分解决">部分解决</Option>
            <Option value="未解决">未解决</Option>
          </Select>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="primary" onClick={handleSearch} icon={<FilterOutlined />}>
            筛选
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </div>
      </div>

      {/* 表格区域 */}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' }
          })}
        />
      </Spin>
    </div>
  );
};

export default ConversationList;
