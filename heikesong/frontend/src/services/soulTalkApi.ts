import type { SendMessagePayload, SoulTalkApi } from "@/types/soulTalk";
import { getDigitalHuman } from "@/data/digitalHumans";

const mockReplies: Record<string, string[]> = {
  "niu-tianzhen": [
    "你先别急，把来龙去脉理清楚，我们再想对策。",
    "九十年代机会多，但心里的事不理顺，赚再多也堵得慌。",
    "我听出来了，你不是不行，是太累了。",
  ],
  "li-tianzuo": [
    "哼，就这？不过……你要是真难受，也不是不能听你说完。",
    "别指望我安慰你，但我可以帮你骂醒那个让你难受的人。",
    "行吧，你说，我听着。",
  ],
  "fei-qian": [
    "谁没当过废柴呢，我懂那种被人看不起的滋味。",
    "你能说出来，就已经比很多人强了。",
    "慢慢来，日子是一天天熬出来的。",
  ],
  "a-ning": [
    "哎哟，听起来你是又委屈又憋屈对吧？",
    "钱能解决的事不叫事，解决不了的心里话才要命。",
    "你跟我还客气什么，说吧。",
  ],
};

/**
 * 占位实现：后续替换为真实 HTTP / WebSocket API 即可。
 * 建议接口：POST /api/soul-talk/message { characterId, message, history }
 */
export class MockSoulTalkApi implements SoulTalkApi {
  async sendMessage(payload: SendMessagePayload): Promise<string> {
    const character = getDigitalHuman(payload.characterId);
    const pool = mockReplies[payload.characterId] ?? [
      "我在听，你可以继续说。",
    ];

    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 500));

    const reply = pool[Math.floor(Math.random() * pool.length)];
    return character ? `${reply}` : reply;
  }
}

export const soulTalkApi: SoulTalkApi = new MockSoulTalkApi();
