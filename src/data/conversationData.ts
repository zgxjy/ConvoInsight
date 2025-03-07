import { 
  ConversationData,
} from '../types/conversationTypes';

export const conversationData: ConversationData = {
  id: "#16480",
  time: "2025-03-06 16:43-17:09",
  agent: "沐沐",
  metrics: {
    satisfaction: { value: 85, trend: 5, status: "up" },
    resolution: { value: 75, trend: -15, status: "down" },
    attitude: { value: 95, trend: 0, status: "equal" },
    risk: { value: 20, trend: 8, status: "up" }
  },
  customerInfo: {
    userId: "827822984@qq.com",
    device: "Insta360 X4",
    history: "首次咨询"
  },
  summary: "用户咨询Insta360 X4视频误删除恢复问题，客服说明了删除情况下的处理方案，并建议用户使用第三方恢复软件。",
  conversationSummary: {
    mainIssue: "用户反映相机在室内拍摄太暗，室外拍摄曝光严重",
    resolutionStatus: {
      status: "部分解决",
      description: "提供了参数解释和教程链接"
    },
    mainSolution: "解释相机参数（EV、WB、ISO、快门速度）并分享夜景拍摄教程"
  },
  tags: ["数据恢复", "文件删除", "App操作"],
  messages: [
    { type: 'system', content: '系统：有新的咨询进来了。', time: '16:43' },
    { type: 'agent', content: '您好，感谢您联系影石Insta360，我是沐沐，很高兴为您服务！', time: '16:44', sender: '沐沐' },
    { type: 'user', content: '你好，我在你们ios app上编辑InstaX4 视频时，不小心误操作删除了视频，是通过360X4闪传助手连接iPhone 12 pro max ，内存卡是闪迪 512G extreme pro 。请问你们有方法帮我恢復这条视频吗？', time: '16:45', sender: '827822984@qq.com' },
    { type: 'agent', content: '抱歉给您造成的不便，如果您在相机中删除/格式化文件，是无法找回的，目前并不支持回收站的功能。\n\n如果您在App中删除文件，有以下两种情况：\n1. 相机一直连接着App，在App内编辑文件删除的话，相机内的文件也会被删除掉，无法找回。\n2. 相机连接App，将文件下载/导出到手机后，断开相机与App的连接，再进行编辑删除文件的话，在相机内是有文件备份的。\n另外，建议您下次在删除文件/格式化内存等操作前，先备份好文件哦~', time: '16:47', sender: '沐沐' },
    { type: 'agent', content: '辛苦您在相机内查看下是否还有素材的哦', time: '16:48', sender: '沐沐' },
    { type: 'user', content: '那你们有提供数据恢复的相关业务吗？', time: '16:49', sender: '827822984@qq.com' },
    { type: 'agent', content: '非常抱歉，沐沐非常遗憾听到这个消息，目前官方暂时无法为您协助已经删除的内存卡文件，但是您可以自行在百度或其他平台搜索下，看是否有第三方的恢复软件可以协助您进行文件恢复的', time: '16:50', sender: '沐沐' },
    { type: 'user', content: '好吧', time: '16:51', sender: '827822984@qq.com' },
    { type: 'agent', content: '嗯嗯，关于您反馈的app等文件备份的问题，我们也会去反馈给相关部门进行评估的，同时也温馨提醒您，后续可以及时备份下文件，避免文件丢失的', time: '16:52', sender: '沐沐' },
    { type: 'agent', content: '请问还有其他可以帮到您的吗？', time: '17:00', sender: '沐沐' },
    { type: 'system', content: '系统发送满意度调查', time: '17:05' }
  ],
  improvementSuggestions: [
    "建议提供更详细的文件恢复指导",
    "可以增加预防性提醒",
    "考虑添加自动备份功能建议"
  ],
  interactionAnalysis: {
    totalMessages: 8,
    agentMessages: 5,
    userMessages: 3
  },
  hotWords: ['InstaX4', '文件恢复', '第三方软件']
};
