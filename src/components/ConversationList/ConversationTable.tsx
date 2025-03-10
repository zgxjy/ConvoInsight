import React from 'react';
import { Table, Tag, Space, Progress, Spin } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { ConversationListItem } from '../../types/conversationTypes';
import { tableRowStyle, progressContainerStyle, statusColors, getSatisfactionColor } from './styles';

interface ConversationTableProps {
  data: ConversationListItem[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  handleTableChange: (pagination: any) => void;
  handleRowClick: (record: ConversationListItem) => void;
}

const ConversationTable: React.FC<ConversationTableProps> = ({
  data,
  loading,
  pagination,
  handleTableChange,
  handleRowClick
}) => {
  // 表格列定义
  const columns: ColumnsType<ConversationListItem> = [
    {
      title: '会话ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text) => <a href={`/conversation/${encodeURIComponent(text)}`}>{text}</a>,
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
        const color = statusColors[status as keyof typeof statusColors] || 'green';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '客户满意度',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      width: 140,
      render: (score) => {
        const color = getSatisfactionColor(score);
        
        return (
          <div style={progressContainerStyle}>
            <Progress 
              type="circle" 
              percent={score} 
              size={36} 
              strokeColor={color}
              format={(percent) => `${percent}`}
            />
          </div>
        );
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

  return (
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
          style: tableRowStyle
        })}
      />
    </Spin>
  );
};

export default ConversationTable;
