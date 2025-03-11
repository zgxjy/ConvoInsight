import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Progress, Spin } from 'antd';
import './Dashboard.css';
import { fetchDashboardData, DashboardData } from '../../services/api';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
                title="会话总数" 
                value={dashboardData.overview.totalConversations} 
                valueStyle={{ fontSize: '56px', fontWeight: 800, color: '#1677ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title="平均消息总数" 
                value={Math.round(dashboardData.overview.avg_totalMessages * 10) / 10}
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title="平均客服消息数" 
                value={Math.round(dashboardData.overview.avg_agentMessages * 10) / 10}
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title="平均用户消息数" 
                value={Math.round(dashboardData.overview.avg_userMessages * 10) / 10}
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800 }}
              />
            </Card>
          </Col>
        </Row>
      </section>
      
      <section className="dashboard-section">
        <h2 className="section-title">会话指标</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title="客户平均满意度" 
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
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title="问题平均解决程度" 
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
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title="服务平均态度" 
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
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic 
                title="会话平均安全程度" 
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
            </Card>
          </Col>
        </Row>
      </section>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <section className="dashboard-section">
            <h2 className="section-title">热门标签</h2>
            <Card className="list-card">
              <List
                dataSource={dashboardData.Top_tags.slice(0, 10)}
                renderItem={(item) => (
                  <List.Item className="list-item">
                    <div className="list-item-content">
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
                      strokeColor="#1677ff"
                      className="list-item-progress"
                    />
                  </List.Item>
                )}
              />
            </Card>
          </section>
        </Col>
        
        <Col xs={24} md={12}>
          <section className="dashboard-section">
            <h2 className="section-title">热门关键词</h2>
            <Card className="list-card">
              <List
                dataSource={dashboardData.Top_hotwords.slice(0, 10)}
                renderItem={(item) => (
                  <List.Item className="list-item">
                    <div className="list-item-content">
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
                      strokeColor="#1677ff"
                      className="list-item-progress"
                    />
                  </List.Item>
                )}
              />
            </Card>
          </section>
        </Col>
      </Row>
      
    </div>
  );
};

export default Dashboard;
