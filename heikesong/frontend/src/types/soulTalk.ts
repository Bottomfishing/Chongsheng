export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
}

export interface DigitalHuman {
  id: string;
  name: string;
  role: string;
  era: string;
  description: string;
  traits: string[];
  greeting: string;
  accent: string;
  accentSoft: string;
  symbol: string;
  /** 全身立绘，放在 public/characters/ 下 */
  portrait: string;
  /** 舞台循环动画，放在 public/characters/animations/ 下 */
  animation?: string;
  /** AI对话系统提示词 */
  systemPrompt?: string;
}

export interface SendMessagePayload {
  characterId: string;
  message: string;
  history: ChatMessage[];
}

export interface SoulTalkApi {
  sendMessage(payload: SendMessagePayload): Promise<string>;
}
