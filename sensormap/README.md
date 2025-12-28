# 传感产业地图 (Sensor Industry Map)

这是一个基于 React + Vite + Tailwind CSS 开发的传感产业地图导航应用。

## 🚀 快速开始

1.  **安装依赖**
    ```bash
    npm install
    ```

2.  **启动开发服务器**
    ```bash
    npm run dev
    ```

3.  **构建生产版本**
    ```bash
    npm run build
    ```

## 🛠️ 内容维护指南

所有导航数据现在通过 Markdown 文件进行管理，并统一放在 **`src/markdown/`** 文件夹中。建议按「一级分类」拆分为多个 `.md` 文件，便于定位与维护。

当前加载规则：
- 会自动读取 `src/markdown/*.md` 下的所有文件
- 按文件名排序后拼接解析（建议用 `01_`、`02_` 这样的前缀控制顺序）

### 📂 Markdown 格式说明

#### 1. 一级分类 (Category)
使用一级标题 `#` 定义：
```markdown
# 分类名称 {id=unique-id}
```
*   `id`: 必填，分类的唯一标识符（例如 `application`）。

#### 2. 二级分类 (Subcategory)
使用二级标题 `##` 定义：
```markdown
## 子分类名称 {id=sub-unique-id}
```
*   `id`: 必填，子分类的唯一标识符。

#### 3. 导航卡片 (Item)
使用三级标题 `###` 定义卡片标题，并在标题后紧跟元数据：
```markdown
### 卡片标题 {icon=IconName}
> 简介第一行
> 简介第二行 (可选)
- Link: https://example.com  (如果是链接类型)
```
*   `icon`: 图标名称，参考 [Lucide Icons](https://lucide.dev/icons)。
*   `>` (引用): 用于编写卡片显示的简介文本。
*   `- Link: url`: 如果卡片是跳转链接，请添加此行。如果不添加，默认为弹窗类型。

#### 4. 弹窗详情内容
对于弹窗类型的卡片（即没有 `Link` 属性），卡片标题下方（元数据之后）直到下一个标题之前的所有内容，都会作为详情弹窗的内容显示。支持标准 Markdown 语法：

```markdown
### 示例卡片 {icon=Thermometer}
> 这是简介

# 详情标题

这里是详情内容...
- 列表项
- [链接](...)
```

### 📝 完整示例

```markdown
# 应用场景 {id=application}

## 机器人 {id=app-robot}

### 示例传感器 {icon=Thermometer}
> 专注于高精度温度传感器研发
> 提供工业级解决方案

# 示例传感器详情
这里是详细介绍内容...

### 百度 {icon=Globe}
> 全球最大的中文搜索引擎
- Link: https://www.baidu.com
```

---

## 目录结构

- `src/markdown/`: **数据源文件夹**（在此处维护分类和内容）
- `src/utils/parseData.ts`: Markdown 解析器逻辑
- `src/data.ts`: 数据导出入口
- `src/components/`: 组件目录
- `src/App.tsx`: 主页面布局和逻辑
