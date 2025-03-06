import React from 'react';
import { Layout, theme } from 'antd';
import ConversationAnalysis from './components/ConversationAnalysis';
import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Content style={{ padding: '24px', minHeight: '100vh', background: colorBgContainer }}>
        <ConversationAnalysis />
      </Content>
    </Layout>
  );
};

export default App;
