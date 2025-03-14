import React, { useState } from 'react';
import { Layout, Button, Drawer } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  MenuOutlined
} from '@ant-design/icons';
import './Navbar.css';

const { Header } = Layout;

const Navbar: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  // 判断当前路径是否匹配某个路由模式
  const isActive = (pathPattern: string): boolean => {
    if (pathPattern === '/conversations') {
      return location.pathname === '/conversations';
    } else if (pathPattern === '/dashboard') {
      return location.pathname === '/dashboard';
    } else if (pathPattern === '/tag-analysis') {
      return location.pathname === '/tag-analysis' || location.pathname.startsWith('/tag-analysis/');
    } else if (pathPattern === '/agents') {
      return location.pathname === '/agents';
    } else if (pathPattern === '/agent') {
      return location.pathname.startsWith('/agent/');
    }
    return false;
  };

  return (
    <Header className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <span className="logo-text">ConvoInsight</span>
        </div>
        
        {/* 桌面版导航 - 平铺靠左 */}
        <div className="desktop-menu">
          <nav className="nav-links">
            <NavLink 
              to="/conversations" 
              className={`nav-link ${isActive('/conversations') ? 'active' : ''}`}
            >
              会话列表
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              分析看板
            </NavLink>
            <NavLink 
              to={location.pathname.startsWith('/tag-analysis/') ? location.pathname : '/tag-analysis'} 
              className={`nav-link ${isActive('/tag-analysis') ? 'active' : ''}`}
            >
              标签分析
            </NavLink>
            <NavLink 
              to="/agents" 
              className={`nav-link ${isActive('/agents') || isActive('/agent') ? 'active' : ''}`}
            >
              客服分析
            </NavLink>
          </nav>
        </div>
        
        {/* 移动版导航按钮 */}
        <div className="mobile-menu">
          <Button 
            type="text" 
            icon={<MenuOutlined />} 
            onClick={() => setVisible(true)} 
            className="mobile-menu-button"
          />
        </div>
      </div>
      
      {/* 移动版抽屉菜单 */}
      <Drawer
        title="ConvoInsight 导航"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={250}
      >
        <nav className="drawer-nav-links">
          <NavLink 
            to="/conversations" 
            className={`drawer-nav-link ${isActive('/conversations') ? 'active' : ''}`}
            onClick={() => setVisible(false)}
          >
            会话列表
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={`drawer-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => setVisible(false)}
          >
            分析看板
          </NavLink>
          <NavLink 
            to={location.pathname.startsWith('/tag-analysis/') ? location.pathname : '/tag-analysis'} 
            className={`drawer-nav-link ${isActive('/tag-analysis') ? 'active' : ''}`}
            onClick={() => setVisible(false)}
          >
            标签分析
          </NavLink>
          <NavLink 
            to="/agents" 
            className={`drawer-nav-link ${isActive('/agents') || isActive('/agent') ? 'active' : ''}`}
            onClick={() => setVisible(false)}
          >
            客服分析
          </NavLink>
        </nav>
      </Drawer>
    </Header>
  );
};

export default Navbar;
