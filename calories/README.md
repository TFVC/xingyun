
# 卡路里 Terminal (Calories Terminal)

这是一个复古终端审美的励志静态网站。

## 🚀 特点
- **零外部请求**：完全依靠本地静态数据。
- **极致速度**：静态内容秒开，交互通过 React 状态管理。
- **Terminal 风格**：CRT 扫描线特效、打字机交互、绿色单色调审美。

## 🛠️ 如何更新内容

本网站的菜单名称和回复内容均存储在 `constants.ts` 文件中。

### 修改菜单与回复
1. 打开 `constants.ts` 文件。
2. 找到 `DIFFICULTIES` 数组。
3. 按以下格式修改或添加新的对象：

```typescript
{ 
  id: '唯一ID', 
  label: '显示在按钮上的文字', 
  command: '终端中显示的模拟命令', 
  localResponse: '点击后显示的励志话语' 
}
```

### 修改顶部 LOGO
修改 `constants.ts` 中的 `SYSTEM_ASCII` 字符串。可以使用 [ASCII Art Generator](https://patorjk.com/software/taag/) 生成新的文字艺术。

## 📦 技术栈
- **React**: UI 构建。
- **Tailwind CSS**: 样式定义。
- **Fira Code**: 编程风格字体。
