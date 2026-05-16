# Web剧情动画（互动剧情）MVP — Todo

## 阶段1：规划确认
- [x] 收集需求
- [x] 输出 PRD 草案
- [x] 输出架构草案
- [x] 输出 todo 草案
- [ ] 等待你确认后进入实现阶段

## 阶段2：实现
- [ ] 初始化 Vue3 + Vite + TypeScript 项目
- [ ] 创建基础路由：`/` 与 `/play`
- [ ] 定义剧情脚本 `story.json`
- [ ] 实现剧情引擎（load / goto / commitChoice / reset）
- [ ] 实现首页 HomeView
- [ ] 实现视频场景 VideoScene
- [ ] 实现选择场景 ChoiceScene
- [ ] 实现结尾场景 EndingScene
- [ ] 接入 localStorage 自动存档与恢复
- [ ] 添加基础样式（PC 优先）

## 阶段3：测试
- [ ] 完整走通主流程：主页 → 视频 → A/B → 对应分支 → 结尾
- [ ] 验证刷新 `/play` 后能恢复进度
- [ ] 验证本地视频资源可正常加载

## 阶段4：交付
- [ ] 整理运行方式与项目说明
- [ ] 给出后续可扩展方向（多分支、多结局、对白、立绘等）
