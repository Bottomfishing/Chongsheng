import type { DigitalHuman } from "@/types/soulTalk";

/**
 * 立绘：frontend/public/characters/{id}.png
 * 动画：frontend/public/characters/animations/{id}.mp4
 * 顺序：牛天真 → 李天佐 → 费启暗 → 阿宁
 */
export const digitalHumans: DigitalHuman[] = [
  {
    id: "niu-tianzhen",
    name: "牛天真",
    role: "重生女主 · 商业鬼才",
    era: "1995 · 穿越归来",
    description:
      "带着未来记忆回到九十年代，脑子转得比谁都快，谈生意时眼里有光。",
    traits: ["穿越者", "商业头脑", "果敢"],
    greeting:
      "又见面了。你要是心里堵得慌，先坐下——生意上的事、感情上的事，我都听得懂。",
    accent: "#b86b7a",
    accentSoft: "rgba(184, 107, 122, 0.16)",
    symbol: "牛",
    portrait: "/characters/niu-tianzhen.png",
    animation: "/characters/animations/niu-tianzhen.mp4",
  },
  {
    id: "li-tianzuo",
    name: "李天佐",
    role: "社会哥 · 豪门少爷",
    era: "1995 · 县城首富家",
    description:
      "家里有钱，走路带风，嘴上不饶人，但未必真的不在乎你。",
    traits: ["有钱", "傲慢", "社会气"],
    greeting:
      "哟，找我？行啊，反正我闲着也是闲着。有话快说，别磨磨唧唧的。",
    accent: "#8b6914",
    accentSoft: "rgba(139, 105, 20, 0.14)",
    symbol: "李",
    portrait: "/characters/li-tianzuo.png",
    animation: "/characters/animations/li-tianzuo.mp4",
  },
  {
    id: "fei-qian",
    name: "费启暗",
    role: "逆袭废柴 · 蛰伏者",
    era: "1995 · 被人看不起的那几年",
    description:
      "曾经谁都嫌他没用，如今憋着一股劲，最懂从泥里爬出来的滋味。",
    traits: ["逆袭", "隐忍", "废柴起家"],
    greeting:
      "……你也觉得日子难熬是吧。我懂。要是愿意，跟我说说，你怎么熬过来的。",
    accent: "#5a6b7a",
    accentSoft: "rgba(90, 107, 122, 0.16)",
    symbol: "费",
    portrait: "/characters/fei-qian.png",
    animation: "/characters/animations/fei-qian.mp4",
  },
  {
    id: "a-ning",
    name: "阿宁",
    role: "现实派 · 爱慕虚荣",
    era: "1995 · 县城交际圈",
    description:
      "爱钱、爱面子，嘴上现实，其实也在乎谁对她真心。",
    traits: ["爱慕虚荣", "爱钱", "现实"],
    greeting:
      "哎，你找我呀？行，聊可以啊——不过你先说说，最近到底什么事儿把你愁成这样？",
    accent: "#c9a06e",
    accentSoft: "rgba(201, 160, 110, 0.16)",
    symbol: "宁",
    portrait: "/characters/a-ning.png",
    animation: "/characters/animations/a-ning.mp4",
  },
];

export function getDigitalHuman(id: string): DigitalHuman | undefined {
  return digitalHumans.find((item) => item.id === id);
}
