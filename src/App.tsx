import React from 'react';
import { Layout, theme } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ConversationAnalysis from './components/ConversationAnalysis';
import ConversationList from './components/ConversationList';
import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Router>
      <Layout>
        <Content style={{ padding: '24px', minHeight: '100vh', background: colorBgContainer }}>
          <Routes>
            <Route path="/" element={<Navigate to="/conversations" />} />
            <Route path="/conversations" element={<ConversationList />} />
            <Route path="/conversation/:id" element={<ConversationAnalysis />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
