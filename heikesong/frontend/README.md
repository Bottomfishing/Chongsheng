# 重生之我在抖音当顶流 — 前端

Vue 3 + Vite + TypeScript 单页应用，复古金霓虹视觉 + 剧情引擎 + 心灵倾述。

## 路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | `HomeView` | 封面 → 开场过场（老电视）→ 重生大厅 |
| `/play` | `PlayerView` | 剧情模式（`story.json` 驱动） |
| `/soul-talk` | `SoulTalkView` | 心灵倾述（四角色 AI 对话） |
| `/album` | `AlbumView` | 时光相册（当前为占位展示） |
| `/achievements` | `AchievementView` | 成就墙 |

## 主要功能

- **首页流程**：封面打字简介、读取存档、开场过场（砸电视可解锁成就）、重生大厅功能入口
- **剧情引擎**：`video` / `choice` / `ending` 节点；自动续播 + 多存档（`SaveLoadMenu`）
- **心灵倾述**：角色轮盘、舞台对话、日记区；API 失败时回退 mock
- **成就**：`localStorage` 存储（如砸电视、翻阅重生者手册）
- **设置**：复古底图浓度、扫描线、首页氛围动效（`utils/settings.ts`）

## 目录

```
src/
  views/          # 页面
  components/   # home / hub / soul-talk / engine 场景等
  engine/         # 剧情加载、跳转、存档
  services/       # soulTalkApi
  data/           # 数字人角色配置
  utils/          # 成就、设置、立绘路径等
public/
  story/story.json
  videos/         # 剧情 mp4
  images/         # 背景、边框等
  characters/     # 立绘与角色视频
```

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

## 剧情视频

`public/story/story.json` 当前引用（需自行放入 `public/videos/`）：

- `wake_up.mp4`
- `open_douyin.mp4`
- `check_calendar.mp4`

仓库内已有示例：`story-play-loop.mp4`（大厅剧情卡循环预览）等。

若视频缺失，`VideoScene` 会显示降级提示，仍可手动继续走完流程。

推荐编码：MP4 容器、H.264 视频、AAC 音频。

## 环境变量（建议）

心灵倾述与抖小音对话使用外部 API。建议在项目根目录配置 `.env.local`（勿提交 git）：

```env
VITE_SOUL_TALK_API_BASE=https://api.ltoken.shop/v1
VITE_SOUL_TALK_API_KEY=你的密钥
```

（若代码尚未接入 `import.meta.env`，仍以源码配置为准，迁移时请轮换已泄露密钥。）

## 角色名（大厅 / 倾述）

牛天真、李天佐、费启暗、阿宁（封面简介人物备注与上述设定一致）。

## 归档文档

早期 MVP 说明见上级目录 `heikesong/初始md/`（`PRD.md`、`architecture.md`、`planning.md`、`todo.md`），与现行功能相比已过时，仅供对照。
