export type OptionId = "A" | "B" | string;

export interface VideoNode {
  type: "video";
  src: string;
  next: string;
  title?: string;
  description?: string;
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

export type StoryNode = VideoNode | ChoiceNode | EndingNode;

export interface StoryDefinition {
  startNodeId: string;
  nodes: Record<string, StoryNode>;
}

export interface RuntimeState {
  nodeId: string;
  choiceLog: Record<string, OptionId>;
  updatedAt: number;
}
