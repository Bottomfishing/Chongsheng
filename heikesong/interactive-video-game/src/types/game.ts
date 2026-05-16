/** 单个选项 */
export interface Choice {
  id: string
  text: string           // 选项显示文本
  nextNodeId: string     // 选择后跳转的节点
  condition?: string     // 可选：前置条件表达式
}

/** 剧情节点（对应一段视频） */
export interface StoryNode {
  id: string
  videoSrc: string       // 视频文件路径
  title?: string         // 节点标题（调试用）
  choices: Choice[]      // 视频播完后弹出的选项
  triggerTime?: number   // 选项触发时间（秒），不填则播完触发
  isEnding?: boolean     // 是否为结局节点
}

/** 游戏存档 */
export interface GameSave {
  id: string
  timestamp: number
  currentNodeId: string
  history: string[]      // 已走过的节点ID列表
  choiceLog: Array<{ nodeId: string; choiceId: string }>
}

/** 剧情配置 */
export interface StoryConfig {
  title: string
  startNodeId: string
  nodes: StoryNode[]
}
