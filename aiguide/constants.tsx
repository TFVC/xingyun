
import { Role, Tool } from './types';

/**
 * 💡 本地图标存放指南：
 * 1. 在项目根目录创建文件夹：public/icons/
 * 2. 将图标放入该文件夹（建议使用 png, svg 或 jpg）
 * 3. 引用路径请务必使用 '/icons/文件名' (此路径格式用于vercel部署)
 */
export const TOOLS_DATA: Tool[] = [
  {
    id: 'feishu',
    name: '飞书',
    description: '先进企业协作与管理平台，集成文档、即时通讯、日历、视频会议等多种功能。',
    url: 'https://www.feishu.cn/download',
    // 建议也将此图标下载到本地以防远程链接失效
    icon: '/icons/feishu.png',
    roles: [Role.TONGYONG],
    tag: '办公协同'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: '强大的国产大语言模型，具备卓越的代码编写、逻辑推理和文本生成能力。',
    url: 'https://www.deepseek.com/',
    // 已改为本地路径，请确保本地存在该文件
    icon: '/icons/deepseek.png', 
    roles: [Role.TONGYONG],
    tag: '大语言模型'
  },
  {
    id: 'doubao',
    name: '豆包',
    description: '字节跳动推出的智能 AI 助手，提供问答、辅助创作、学习提效等全方位支持。',
    url: 'https://www.doubao.com/chat/',
    // 已改为本地路径，请确保本地存在该文件
    icon: '/icons/doubao.png',
    roles: [Role.TONGYONG],
    tag: '智能助手'
  },
  {
    id: 'yuanbao',
    name: '元宝',
    description: '腾讯大模型，支持微信公众号文章、图片及各类文档解析，智能解答',
    url: 'https://yuanbao.tencent.com/',
    // 建议也将此图标下载到本地以防远程链接失效
    icon: '/icons/yuanbao.png',
    roles: [Role.TONGYONG],
    tag: '智能助手'
  }
];
