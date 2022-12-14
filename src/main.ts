import "./style.css";

// const app = document.querySelector<HTMLDivElement>('#app')!

// app.innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
//   <div id="game"></div>
// `;

import "phaser";
import { MenuScene } from "./menu-scene";
import * as consts from "./consts";
import { EndScene } from "./end-scene";

const GameConfig: Phaser.Types.Core.GameConfig = {
  title: "ExampleGame",
  url: "https://github.com/digitsensitive/phaser3-typescript",
  version: "2.0",
  width: consts.width,
  height: consts.height,
  type: Phaser.AUTO,
  parent: "app",
  scene: [MenuScene, EndScene],
  input: {
    keyboard: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  backgroundColor: "#333333",
  render: { pixelArt: false, antialias: true },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // `fullscreenTarget` must be defined for phones to not have
    // a small margin during fullscreen.
    fullscreenTarget: "app",
    // expandParent: false,
  },
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  // Expose `_game` to allow debugging, mute button and fullscreen button
  (window as any)._game = new Game(GameConfig);
});

// @ts-ignore
import BasicAnalytics from "@basic-analytics/sdk";

// import * as BasicAnalytics from "@basic-analytics/sdk";

let apiBase = "https://basicanalytics.tagsyo.com";

BasicAnalytics.init({
  apiBase,
});

BasicAnalytics.sendEvent({ key: "pageview" });

function iOS() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

if (!iOS()) {
  document.querySelector("#rotate-phone")?.remove();
}
