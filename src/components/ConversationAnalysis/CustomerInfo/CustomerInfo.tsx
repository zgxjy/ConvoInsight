import React from 'react';
import { styles } from '../styles';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';

interface CustomerInfoProps {
  userId: string;
  device: string;
  history: string;
}

/**
 * 客户信息组件
 * 展示客户的基本信息，如用户ID、设备型号和联系历史
 */
const CustomerInfo: React.FC<CustomerInfoProps> = ({ userId, device, history }) => {
  return (
    <Card>
      <SectionTitle title="客户信息" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: styles.spacing.sm }}>
        <div>
          <div style={{ fontSize: styles.typography.small.fontSize, color: styles.colors.text.tertiary }}>用户ID</div>
          <div style={{ fontWeight: styles.typography.body.fontWeight }}>{userId}</div>
        </div>
        <div>
          <div style={{ fontSize: styles.typography.small.fontSize, color: styles.colors.text.tertiary }}>设备型号</div>
          <div style={{ fontWeight: styles.typography.body.fontWeight }}>{device}</div>
        </div>
        <div>
          <div style={{ fontSize: styles.typography.small.fontSize, color: styles.colors.text.tertiary }}>联系历史</div>
          <div style={{ fontWeight: styles.typography.body.fontWeight }}>{history}</div>
        </div>
      </div>
    </Card>
  );
};

export default CustomerInfo;
