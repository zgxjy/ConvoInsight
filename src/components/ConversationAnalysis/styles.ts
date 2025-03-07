// 设计系统变量
export const styles = {
  // 颜色系统
  colors: {
    primary: '#1677ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    text: {
      primary: '#1f1f1f',
      secondary: '#595959',
      tertiary: '#8c8c8c',
    },
    background: {
      light: '#ffffff',
      grey: '#f5f5f5',
      primaryLight: 'rgba(22, 119, 255, 0.1)',
      successLight: 'rgba(82, 196, 26, 0.1)',
      warningLight: 'rgba(250, 173, 20, 0.1)',
      errorLight: 'rgba(255, 77, 79, 0.1)',
    },
    border: '#d9d9d9',
  },
  // 间距系统
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  // 阴影系统
  shadows: {
    primary: '0 2px 8px rgba(0,0,0,0.08)',
    hover: '0 4px 12px rgba(0,0,0,0.12)',
  },
  // 圆角系统
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
  // 字体系统
  typography: {
    h1: {
      fontSize: '24px',
      fontWeight: 600,
    },
    h2: {
      fontSize: '20px',
      fontWeight: 600,
    },
    h3: {
      fontSize: '16px',
      fontWeight: 600,
    },
    body: {
      fontSize: '14px',
      fontWeight: 400,
    },
    small: {
      fontSize: '12px',
      fontWeight: 400,
    },
    micro: {
      fontSize: '10px',
      fontWeight: 400,
    },
  },
  // 卡片样式
  card: {
    padding: '16px',
    borderRadius: '8px',
    background: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
};
