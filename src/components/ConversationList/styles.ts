import { CSSProperties } from 'react';

// Container styles
export const containerStyle: CSSProperties = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: 24,
  backgroundColor: '#fff',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
};

// Header styles
export const headerStyle: CSSProperties = {
  marginBottom: 24
};

export const titleStyle: CSSProperties = {
  marginBottom: 8
};

// Filter section styles
export const filterContainerStyle: CSSProperties = {
  marginBottom: 24,
  padding: 16,
  background: '#f5f5f5',
  borderRadius: 8,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  alignItems: 'flex-end'
};

export const filterItemStyle: CSSProperties = {
  minWidth: 200
};

export const filterLabelStyle: CSSProperties = {
  marginBottom: 4
};

export const filterButtonGroupStyle: CSSProperties = {
  display: 'flex',
  gap: 8
};

export const smallFilterItemStyle: CSSProperties = {
  minWidth: 120
};

// Table styles
export const tableRowStyle: CSSProperties = {
  cursor: 'pointer'
};

// Progress indicator styles
export const progressContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8
};

// Status tag colors
export const statusColors = {
  '已解决': 'green',
  '部分解决': 'orange',
  '未解决': 'red'
};

// Satisfaction score colors
export const getSatisfactionColor = (score: number): string => {
  if (score < 60) return '#ff4d4f'; // Error color
  if (score < 80) return '#faad14'; // Warning color
  return '#52c41a'; // Success color
};
