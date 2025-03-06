import { ConversationData } from '../types/conversationTypes';
import { conversationData } from './conversationData';

// 模拟多个会话数据
export const conversationsData: ConversationData[] = [
  conversationData,
  {
    ...conversationData,
    id: "#16481",
    time: "2025-03-05 14:22-14:45",
    agent: "小林",
    tags: ["相机设置", "曝光问题", "参数调整"],
    conversationSummary: {
      mainIssue: "用户反映相机在不同光线条件下拍摄效果不佳",
      resolutionStatus: {
        status: "已解决",
        description: "提供了详细的参数设置指导"
      },
      mainSolution: "指导用户调整ISO、快门速度和EV值，并分享了专业拍摄技巧"
    }
  },
  {
    ...conversationData,
    id: "#16482",
    time: "2025-03-04 09:15-09:40",
    agent: "阿强",
    tags: ["连接问题", "App故障", "固件更新"],
    conversationSummary: {
      mainIssue: "用户无法将相机连接到手机App",
      resolutionStatus: {
        status: "已解决",
        description: "通过更新固件解决了连接问题"
      },
      mainSolution: "指导用户更新相机固件和App版本，并重新配对设备"
    }
  }
];

// 根据ID查找会话
export const findConversationById = (id: string): ConversationData => {
  const conversation = conversationsData.find(conv => conv.id === id);
  return conversation || conversationData;
};
