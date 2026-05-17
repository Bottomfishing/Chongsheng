import Phaser from "phaser";
import { StreamRushScene } from "./StreamRushScene";

export function createStreamRushGame(parent: HTMLElement) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 960,
    height: 540,
    backgroundColor: "#f8f2e8",
    scene: [new StreamRushScene()],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  });
}
