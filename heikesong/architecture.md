# Web剧情动画（互动剧情）MVP — Architecture

## 1. 总体
- 形态：纯前端 SPA（无后端）
- 技术栈：Vue 3 + Vite + TypeScript（推荐）
- 运行环境：PC 浏览器
- 资源：本地视频文件随前端构建一起发布（放在 `public/videos/`）

## 2. 路由与页面
- `/` HomeView
  - 标题/封面（可选）
  - 按钮：开始游戏
  - 如果检测到本地有进度：显示“继续游戏 / 重新开始”（推荐）

- `/play` PlayerView（游戏容器页）
  - 根据当前剧情节点（nodeId）渲染不同场景组件

## 3. 剧情脚本（Story Script）
- 存放：`public/story/story.json`（或 `src/story/story.json` 打包进 bundle 也可）
- 结构：
  - `startNodeId`: string
  - `nodes`: Record<string, Node>

Node 类型（MVP 只做三种）：
- VideoNode
  - `type: "video"`
  - `src: string`（例如 `/videos/intro.mp4`）
  - `next: string`
- ChoiceNode
  - `type: "choice"`
  - `prompt: string`（本期要求：必须显示文字）
  - `options: [{ id: "A"|"B", label: string, next: string }]`
- EndingNode
  - `type: "ending"`
  - `title: string`（本期要求：必须显示文字）
  - `text: string`（本期要求：必须显示文字）

## 4. 运行时状态（Runtime State）
- `nodeId: string` 当前节点
- `choiceLog: Record<string, "A"|"B">`（MVP 记录一次选择即可，但结构支持扩展）
- `updatedAt: number`

持久化：localStorage
- key：`interactive_story_runtime_v1`
- 写入时机：每次 `goto(nodeId)` 或 `commitChoice()` 之后
- 恢复时机：进入 `/play` 时

恢复策略：
- localStorage 有 nodeId 且 story.json 中存在该节点 -> 恢复
- 否则 -> 回到 startNodeId

## 5. 引擎（Story Engine）
核心 API（前端模块）：
- `loadStory()` 读取并校验 story.json
- `goto(nodeId)` 切换节点并持久化
- `commitChoice(choiceNodeId, optionId)` 记录选择并跳转 option.next
- `reset()` 清空存档并回到 startNodeId

## 6. 场景组件（Scenes）
- `VideoScene`
  - `<video controls>`（MVP 允许 controls，后续可关掉自己做UI）
  - 监听 `ended` 事件 -> `goto(next)`

- `ChoiceScene`
  - 显示 prompt（本期要求：必须显示文字）
  - 两个按钮 A/B -> `commitChoice()`

- `EndingScene`
  - 显示 title/text（本期要求：必须显示文字）
  - 按钮：返回主页、重新开始

## 7. 目录结构（建议）
- `frontend/`
  - `src/engine/`（剧情引擎、类型定义、持久化）
  - `src/views/`（HomeView, PlayerView）
  - `src/scenes/`（VideoScene, ChoiceScene, EndingScene）
  - `public/videos/`（视频素材）
  - `public/story/story.json`
- `docs/`（PRD、架构、todo）

## 8. 风险与约束
- 本地视频体积大：构建/发布体积会上升，建议用较合理码率与分辨率
- 浏览器视频编码兼容：优先 mp4(H.264 + AAC)
- 若未来要“无controls + 自定义UI/全屏/预加载”，需要额外处理
