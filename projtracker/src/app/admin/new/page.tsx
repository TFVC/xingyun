"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function AdminNewPage() {
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    author: "Team",
    type: "bi-weekly",
    tags: "",
    content: "",
  });

  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    const tagsArray = formData.tags
      .split(/[,，]/) // Support both English and Chinese commas
      .map((t) => `"${t.trim()}"`)
      .filter(t => t !== '""')
      .join(", ");

    return `---
title: "${formData.title}"
date: "${formData.date}"
author: "${formData.author}"
type: "${formData.type}"
tags: [${tagsArray}]
---

${formData.content}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen swiss-grid p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl font-bold uppercase mb-8 border-b-4 border-primary pb-2 inline-block">
          新进展发布生成器
        </h1>

        <div className="space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1">标题 (Title)</label>
              <input
                type="text"
                className="w-full border-2 border-muted p-2 focus:border-primary outline-none transition-colors"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="例如：第三周进展：UI优化完成"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1">日期 (Date)</label>
              <input
                type="date"
                className="w-full border-2 border-muted p-2 focus:border-primary outline-none transition-colors"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1">作者 (Author)</label>
              <input
                type="text"
                className="w-full border-2 border-muted p-2 focus:border-primary outline-none transition-colors"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="例如：张三"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1">类型 (Type)</label>
              <select
                className="w-full border-2 border-muted p-2 focus:border-primary outline-none transition-colors bg-white"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="bi-weekly">双周进展 (Bi-weekly)</option>
                <option value="release">版本发布 (Release)</option>
                <option value="announcement">重要公告 (Announcement)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1">标签 (Tags) - 逗号分隔</label>
            <input
              type="text"
              className="w-full border-2 border-muted p-2 focus:border-primary outline-none transition-colors"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="例如：前端, API, 修复"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1">正文内容 (Markdown 格式)</label>
            <textarea
              className="w-full border-2 border-muted p-2 h-40 font-mono text-sm focus:border-primary outline-none transition-colors resize-none"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="在此输入详细进展..."
            />
          </div>

          {/* Preview & Action */}
          <div className="pt-6 border-t-2 border-muted">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-widest">生成的 Markdown 内容</label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "已复制!" : "复制到剪贴板"}
              </button>
            </div>
            <pre className="bg-muted p-4 text-xs font-mono overflow-auto border border-border h-48 select-all">
              {generateMarkdown()}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              提示: 复制上方内容，在 <code className="bg-muted px-1">content/updates/</code> 目录下新建文件 <code className="bg-muted px-1">YYYY-MM-DD-标题.md</code> 并粘贴。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
