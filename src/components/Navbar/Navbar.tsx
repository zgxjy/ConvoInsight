import React from 'react';
import { Layout, Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const { Header } = Layout;

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <Header className="navbar">
      <div className="logo">ConvoInsight</div>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        className="nav-menu"
      >
        <Menu.Item key="/conversations">
          <NavLink to="/conversations">会话列表</NavLink>
        </Menu.Item>
        <Menu.Item key="/conversation">
          {/* 这个链接在没有具体会话ID时不会高亮，但保留在导航中 */}
          <NavLink to={location.pathname.startsWith('/conversation/') ? location.pathname : '/conversations'}>
            会话详情
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/dashboard">
          <NavLink to="/dashboard">分析看板</NavLink>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default Navbar;
