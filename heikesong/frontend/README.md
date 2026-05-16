# 互动视频故事 MVP

这是根据当前目录中的 `PRD.md`、`architecture.md`、`planning.md`、`todo.md` 落地的 Vue 3 + Vite + TypeScript 最小可运行项目。

## 功能

- 首页 `/`
- 播放页 `/play`
- 基于 `public/story/story.json` 的故事脚本驱动
- `video` / `choice` / `ending` 三种节点
- `localStorage` 自动续播
- 结局页一键重开
- 视频文件缺失时的降级提示与手动继续

## 目录

- `src/engine/`: 故事引擎与存档
- `src/views/`: 页面视图
- `src/scenes/`: 场景组件
- `public/story/story.json`: 示例故事脚本
- `public/videos/`: 放置本地 mp4 文件

## 启动

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 视频素材说明

把以下文件放到 `public/videos/` 即可接上真实素材：

- `intro.mp4`
- `branch_a.mp4`
- `branch_b.mp4`

推荐编码格式：

- 容器：MP4
- 视频：H.264
- 音频：AAC

如果暂时没有视频文件，页面仍然可以通过降级占位继续走完整个交互流程，方便先验收逻辑。
