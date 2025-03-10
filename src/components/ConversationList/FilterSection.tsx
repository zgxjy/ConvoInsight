import React from 'react';
import { Input, Select, DatePicker, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { 
  filterContainerStyle, 
  filterItemStyle, 
  filterLabelStyle, 
  filterButtonGroupStyle,
  smallFilterItemStyle
} from './styles';
import dayjs from 'dayjs';

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
  handleSearch: () => void;
  handleReset: () => void;
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
  handleSearch,
  handleReset
}) => {
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
        >
          <Option value="沐沐">沐沐</Option>
          <Option value="小林">小林</Option>
          <Option value="阿强">阿强</Option>
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
        >
          <Option value="已解决">已解决</Option>
          <Option value="部分解决">部分解决</Option>
          <Option value="未解决">未解决</Option>
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
