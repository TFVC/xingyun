
import { VibeFormData } from '../types';
import { REQUIREMENT_OPTIONS } from '../constants';

export const generateVibePrompt = (data: VibeFormData): string => {
  const { 
    siteName, brand, brandLink, hasMembership, memberFeatures, passwordRules, 
    requirements, language, colorTone, additionalFeatures 
  } = data;
  const isZh = language === 'zh';
  const isResponsive = requirements.includes('responsive-design');
  
  const selectedRequirements = requirements.map(id => {
    const opt = REQUIREMENT_OPTIONS.find(o => o.id === id);
    return opt ? (isZh ? opt.label.zh : opt.label.en) : null;
  }).filter(Boolean);

  const toneLabel = isZh 
    ? (colorTone === 'dark' ? '深色系 (Dark Mode)' : '浅色系 (Light Mode)')
    : (colorTone === 'dark' ? 'Dark Tone' : 'Light Tone');

  if (isZh) {
    let prompt = `## 请为我开发一个网站,实现高质量的Web体验,信息如下:\n\n`;
    prompt += `# 项目名称: ${siteName || '未命名项目'}\n`;
    prompt += `视觉风格：**${toneLabel}**。\n`;
    prompt += `核心原则：**Vibe Coding** —— 优先美学流动性、极简架构与直观交互。\n\n`;
    
    prompt += `## 🛠️ 项目基础信息\n`;
    prompt += `- **站点名称**: ${siteName}** 作为LOGO,出现在左上角\n`;
    prompt += `- **出品品牌/组织**: ${brand}** 出现LOGO下行小字,与LOGO左对齐\n`;
    prompt += `- **跳转品牌链接**: ${brandLink}** 点击“品牌”后跳转\n`;
    prompt += `- **终端支持**: ${isResponsive ? '全端适配 (PC/手机)' : '只需要兼容 PC 浏览'}\n`;
    prompt += `- **会员系统**: ${hasMembership ? '已启用' : '不涉及'}\n`;
    if (hasMembership) {
      prompt += `- **会员功能**: ${memberFeatures || '未指定功能'}\n`;
      prompt += `- **有会员登陆前后的状态显示'}\n`;
      prompt += `- **安全规则**: ${passwordRules || '标准安全策略'}\n`;
    }
    
    prompt += `\n## 🧩 功能定义\n`;
    if (additionalFeatures.trim()) {
      prompt += `${additionalFeatures}\n`;
    } else {
      prompt += `未提供详细功能描述。\n`;
    }

    if (selectedRequirements.length > 0) {
      prompt += `\n## ✨ 架构与交付要求\n`;
      selectedRequirements.forEach((label, idx) => {
        prompt += `${idx + 1}. **${label}**\n`;
      });
    }
    
    prompt += `\n## 🌈 编码风格指南\n`;
    prompt += `1. **自解释代码**: 变量与函数名必须具有明确的意图。\n`;
    prompt += `2. **现代技术栈**: 强制使用语义化 HTML 与 CSS 方法论。\n`;
    prompt += `3. **适配要求**: ${isResponsive ? '必须完美适配 PC 与手机浏览器。' : '该项目只需要兼容 PC 浏览，请针对桌面端大屏幕体验进行深度优化。'}\n`;
    prompt += `4. **零延迟感**: UI 反馈必须敏捷、流畅。\n`;
    
    prompt += `\n## 🎯 开发者指令\n`;
    prompt += `请基于以上架构设计进行开发。代码应展现出对细节的极致追求，并确保整体 "氛围" 的统一。立即开始。`;
    
    return prompt;
  } else {
    let prompt = `# Architectural Directive: ${siteName || 'Untitled Project'}\n\n`;
    
    prompt += `## 🚀 Vibe Overview\n`;
    prompt += `Building a high-end web experience for **${brand || 'Unnamed Brand'}** (${brandLink || 'No link'}).\n`;
    prompt += `Visual Direction: **${toneLabel}**.\n`;
    prompt += `Philosophy: **Vibe Coding** —— Aesthetic flow, minimal architecture, and intuitive logic.\n\n`;
    
    prompt += `## 🛠️ Core Context\n`;
    prompt += `- **Project Name**: ${siteName}\n`;
    prompt += `- **Organization**: ${brand}\n`;
    prompt += `- **Reference**: ${brandLink}\n`;
    prompt += `- **Platform Support**: ${isResponsive ? 'Multi-device (PC/Mobile)' : 'PC Browsing Only'}\n`;
    prompt += `- **Auth System**: ${hasMembership ? 'Enabled' : 'N/A'}\n`;
    if (hasMembership) {
      prompt += `- **Member Features**: ${memberFeatures || 'Not specified'}\n`;
      prompt += `- **Security Rules**: ${passwordRules || 'Standard secure practices'}\n`;
    }
    
    prompt += `\n## 🧩 Functional Scope\n`;
    if (additionalFeatures.trim()) {
      prompt += `${additionalFeatures}\n`;
    } else {
      prompt += `No detailed features provided.\n`;
    }

    if (selectedRequirements.length > 0) {
      prompt += `\n## ✨ Engineering Constraints\n`;
      selectedRequirements.forEach((label, idx) => {
        prompt += `${idx + 1}. **${label}**\n`;
      });
    }
    
    prompt += `\n## 🌈 Implementation Guide\n`;
    prompt += `1. **Intent-Driven**: Every line of code must be readable and purposeful.\n`;
    prompt += `2. **Modern Stack**: Use semantic HTML and modern CSS structures.\n`;
    prompt += `3. **Platform Focus**: ${isResponsive ? 'Flawless performance on both desktop and mobile platforms.' : 'This project only needs to support PC browsers. Focus on desktop screen optimization.'}\n`;
    prompt += `4. **Fluid UI**: Ensure interactions are snappy and natural.\n`;
    
    prompt += `\n## 🎯 Execution Directive\n`;
    prompt += `Proceed with development based on these specifications. Maintain consistency in the overall "Vibe" and prioritize code quality. Start now.`;
    
    return prompt;
  }
};
