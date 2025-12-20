# AI修仙进化论 - AI 工具导航站

一个专为项目经理、产品经理、技术经理打造的 AI 工具导航站，助力职场进阶与能力进化。

## 🚀 部署与运行

本项目采用纯前端架构，无需后端，可直接部署在 GitHub Pages, Vercel 或 Netlify 上。

### 本地预览
由于使用了 TypeScript 和 ESM 模块，建议使用静态服务器查看：
1. `npx serve .` 
2. 或使用 VS Code 的 `Live Server` 插件。

## 🎨 资源管理

### 图标存放
- 请将图标文件放入 `./public/icons/`。
- 在 `constants.tsx` 中引用路径：`icon: './public/icons/filename.png'`。
- **注意**：GitHub Pages 区分文件名大小写，请务必保持一致。

## 🛠 维护建议
- **增加工具**：修改 `constants.tsx` 中的 `TOOLS_DATA`。
- **修改分类**：修改 `types.ts` 中的 `Role` 枚举。
- **开启会员功能**：
  - 目前会员入口（激活按钮）已默认隐藏。
  - 如需开启，请修改 `components/Navbar.tsx` 文件。
  - 搜索 `会员功能入口` 注释，将 `{false && ...}` 改为 `{true && ...}` 或直接移除包裹的判断条件即可。

---
Built with ❤️ for AI Evolution.
