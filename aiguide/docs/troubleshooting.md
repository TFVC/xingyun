[经验记录] 解决Vercel部署时中文路径导致Logo不显示的问题

1. 问题现象
项目在本地开发环境（Localhost）下一切正常，Logo 能够正确显示。但在部署到 Vercel 后，工具 Logo 出现 404 无法加载 的情况，且控制台报错提示找不到资源文件。
项目原结构：仓库根目录/ai_ai修仙进化论/public/icons/logo.png
代码原引用方式：<img src="/public/icons/logo.png">（或类似路径）

2. 核心原因分析
A. 中文路径导致的 URL 编码异常
Vercel 部署在 Linux 环境中，且通过 CDN 分发资源。文件夹名包含中文（如 ai_ai修仙进化论）在构建或访问时会被强制进行 URL 编码（变成一长串类似 %E4%BF%AE... 的字符）。这种转义在不同的浏览器或服务器配置下极易导致路径解析失效。
B. Vercel 的静态资源映射机制
在 Vercel（及大多数前端框架）中，public 文件夹是一个特殊的目录：
部署后，public 文件夹本身会被“隐藏”。
public 目录下的所有文件会被直接映射到网站的 根路径。
错误：/public/icons/logo.png
正确：/icons/logo.png
C. 根目录（Root Directory）配置不匹配
如果项目代码不在 GitHub 仓库的根目录，而是在子文件夹中，Vercel 默认可能无法正确识别构建路径，导致它找不到 public 文件夹。

3. 解决方案
第一步：重命名文件夹（从中文改为英文）
第二步：修正代码中的资源路径
删除路径中的 /public 前缀。
改为<img src="/icons/logo.png" />

4. 避坑总结（经验教训）
工程化命名规范：项目中的文件夹、文件名应严格遵循 全英文、小写、单词间用中划线（-）或下划线（_）隔开 的原则，避免使用中文、空格或特殊字符。
绝对路径意识：在引用 public 下的资源时，始终以 / 开头，且不要包含 public 单词。
环境差异预案：始终意识到 Windows（不区分大小写、对中文友好）与 Linux 服务器（严格区分大小写、对非 ASCII 字符敏感）的环境差异。

记录日期：2025年12月20日
标签：#Vercel #Deployment #BugFix #Frontend
