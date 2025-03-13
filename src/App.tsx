import React from 'react';
import { Layout, theme } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ConversationAnalysis from './components/ConversationAnalysis';
import ConversationList from './components/ConversationList';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TagAnalysis from './components/TagAnalysis/TagAnalysis';
import AgentAnalysis from './components/AgentAnalysis/AgentAnalysis';
import AgentList from './components/AgentAnalysis/AgentList';
import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Router>
      <Layout className="app-layout">
        <Navbar />
        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)', background: colorBgContainer }}>
          <Routes>
            <Route path="/" element={<Navigate to="/conversations" />} />
            <Route path="/conversations" element={<ConversationList />} />
            <Route path="/conversation/:id" element={<ConversationAnalysis />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tag-analysis/:tagName" element={<TagAnalysis />} />
            <Route path="/agent/:agentName" element={<AgentAnalysis />} />
            <Route path="/agents" element={<AgentList />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
