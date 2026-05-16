# Web剧情动画（互动剧情）MVP — Implementation Plan

> **For Hermes:** 进入实现阶段时，严格按任务拆分逐项完成；每个任务结束都要能本地跑通并验证。

**Goal:** 用 Vue3 + Vite 做一个脚本驱动的互动剧情网页（主页→视频→一次A/B→分支视频→结尾），并用 localStorage 自动存档恢复。

**Architecture:** 单页应用（SPA），`/` 主页，`/play` 作为剧情容器；读取 `public/story/story.json`，根据 node.type 渲染 VideoScene / ChoiceScene / EndingScene。

**Tech Stack:** Vue3, Vite, TypeScript, Vue Router

---

## 0. 前置约定
- 项目目录：`/home/hermes/interactive-story-web/frontend`
- 视频资源目录：`frontend/public/videos/`
- 剧情脚本：`frontend/public/story/story.json`
- localStorage key：`interactive_story_runtime_v1`

默认示例视频文件名（你说我随便定）：
- `intro.mp4`
- `branch_a.mp4`
- `branch_b.mp4`

> 你后续把你的真实视频文件替换成这些文件名即可，或我再帮你改 story.json。

---

## Task 1: 初始化 Vue3 + Vite + TS 项目骨架

**Objective:** 创建可运行的前端项目，并能启动开发服务器。

**Files:**
- Create: `frontend/`（Vite 创建）

**Steps:**
1) 创建项目
2) 安装依赖
3) `npm run dev` 启动并访问页面

**Verify:**
- 终端无报错
- 浏览器能打开 Vite 首页

---

## Task 2: 引入 Vue Router 并建立两条路由

**Objective:** 建立 `/`（主页）和 `/play`（剧情容器页）。

**Files:**
- Create: `src/router/index.ts`
- Modify: `src/main.ts`
- Create: `src/views/HomeView.vue`
- Create: `src/views/PlayerView.vue`

**Verify:**
- `/` 能显示“开始游戏”按钮
- `/play` 能显示一个占位文字（例如“PlayerView”）

---

## Task 3: 定义剧情脚本 story.json（最小可跑通）

**Objective:** 写出一份最小剧情脚本，能表达：intro→choice→A/B→ending。

**Files:**
- Create: `public/story/story.json`

**Example content:**
- startNodeId: `video_intro`
- nodes:
  - `video_intro` (video -> next `choice_1`)
  - `choice_1` (choice A/B -> `video_a`/`video_b`)
  - `video_a` (video -> next `ending_a`)
  - `video_b` (video -> next `ending_b`)
  - `ending_a` / `ending_b` (ending)

**Verify:**
- 能在浏览器 Network 中看到成功加载 `/story/story.json`

---

## Task 4: 实现 StoryEngine（加载脚本 + 跳转 + 持久化）

**Objective:** 实现最小引擎：loadStory、goto、commitChoice、reset、restore。

**Files:**
- Create: `src/engine/types.ts`
- Create: `src/engine/storage.ts`
- Create: `src/engine/story.ts`

**Verify:**
- 刷新页面时能从 localStorage 恢复 nodeId
- story.json 缺失节点时能回退到 startNodeId

---

## Task 5: VideoScene（播放 + ended 自动 next）

**Objective:** 渲染 video 节点并在结束时自动进入 next。

**Files:**
- Create: `src/scenes/VideoScene.vue`

**Verify:**
- 播放 `intro.mp4` 结束后自动进入 choice

---

## Task 6: ChoiceScene（显示文字 + A/B 两按钮）

**Objective:** 渲染 choice 节点，显示 prompt 文案，并能点 A/B。

**Files:**
- Create: `src/scenes/ChoiceScene.vue`

**Verify:**
- 看到 prompt 文本
- 点击 A/B 后进入对应分支视频

---

## Task 7: EndingScene（显示文字 + 返回/重开）

**Objective:** 渲染 ending 节点，显示 title/text，并提供按钮。

**Files:**
- Create: `src/scenes/EndingScene.vue`

**Verify:**
- 结尾页能看到文字
- “重新开始”会清空存档并回到 intro

---

## Task 8: PlayerView 组合引擎与场景渲染

**Objective:** PlayerView 能根据 node.type 切换场景组件，并处理引擎事件。

**Files:**
- Modify: `src/views/PlayerView.vue`

**Verify:**
- 走通：主页→intro→choice→分支→ending

---

## Task 9: HomeView 增强（继续/重开）

**Objective:** 主页若检测到存在存档，提供“继续游戏”。

**Files:**
- Modify: `src/views/HomeView.vue`

**Verify:**
- 刷新后回到主页，能继续到上次 nodeId

---

## Task 10: 最终验收与交付说明

**Objective:** 输出 README 运行说明，并做一次完整验收。

**Files:**
- Create: `frontend/README.md`

**Verify:**
- `npm run dev` 可运行
- `npm run build` 成功
- `npm run preview` 可预览
