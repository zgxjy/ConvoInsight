import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ConversationListItem, FilterParams } from '../../types/conversationTypes';
import { fetchConversationList } from '../../services/api';
import HeaderSection from './HeaderSection';
import FilterSection from './FilterSection';
import ConversationTable from './ConversationTable';
import { containerStyle } from './styles';
import dayjs from 'dayjs';

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  
  // 加载数据函数
  const loadData = async (page: number = pagination.current, pageSize: number = pagination.pageSize) => {
    setLoading(true);
    try {
      const currentFilters: FilterParams = {
        ...filters,
        searchText: searchText || undefined,
        agent: selectedAgent || undefined,
        resolutionStatus: selectedStatus || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        timeRange: timeRange ? [timeRange[0].format('YYYY-MM-DD'), timeRange[1].format('YYYY-MM-DD')] : undefined
      };
      
      const response = await fetchConversationList(page, pageSize, currentFilters);
      
      if (response.success) {
        setData(response.data.items);
        setPagination({
          ...pagination,
          current: response.data.pagination.current,
          pageSize: response.data.pagination.pageSize,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setSelectedTags([]);
    setTimeRange(null);
    setFilters({});
    loadData(1);
  };

  // 处理行点击，导航到详情页
  const handleRowClick = (record: ConversationListItem) => {
    navigate(`/conversation/${record.id}`);
  };

  return (
    <div style={containerStyle}>
      <HeaderSection 
        title="会话列表" 
        subtitle="查看所有客服会话记录及分析" 
      />
      
      <FilterSection 
        searchText={searchText}
        setSearchText={setSearchText}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        handleSearch={handleSearch}
        handleReset={handleReset}
      />
      
      <ConversationTable 
        data={data}
        loading={loading}
        pagination={pagination}
        handleTableChange={handleTableChange}
        handleRowClick={handleRowClick}
      />
    </div>
  );
};

export default ConversationList;
