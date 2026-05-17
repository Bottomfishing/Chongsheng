export type OptionId = "A" | "B" | string;

export interface VideoSubtitle {
  time: number;
  text: string;
  duration?: number;
}

export interface VideoNode {
  type: "video";
  src: string;
  next: string;
  title?: string;
  description?: string;
  triggerTime?: number;
  subtitles?: VideoSubtitle[];
  holdOnEnd?: boolean;
  lotteryAt?: number;
  pauseAt?: number;
  pauseLabel?: string;
  pauseAction?: string;
  pauseResume?: boolean;
  pauseChoices?: ChoiceOption[];
}

export interface NarrationNode {
  type: "narration";
  title: string;
  text: string;
  next: string;
}

export interface ChoiceOption {
  id: OptionId;
  label: string;
  next: string;
}

export interface ChoiceNode {
  type: "choice";
  prompt: string;
  options: ChoiceOption[];
}

export interface EndingNode {
  type: "ending";
  title: string;
  text: string;
}

export type StoryNode = VideoNode | NarrationNode | ChoiceNode | EndingNode;

export interface StoryDefinition {
  startNodeId: string;
  nodes: Record<string, StoryNode>;
}

export interface RuntimeState {
  nodeId: string;
  choiceLog: Record<string, OptionId>;
  updatedAt: number;
}
