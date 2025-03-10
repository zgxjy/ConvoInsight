import React from 'react';
import { Typography } from 'antd';
import { headerStyle, titleStyle } from './styles';

const { Title, Text } = Typography;

interface HeaderSectionProps {
  title: string;
  subtitle: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ title, subtitle }) => {
  return (
    <div style={headerStyle}>
      <Title level={2} style={titleStyle}>{title}</Title>
      <Text type="secondary">{subtitle}</Text>
    </div>
  );
};

export default HeaderSection;
