# 重生之我在抖音当顶流（Chongsheng）

1995 复古霓虹风格的互动叙事 Web 应用：封面过场、重生大厅、剧情模式、心灵倾述、时光相册与成就墙。

## 项目结构

| 路径 | 说明 |
|------|------|
| `heikesong/frontend/` | Vue 3 + Vite + TypeScript 前端（主应用） |
| `heikesong/初始md/` | 早期 PRD / 架构 / 规划文档（归档参考） |

## 快速开始

```bash
cd heikesong/frontend
npm install
npm run dev
```

浏览器访问开发服务器地址（通常为 `http://localhost:5173`）。

构建与预览：

```bash
npm run build
npm run preview
```

更详细的目录说明、路由与素材约定见 [heikesong/frontend/README.md](heikesong/frontend/README.md)。

## 技术说明

- 纯前端 SPA，无独立后端；剧情与存档使用 `localStorage`
- 心灵倾述 / 抖小音对话依赖第三方 API（密钥应通过环境变量配置，勿提交仓库）
