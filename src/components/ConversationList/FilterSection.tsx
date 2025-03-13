import React, { useEffect, useState } from 'react';
import { Input, Select, DatePicker, Button, Tag } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { 
  filterContainerStyle, 
  filterItemStyle, 
  filterLabelStyle, 
  filterButtonGroupStyle,
  smallFilterItemStyle
} from './styles';
import dayjs from 'dayjs';
import { fetchOptions } from '../../services/api';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface FilterSectionProps {
  searchText: string;
  setSearchText: (text: string) => void;
  timeRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  setTimeRange: (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
  selectedAgent: string;
  setSelectedAgent: (agent: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  handleSearch: () => void;
  handleReset: () => void;
}

interface FilterOptions {
  agents: string[];
  statuses: string[];
  tags: string[];
}

const FilterSection: React.FC<FilterSectionProps> = ({
  searchText,
  setSearchText,
  timeRange,
  setTimeRange,
  selectedAgent,
  setSelectedAgent,
  selectedStatus,
  setSelectedStatus,
  selectedTags,
  setSelectedTags,
  handleSearch,
  handleReset
}) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    agents: [],
    statuses: [],
    tags: []
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    setLoading(true);
    try {
      const response = await fetchOptions();
      if (response.success) {
        setFilterOptions(response.data);
      } else {
        console.error('获取筛选选项失败:', response.message);
      }
    } catch (error) {
      console.error('获取筛选选项出错:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={filterContainerStyle}>
      <div style={filterItemStyle}>
        <div style={filterLabelStyle}>搜索</div>
        <Input 
          placeholder="搜索会话ID/客户/问题" 
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>
      
      <div style={filterItemStyle}>
        <div style={filterLabelStyle}>时间范围</div>
        <RangePicker 
          value={timeRange}
          onChange={(dates) => setTimeRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
          style={{ width: '100%' }}
        />
      </div>
      
      <div style={smallFilterItemStyle}>
        <div style={filterLabelStyle}>客服</div>
        <Select
          placeholder="选择客服"
          style={{ width: '100%' }}
          value={selectedAgent}
          onChange={setSelectedAgent}
          allowClear
          loading={loading}
        >
          {filterOptions.agents.map(agent => (
            <Option key={agent} value={agent}>{agent}</Option>
          ))}
        </Select>
      </div>
      
      <div style={smallFilterItemStyle}>
        <div style={filterLabelStyle}>状态</div>
        <Select
          placeholder="选择状态"
          style={{ width: '100%' }}
          value={selectedStatus}
          onChange={setSelectedStatus}
          allowClear
          loading={loading}
        >
          {filterOptions.statuses.map(status => (
            <Option key={status} value={status}>{status}</Option>
          ))}
        </Select>
      </div>
      
      <div style={filterItemStyle}>
        <div style={filterLabelStyle}>标签</div>
        <Select
          placeholder="选择标签"
          style={{ width: '100%' }}
          mode="multiple"
          value={selectedTags}
          onChange={setSelectedTags}
          allowClear
          loading={loading}
          maxTagCount={3}
          tagRender={(props) => {
            const { label, closable, onClose } = props;
            return (
              <Tag 
                color="#1677ff"
                closable={closable}
                onClose={onClose}
                style={{ marginRight: 3 }}
              >
                {label}
              </Tag>
            );
          }}
        >
          {filterOptions.tags.map(tag => (
            <Option key={tag} value={tag}>{tag}</Option>
          ))}
        </Select>
      </div>
      
      <div style={filterButtonGroupStyle}>
        <Button type="primary" onClick={handleSearch} icon={<FilterOutlined />}>
          筛选
        </Button>
        <Button onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
