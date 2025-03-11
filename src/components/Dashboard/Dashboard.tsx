import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  // 这里是模拟数据，实际应用中应该从API获取
  const dashboardData = {
    totalConversations: 128,
    avgSatisfaction: 4.2,
    avgResolutionTime: 15, // 分钟
    agentPerformance: {
      avgResponseTime: 2.5, // 分钟
      resolutionRate: 92, // 百分比
      customerSatisfaction: 4.5, // 5分制
    },
    topIssues: [
      { name: "产品使用问题", count: 45 },
      { name: "账户问题", count: 32 },
      { name: "支付问题", count: 28 },
      { name: "技术故障", count: 15 },
      { name: "退款请求", count: 8 },
    ],
    // 其他数据...
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">会话分析看板</h1>
      
      <section className="dashboard-section">
        <h2 className="section-title">总体指标</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card className="metric-card">
              <Statistic 
                title="会话总数" 
                value={dashboardData.totalConversations} 
                valueStyle={{ fontSize: '56px', fontWeight: 800 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="metric-card">
              <Statistic 
                title="平均满意度" 
                value={dashboardData.avgSatisfaction} 
                suffix="/5"
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800, color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="metric-card">
              <Statistic 
                title="平均解决时间" 
                value={dashboardData.avgResolutionTime} 
                suffix="分钟"
                valueStyle={{ fontSize: '56px', fontWeight: 800 }}
              />
            </Card>
          </Col>
        </Row>
      </section>
      
      <section className="dashboard-section">
        <h2 className="section-title">客服表现</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card className="metric-card">
              <Statistic 
                title="平均响应时间" 
                value={dashboardData.agentPerformance.avgResponseTime} 
                suffix="分钟"
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="metric-card">
              <Statistic 
                title="问题解决率" 
                value={dashboardData.agentPerformance.resolutionRate} 
                suffix="%"
                valueStyle={{ fontSize: '56px', fontWeight: 800, color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="metric-card">
              <Statistic 
                title="客户满意度" 
                value={dashboardData.agentPerformance.customerSatisfaction} 
                suffix="/5"
                precision={1}
                valueStyle={{ fontSize: '56px', fontWeight: 800, color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
      </section>
      
      <section className="dashboard-section">
        <h2 className="section-title">热门问题</h2>
        <Card className="issues-card">
          <ul className="issues-list">
            {dashboardData.topIssues.map((issue, index) => (
              <li key={index} className="issue-item">
                <span className="issue-name">{issue.name}</span>
                <span className="issue-count">{issue.count}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
      
      <p className="disclaimer">此页面为初始版本，后续将添加更多图表和分析数据。</p>
    </div>
  );
};

export default Dashboard;
