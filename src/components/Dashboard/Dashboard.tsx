import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Progress, Spin, Tooltip, Table, Tag } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { fetchDashboardData, DashboardData } from '../../services/api';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tagPagination, setTagPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetchDashboardData();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.message || '获取数据失败');
        }
      } catch (err) {
        setError('获取数据时发生错误');
        console.error('获取看板数据出错:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // 根据分数返回对应的颜色
  const getColorByScore = (score: number): string => {
    if (score > 85) return '#52c41a'; // 绿色
    if (score >= 75) return '#faad14'; // 黄色
    if (score >= 60) return '#ff85c0'; // 粉红色
    return '#ff4d4f'; // 红色
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" tip="加载数据中..." />
      </div>
    );
  }

  if (error) {
    return <div className="dashboard-error">错误: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="dashboard-error">没有可用数据</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">会话分析看板</h1>
      
      <section className="dashboard-section">
        <h2 className="section-title">总体指标</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title={
                  <div className="metric-title">
                    会话总数
                    <Tooltip title="所有已完成的会话数量">
                      <InfoCircleOutlined style={{ marginLeft: '8px', color: '#8c8c8c' }} />
                    </Tooltip>
                  </div>
                }
                value={dashboardData.overview.totalConversations} 
                valueStyle={{ fontSize: '56px', fontWeight: 800, color: '#1677ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title={
                  <div className="metric-title">
                    平均消息总数
                    <Tooltip title="每个会话的平均消息数量">
                      <InfoCircleOutlined style={{ marginLeft: '8px', color: '#8c8c8c' }} />
                    </Tooltip>
                  </div>
                }
                value={Math.round(dashboardData.overview.avg_totalMessages * 10) / 10}
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title={
                  <div className="metric-title">
                    平均客服消息数
                    <Tooltip title="每个会话中客服发送的平均消息数量">
                      <InfoCircleOutlined style={{ marginLeft: '8px', color: '#8c8c8c' }} />
                    </Tooltip>
                  </div>
                }
                value={Math.round(dashboardData.overview.avg_agentMessages * 10) / 10}
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title={
                  <div className="metric-title">
                    平均用户消息数
                    <Tooltip title="每个会话中用户发送的平均消息数量">
                      <InfoCircleOutlined style={{ marginLeft: '8px', color: '#8c8c8c' }} />
                    </Tooltip>
                  </div>
                }
                value={Math.round(dashboardData.overview.avg_userMessages * 10) / 10}
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800 }}
              />
            </Card>
          </Col>
        </Row>
      </section>
      
      <section className="dashboard-section" data-component-name="Dashboard">
        <h2 className="section-title">会话指标</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title={
                  <div className="metric-title">
                    客户平均满意度
                    <Tooltip title="客户对服务的满意程度评分">
                      <InfoCircleOutlined style={{ marginLeft: '8px', color: '#8c8c8c' }} />
                    </Tooltip>
                  </div>
                }
                value={Math.round(dashboardData.conversationMetrics.avg_satisfaction * 10) / 10} 
                suffix="/100"
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800, color: getColorByScore(dashboardData.conversationMetrics.avg_satisfaction) }}
              />
              <Progress 
                percent={dashboardData.conversationMetrics.avg_satisfaction} 
                showInfo={false} 
                strokeColor={getColorByScore(dashboardData.conversationMetrics.avg_satisfaction)}
                className="metric-progress"
              />
              <div className="metric-baseline">
                <span>基准线: 75</span>
                <span className="metric-trend">
                  {dashboardData.conversationMetrics.avg_satisfaction >= 75 ? '良好' : '需改进'}
                </span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title={
                  <div className="metric-title">
                    问题平均解决程度
                    <Tooltip title="客户问题被成功解决的程度">
                      <InfoCircleOutlined style={{ marginLeft: '8px', color: '#8c8c8c' }} />
                    </Tooltip>
                  </div>
                }
                value={Math.round(dashboardData.conversationMetrics.avg_resolution * 10) / 10} 
                suffix="/100"
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800, color: getColorByScore(dashboardData.conversationMetrics.avg_resolution) }}
              />
              <Progress 
                percent={dashboardData.conversationMetrics.avg_resolution} 
                showInfo={false} 
                strokeColor={getColorByScore(dashboardData.conversationMetrics.avg_resolution)}
                className="metric-progress"
              />
              <div className="metric-baseline">
                <span>基准线: 80</span>
                <span className="metric-trend">
                  {dashboardData.conversationMetrics.avg_resolution >= 80 ? '良好' : '需改进'}
                </span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title={
                  <div className="metric-title">
                    服务平均态度
                    <Tooltip title="客服服务态度的评分">
                      <InfoCircleOutlined style={{ marginLeft: '8px', color: '#8c8c8c' }} />
                    </Tooltip>
                  </div>
                }
                value={Math.round(dashboardData.conversationMetrics.avg_attitude * 10) / 10} 
                suffix="/100"
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800, color: getColorByScore(dashboardData.conversationMetrics.avg_attitude) }}
              />
              <Progress 
                percent={dashboardData.conversationMetrics.avg_attitude} 
                showInfo={false} 
                strokeColor={getColorByScore(dashboardData.conversationMetrics.avg_attitude)}
                className="metric-progress"
              />
              <div className="metric-baseline">
                <span>基准线: 85</span>
                <span className="metric-trend">
                  {dashboardData.conversationMetrics.avg_attitude >= 85 ? '良好' : '需改进'}
                </span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title={
                  <div className="metric-title">
                    会话平均安全程度
                    <Tooltip title="会话中的信息安全程度评分">
                      <InfoCircleOutlined style={{ marginLeft: '8px', color: '#8c8c8c' }} />
                    </Tooltip>
                  </div>
                }
                value={Math.round(dashboardData.conversationMetrics.avg_risk * 10) / 10} 
                suffix="/100"
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800, color: getColorByScore(dashboardData.conversationMetrics.avg_risk) }}
              />
              <Progress 
                percent={dashboardData.conversationMetrics.avg_risk} 
                showInfo={false} 
                strokeColor={getColorByScore(dashboardData.conversationMetrics.avg_risk)}
                className="metric-progress"
              />
              <div className="metric-baseline">
                <span>基准线: 90</span>
                <span className="metric-trend">
                  {dashboardData.conversationMetrics.avg_risk >= 90 ? '良好' : '需改进'}
                </span>
              </div>
            </Card>
          </Col>
        </Row>
      </section>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <section className="dashboard-section equal-height-section">
            <h2 className="section-title">热门标签</h2>
            <Card className="list-card equal-height-card">
              <List
                dataSource={dashboardData.Top_tags.slice(0, 10)}
                renderItem={(item, index) => (
                  <List.Item className="list-item">
                    <div className="list-item-content">
                      <span className="list-item-rank">{index + 1}</span>
                      <span className="list-item-name">{item._id}</span>
                      <div className="list-item-stats">
                        <span className="list-item-count">{item.count}</span>
                        <span className="list-item-percentage">
                          {Math.round(item.percentage)}%
                        </span>
                      </div>
                    </div>
                    <Progress 
                      percent={item.percentage} 
                      showInfo={false} 
                      strokeColor={{
                        '0%': '#1677ff',
                        '100%': index < 3 ? '#52c41a' : '#1677ff',
                      }}
                      className="list-item-progress"
                    />
                  </List.Item>
                )}
              />
            </Card>
          </section>
        </Col>
        
        <Col xs={24} md={12}>
          <section className="dashboard-section equal-height-section">
            <h2 className="section-title">热门关键词</h2>
            <Card className="list-card equal-height-card">
              <List
                dataSource={dashboardData.Top_hotwords.slice(0, 10)}
                renderItem={(item, index) => (
                  <List.Item className="list-item">
                    <div className="list-item-content">
                      <span className="list-item-rank">{index + 1}</span>
                      <span className="list-item-name">{item._id}</span>
                      <div className="list-item-stats">
                        <span className="list-item-count">{item.count}</span>
                        <span className="list-item-percentage">
                          {Math.round(item.percentage)}%
                        </span>
                      </div>
                    </div>
                    <Progress 
                      percent={item.percentage} 
                      showInfo={false} 
                      strokeColor={{
                        '0%': '#1677ff',
                        '100%': index < 3 ? '#52c41a' : '#1677ff',
                      }}
                      className="list-item-progress"
                    />
                  </List.Item>
                )}
              />
            </Card>
          </section>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="dashboard-row">
        <Col xs={24} lg={12}>
          <section className="dashboard-section">
            <h2 className="section-title">
              标签解决率分布
              <Tooltip title="展示不同标签的问题解决情况，包括已解决、部分解决和未解决的比例">
                <InfoCircleOutlined style={{ marginLeft: '8px', color: '#8c8c8c' }} />
              </Tooltip>
            </h2>
            <Card className="chart-card">
              {dashboardData.tag_resolution_rates && dashboardData.tag_resolution_rates.length > 0 ? (
                <div style={{ height: 400, overflow: 'auto' }}>
                  <Table
                    columns={[
                      {
                        title: '标签',
                        dataIndex: 'tag',
                        key: 'tag',
                        fixed: 'left',
                        render: (text) => (
                          <Tag 
                            color="#1677ff" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/tag-analysis/${encodeURIComponent(text)}`)}
                          >
                            {text}
                          </Tag>
                        ),
                        sorter: (a, b) => a.tag.localeCompare(b.tag)
                      },
                      {
                        title: '会话数量',
                        dataIndex: 'count',
                        key: 'count',
                        sorter: (a, b) => a.count - b.count,
                        render: (value) => (
                          <div style={{ textAlign: 'center', fontWeight: 600, color: '#1677ff' }}>
                            {value}
                          </div>
                        )
                      },
                      {
                        title: '已解决',
                        dataIndex: 'resolved',
                        key: 'resolved',
                        sorter: (a, b) => a.resolved - b.resolved,
                        render: (value) => (
                          <div>
                            <div style={{ width: '100%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                              <div 
                                style={{ 
                                  width: `${value}%`, 
                                  backgroundColor: '#52c41a', 
                                  height: '8px', 
                                  borderRadius: '4px' 
                                }} 
                              />
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '12px', color: '#595959' }}>
                              {Math.round(value)}%
                            </div>
                          </div>
                        )
                      },
                      {
                        title: '部分解决',
                        dataIndex: 'partially_resolved',
                        key: 'partially_resolved',
                        sorter: (a, b) => a.partially_resolved - b.partially_resolved,
                        render: (value) => (
                          <div>
                            <div style={{ width: '100%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                              <div 
                                style={{ 
                                  width: `${value}%`, 
                                  backgroundColor: '#faad14', 
                                  height: '8px', 
                                  borderRadius: '4px' 
                                }} 
                              />
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '12px', color: '#595959' }}>
                              {Math.round(value)}%
                            </div>
                          </div>
                        )
                      },
                      {
                        title: '未解决',
                        dataIndex: 'unresolved',
                        key: 'unresolved',
                        sorter: (a, b) => a.unresolved - b.unresolved,
                        render: (value) => (
                          <div>
                            <div style={{ width: '100%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                              <div 
                                style={{ 
                                  width: `${value}%`, 
                                  backgroundColor: '#ff4d4f', 
                                  height: '8px', 
                                  borderRadius: '4px' 
                                }} 
                              />
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '12px', color: '#595959' }}>
                              {Math.round(value)}%
                            </div>
                          </div>
                        )
                      }
                    ]}
                    dataSource={dashboardData.tag_resolution_rates.map((item: any, index: number) => ({
                      key: index,
                      tag: item.tag,
                      count: item.count,
                      resolved: item.resolved,
                      partially_resolved: item.partially_resolved,
                      unresolved: item.unresolved
                    }))}
                    pagination={{
                      current: tagPagination.current,
                      pageSize: tagPagination.pageSize,
                      total: dashboardData.tag_resolution_rates.length,
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '50', '100'],
                      showTotal: (total) => `共 ${total} 个标签`,
                      position: ['bottomRight'],
                      onChange: (page, pageSize) => {
                        setTagPagination({ current: page, pageSize });
                      },
                      onShowSizeChange: (current, size) => {
                        setTagPagination({ current: 1, pageSize: size });
                      }
                    }}
                    size="small"
                  />
                </div>
              ) : (
                <div className="no-data">暂无数据</div>
              )}
            </Card>
          </section>
        </Col>
        
        <Col xs={24} lg={12}>
          <section className="dashboard-section">
            <h2 className="section-title">
              标签共现网络
              <Tooltip title="展示哪些标签经常一起出现，反映问题之间的关联性">
                <InfoCircleOutlined style={{ marginLeft: '8px', color: '#8c8c8c' }} />
              </Tooltip>
            </h2>
            <Card className="chart-card">
              {dashboardData.tag_cooccurrence && dashboardData.tag_cooccurrence.length > 0 ? (
                <div style={{ height: 400, overflow: 'auto' }}>
                  <Table
                    columns={[
                      {
                        title: '标签对',
                        dataIndex: 'tagPair',
                        key: 'tagPair',
                        sorter: (a, b) => a.tagPair.localeCompare(b.tagPair),
                        render: (text) => {
                          const tags = text.split(' & ');
                          return (
                            <>
                              <Tag 
                                color="#1677ff"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/tag-analysis/${encodeURIComponent(tags[0])}`)}
                              >
                                {tags[0]}
                              </Tag>
                              <span style={{ margin: '0 4px' }}>&</span>
                              <Tag 
                                color="#69b1ff"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/tag-analysis/${encodeURIComponent(tags[1])}`)}
                              >
                                {tags[1]}
                              </Tag>
                            </>
                          );
                        }
                      },
                      {
                        title: '共现次数',
                        dataIndex: 'count',
                        key: 'count',
                        sorter: (a, b) => a.count - b.count,
                        render: (value, record: any) => (
                          <div>
                            <Progress 
                              percent={record.percentage} 
                              format={() => `${value}`}
                              strokeColor="#1677ff"
                              size="small"
                            />
                          </div>
                        )
                      },
                      {
                        title: '占比',
                        dataIndex: 'percentage',
                        key: 'percentage',
                        sorter: (a, b) => a.percentage - b.percentage,
                        render: (value) => (
                          <div style={{ textAlign: 'right', fontSize: '14px', color: '#595959' }}>
                            {Math.round(value)}%
                          </div>
                        )
                      }
                    ]}
                    dataSource={dashboardData.tag_cooccurrence.map((item: any, index: number) => {
                      // 确保tag_pair是数组且有两个元素
                      const tag1 = Array.isArray(item.tag_pair) && item.tag_pair.length > 0 ? item.tag_pair[0] : '未知';
                      const tag2 = Array.isArray(item.tag_pair) && item.tag_pair.length > 1 ? item.tag_pair[1] : '未知';
                      return {
                        key: index,
                        tagPair: `${tag1} & ${tag2}`,
                        count: item.count || 0,
                        percentage: item.percentage || 0
                      };
                    })}
                    pagination={false}
                    size="small"
                  />
                </div>
              ) : (
                <div className="no-data">暂无数据</div>
              )}
            </Card>
          </section>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} className="dashboard-row">
        <Col xs={24}>
          <section className="dashboard-section">
            <h2 className="section-title">
              客服表现分析
              <Tooltip title="展示各客服的服务表现，包括解决率、满意度和综合表现评分">
                <InfoCircleOutlined style={{ marginLeft: '8px', color: '#8c8c8c' }} />
              </Tooltip>
            </h2>
            <Card className="chart-card">
              {dashboardData.agent_service_rates && dashboardData.agent_service_rates.length > 0 ? (
                <div style={{ height: 400, overflow: 'auto' }}>
                  <Table
                    columns={[
                      {
                        title: '客服',
                        dataIndex: 'agent',
                        key: 'agent',
                        fixed: 'left',
                        sorter: (a, b) => a.agent.localeCompare(b.agent),
                        render: (text) => (
                          <div style={{ fontWeight: 600, color: '#1677ff' }}>
                            {text}
                          </div>
                        )
                      },
                      {
                        title: '处理会话数',
                        dataIndex: 'count',
                        key: 'count',
                        sorter: (a, b) => a.count - b.count,
                        render: (value) => (
                          <div style={{ textAlign: 'center', fontWeight: 600 }}>
                            {value}
                          </div>
                        )
                      },
                      {
                        title: '综合表现',
                        dataIndex: 'overall_performance',
                        key: 'overall_performance',
                        sorter: (a, b) => a.overall_performance - b.overall_performance,
                        render: (value) => (
                          <div>
                            <div style={{ width: '100%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                              <div 
                                style={{ 
                                  width: `${value}%`, 
                                  backgroundColor: getColorByScore(value), 
                                  height: '8px', 
                                  borderRadius: '4px' 
                                }} 
                              />
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 600, color: getColorByScore(value) }}>
                              {Math.round(value)}分
                            </div>
                          </div>
                        )
                      },
                      {
                        title: '已解决率',
                        dataIndex: 'resolved',
                        key: 'resolved',
                        sorter: (a, b) => a.resolved - b.resolved,
                        render: (value) => (
                          <div>
                            <div style={{ width: '100%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                              <div 
                                style={{ 
                                  width: `${value}%`, 
                                  backgroundColor: '#52c41a', 
                                  height: '8px', 
                                  borderRadius: '4px' 
                                }} 
                              />
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '12px', color: '#595959' }}>
                              {Math.round(value)}%
                            </div>
                          </div>
                        )
                      },
                      {
                        title: '部分解决率',
                        dataIndex: 'partially_resolved',
                        key: 'partially_resolved',
                        sorter: (a, b) => a.partially_resolved - b.partially_resolved,
                        render: (value) => (
                          <div>
                            <div style={{ width: '100%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                              <div 
                                style={{ 
                                  width: `${value}%`, 
                                  backgroundColor: '#faad14', 
                                  height: '8px', 
                                  borderRadius: '4px' 
                                }} 
                              />
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '12px', color: '#595959' }}>
                              {Math.round(value)}%
                            </div>
                          </div>
                        )
                      },
                      {
                        title: '未解决率',
                        dataIndex: 'unresolved',
                        key: 'unresolved',
                        sorter: (a, b) => a.unresolved - b.unresolved,
                        render: (value) => (
                          <div>
                            <div style={{ width: '100%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                              <div 
                                style={{ 
                                  width: `${value}%`, 
                                  backgroundColor: '#ff4d4f', 
                                  height: '8px', 
                                  borderRadius: '4px' 
                                }} 
                              />
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '12px', color: '#595959' }}>
                              {Math.round(value)}%
                            </div>
                          </div>
                        )
                      },
                      {
                        title: '满意度',
                        dataIndex: 'avg_satisfaction',
                        key: 'avg_satisfaction',
                        sorter: (a, b) => a.avg_satisfaction - b.avg_satisfaction,
                        render: (value) => (
                          <div style={{ textAlign: 'center', fontWeight: 600, color: getColorByScore(value) }}>
                            {Math.round(value)}
                          </div>
                        )
                      },
                      {
                        title: '解决度',
                        dataIndex: 'avg_resolution',
                        key: 'avg_resolution',
                        sorter: (a, b) => a.avg_resolution - b.avg_resolution,
                        render: (value) => (
                          <div style={{ textAlign: 'center', fontWeight: 600, color: getColorByScore(value) }}>
                            {Math.round(value)}
                          </div>
                        )
                      },
                      {
                        title: '服务态度',
                        dataIndex: 'avg_attitude',
                        key: 'avg_attitude',
                        sorter: (a, b) => a.avg_attitude - b.avg_attitude,
                        render: (value) => (
                          <div style={{ textAlign: 'center', fontWeight: 600, color: getColorByScore(value) }}>
                            {Math.round(value)}
                          </div>
                        )
                      },
                      {
                        title: '安全指数',
                        dataIndex: 'avg_risk',
                        key: 'avg_risk',
                        sorter: (a, b) => a.avg_risk - b.avg_risk,
                        render: (value) => (
                          <div style={{ textAlign: 'center', fontWeight: 600, color: getColorByScore(value) }}>
                            {Math.round(value)}
                          </div>
                        )
                      }
                    ]}
                    dataSource={dashboardData.agent_service_rates.map((item: any, index: number) => ({
                      key: index,
                      agent: item.agent,
                      count: item.count,
                      resolved: item.resolved,
                      partially_resolved: item.partially_resolved,
                      unresolved: item.unresolved,
                      avg_satisfaction: item.avg_satisfaction,
                      avg_resolution: item.avg_resolution,
                      avg_attitude: item.avg_attitude,
                      avg_risk: item.avg_risk,
                      overall_performance: item.overall_performance
                    }))}
                    pagination={false}
                    scroll={{ x: 1300 }}
                    size="small"
                  />
                </div>
              ) : (
                <div className="no-data">暂无数据</div>
              )}
            </Card>
          </section>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
