import type { SendMessagePayload, SoulTalkApi } from "@/types/soulTalk";
import { getDigitalHuman } from "@/data/digitalHumans";

const BASE_URL = "https://api.ltoken.shop/v1";
const API_KEY = "sk-5FQt8VAn2DXDRTsgQm8MeyJJG9Lh4rpjuE5bHTxSLOiUhgjB";

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

export class RealSoulTalkApi implements SoulTalkApi {
  async sendMessage(payload: SendMessagePayload): Promise<string> {
    const { characterId, message, history } = payload;
    
    try {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-v4-flash",
          messages: [
            {
              role: "system",
              content: this.buildSystemPrompt(characterId),
            },
            ...history.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 500,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || this.getFallbackReply(characterId);
    } catch (error) {
      console.warn("Real API failed, falling back to mock:", error);
      return this.getFallbackReply(characterId);
    }
  }

  private buildSystemPrompt(characterId: string): string {
    const character = getDigitalHuman(characterId);
    if (!character) {
      return "你是一个友善的聊天伙伴，请用自然的语言回复用户。";
    }

    if (character.systemPrompt) {
      return character.systemPrompt;
    }

    return `
你是${character.name}，身份是${character.role}，来自${character.era}。
性格特点：${character.traits.join("、")}。
${character.description}

请按照这个角色的身份和性格来回复用户的消息，保持对话自然、符合角色设定。
回复风格要口语化，不要太正式，就像日常聊天一样。
    `.trim();
  }

  private getFallbackReply(characterId: string): string {
    const character = getDigitalHuman(characterId);
    const pool = mockReplies[characterId] ?? [
      "我在听，你可以继续说。",
    ];
    const reply = pool[Math.floor(Math.random() * pool.length)];
    return character ? `${reply}` : reply;
  }
}

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

export const soulTalkApi: SoulTalkApi = new RealSoulTalkApi();
