# 互动视频分支游戏 — 脚手架

基于 Vue3 + Vite + TypeScript 的最小可用互动视频游戏框架。

## 快速开始

```bash
npm install
npm run dev
```

## 项目结构

```
src/
  components/
    VideoPlayer.vue      # 视频播放 + 进度监听
    ChoiceOverlay.vue    # 选项弹层
    SaveLoadMenu.vue     # 存档/读档菜单
    GameUI.vue           # 游戏主界面
  stores/
    gameStore.ts         # Pinia 状态管理（节点跳转、存档）
  types/
    game.ts              # 类型定义
  config/
    story.json           # 剧情配置文件（核心！）
  App.vue                # 标题画面 + 游戏画面切换
```

## 如何配置剧情

编辑 `src/config/story.json`：

```json
{
  "title": "游戏标题",
  "startNodeId": "intro",
  "nodes": [
    {
      "id": "intro",
      "videoSrc": "/videos/intro.mp4",
      "triggerTime": 10,
      "choices": [
        { "id": "c1", "text": "选择A", "nextNodeId": "node_a" },
        { "id": "c2", "text": "选择B", "nextNodeId": "node_b" }
      ]
    }
  ]
}
```

字段说明：
- `triggerTime`: 视频播放到第几秒时弹出选项（不填则播完才弹）
- `isEnding`: 标记为结局节点，播完后显示"重新播放"
- `videoSrc`: 视频文件放在 `public/videos/` 目录下

## 添加视频资源

将视频文件放入 `public/videos/` 目录，然后在 `story.json` 中引用路径 `/videos/xxx.mp4`。

## 构建部署

```bash
npm run build
```

产物在 `dist/` 目录，可直接部署到任何静态服务器（Nginx / Vercel / GitHub Pages 等）。

## 存档机制

使用 localStorage 本地存储，最多保留 10 个存档。
