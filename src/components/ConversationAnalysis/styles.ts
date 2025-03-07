// 设计系统变量
export const styles = {
  // 颜色系统
  colors: {
    // 保持原有的基础颜色引用
    primary: '#1677ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    // 扩展颜色状态 - 不影响现有引用
    primaryState: {
      hover: '#4096ff',
      active: '#0958d9',
      disabled: 'rgba(22, 119, 255, 0.5)',
    },
    successState: {
      hover: '#73d13d',
      active: '#389e0d',
      disabled: 'rgba(82, 196, 26, 0.5)',
    },
    warningState: {
      hover: '#ffc53d',
      active: '#d48806',
      disabled: 'rgba(250, 173, 20, 0.5)',
    },
    errorState: {
      hover: '#ff7875',
      active: '#d9363e',
      disabled: 'rgba(255, 77, 79, 0.5)',
    },
    text: {
      primary: '#1f1f1f',
      secondary: '#595959',
      tertiary: '#8c8c8c',
      contrast: '#ffffff', // 新增对比色
    },
    background: {
      light: '#ffffff',
      grey: '#f5f5f5',
      dark: '#141414', // 新增深色背景
      primaryLight: 'rgba(22, 119, 255, 0.1)',
      successLight: 'rgba(82, 196, 26, 0.1)',
      warningLight: 'rgba(250, 173, 20, 0.1)',
      errorLight: 'rgba(255, 77, 79, 0.1)',
    },
    border: '#d9d9d9', // 保持原有引用
    // 扩展边框颜色 - 不影响现有引用
    borderState: {
      light: '#f0f0f0',
      dark: '#8c8c8c',
    },
  },
  // 间距系统 - 保持原有命名
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
    none: 'none', // 新增无阴影选项
  },
  // 圆角系统
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    pill: '9999px', // 新增胶囊形状
  },
  // 字体系统 - 保持原有像素单位，增加行高
  typography: {
    h1: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.4, // 新增行高
    },
    h2: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.4, // 新增行高
    },
    h3: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.5, // 新增行高
    },
    body: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5, // 新增行高
    },
    small: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.5, // 新增行高
    },
    micro: {
      fontSize: '10px',
      fontWeight: 400,
      lineHeight: 1.5, // 新增行高
    },
  },
  // 卡片样式 - 保持原有引用
  card: {
    padding: '16px',
    borderRadius: '8px',
    background: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  // 新增过渡效果系统
  transition: {
    duration: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s',
    },
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
      decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },
  // 新增层级系统
  zIndex: {
    dropdown: 100,
    sticky: 200,
    modal: 1000,
    tooltip: 1500,
  },
  // 新增响应式断点
  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1600px',
  },
  // 新增组件样式 - 不影响现有引用
  components: {
    button: {
      borderRadius: '4px',
      padding: '8px 16px',
      transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    tag: {
      borderRadius: '16px',
      padding: '2px 8px',
    },
  },
};

// 类型定义，提供代码提示
export type ColorState = {
  hover: string;
  active: string;
  disabled: string;
};

export type TextColors = {
  primary: string;
  secondary: string;
  tertiary: string;
  contrast: string;
};

export type DesignSystem = typeof styles;
