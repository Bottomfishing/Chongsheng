import { clearRuntimeState, loadRuntimeState, saveRuntimeState } from "./storage";
import type { ChoiceNode, RuntimeState, StoryDefinition, StoryNode } from "./types";
import { assetPath } from "@/utils/asset";

function createState(nodeId: string, choiceLog: RuntimeState["choiceLog"] = {}): RuntimeState {
  return {
    nodeId,
    choiceLog,
    updatedAt: Date.now(),
  };
}

export class StoryEngine {
  private constructor(
    private readonly story: StoryDefinition,
    private state: RuntimeState,
  ) {}

  static async load(resumeState?: RuntimeState): Promise<StoryEngine> {
    const response = await fetch(assetPath("story/story.json"), { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load story: ${response.status}`);
    }

    const story = (await response.json()) as StoryDefinition;
    StoryEngine.assertStory(story);

    let state: RuntimeState;
    if (resumeState && story.nodes[resumeState.nodeId]) {
      state = createState(resumeState.nodeId, resumeState.choiceLog);
    } else {
      const restoredState = loadRuntimeState();
      state =
        restoredState && story.nodes[restoredState.nodeId]
          ? createState(restoredState.nodeId, restoredState.choiceLog)
          : createState(story.startNodeId);
    }

    saveRuntimeState(state);
    return new StoryEngine(story, state);
  }

  getCurrentNodeId() {
    return this.state.nodeId;
  }

  getCurrentNode(): StoryNode {
    return this.getNode(this.state.nodeId);
  }

  getState(): RuntimeState {
    return { ...this.state, choiceLog: { ...this.state.choiceLog } };
  }

  getStartNodeId() {
    return this.story.startNodeId;
  }

  getNodeById(nodeId: string): StoryNode | null {
    return this.story.nodes[nodeId] ?? null;
  }

  goto(nodeId: string) {
    this.getNode(nodeId);
    this.state = createState(nodeId, this.state.choiceLog);
    saveRuntimeState(this.state);
  }

  commitChoice(choiceNodeId: string, optionId: string) {
    const node = this.getNode(choiceNodeId);
    if (node.type !== "choice") {
      throw new Error(`Node "${choiceNodeId}" is not a choice node.`);
    }

    const selectedOption = node.options.find((option) => option.id === optionId);
    if (!selectedOption) {
      throw new Error(`Option "${optionId}" not found on node "${choiceNodeId}".`);
    }

    this.state = createState(selectedOption.next, {
      ...this.state.choiceLog,
      [choiceNodeId]: optionId,
    });
    saveRuntimeState(this.state);
  }

  reset() {
    this.state = createState(this.story.startNodeId);
    clearRuntimeState();
    saveRuntimeState(this.state);
  }

  private getNode(nodeId: string): StoryNode {
    const node = this.story.nodes[nodeId];
    if (!node) {
      throw new Error(`Node "${nodeId}" does not exist in story definition.`);
    }

    return node;
  }

  private static assertStory(story: StoryDefinition) {
    if (!story.startNodeId || !story.nodes?.[story.startNodeId]) {
      throw new Error("Story must include a valid startNodeId.");
    }

    Object.entries(story.nodes).forEach(([nodeId, node]) => {
      if (node.type === "video" && !story.nodes[node.next]) {
        throw new Error(`Video node "${nodeId}" points to missing next node "${node.next}".`);
      }

      if (node.type === "narration" && !story.nodes[node.next]) {
        throw new Error(`Narration node "${nodeId}" points to missing next node "${node.next}".`);
      }

      if (node.type === "choice") {
        StoryEngine.assertChoiceNode(nodeId, node, story);
      }
    });
  }

  private static assertChoiceNode(nodeId: string, node: ChoiceNode, story: StoryDefinition) {
    if (!node.options.length) {
      throw new Error(`Choice node "${nodeId}" must provide at least one option.`);
    }

    node.options.forEach((option) => {
      if (!story.nodes[option.next]) {
        throw new Error(`Choice node "${nodeId}" points to missing next node "${option.next}".`);
      }
    });
  }
}
