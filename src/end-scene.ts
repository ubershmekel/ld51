import { levelCount } from "./consts";
import { menuSceneKey } from "./menu-scene";
import { Sparkler } from "./sparkler";

export const endSceneKey = "end-screen";

// const endScene = new Phaser.Scene(endSceneKey);

// endScene.create = function () {};

export interface ScoreData {
  timesMs: number[];
  cohort: string;
}

export class EndScene extends Phaser.Scene {
  private sparkler!: Sparkler;
  private scoreData!: ScoreData;

  constructor() {
    super({
      key: endSceneKey,
    });
  }

  init(data: ScoreData) {
    console.log("scene data", data);
    this.scoreData = data;
  }

  preload() {
    console.log("preload scene");
    Sparkler.preload(this);
  }

  create() {
    // this.game.sound.stopAll();

    this.sparkler = new Sparkler(this);
    this.sparkler.start();
    this.sparkler.setPos(
      this.sys.canvas.width * 0.5,
      this.sys.canvas.height * 0.5
    );
    console.log("created scene");
    const wid = this.sys.canvas.width;
    const hei = this.sys.canvas.height;
    const rectAlpha = 0.7;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000033, rectAlpha);
    graphics.setDepth(1);
    graphics.fillRect(wid * 0.1, hei * 0.1, wid * 0.8, hei * 0.8);

    if (!this.scoreData || !this.scoreData.timesMs) {
      console.log("no score data, faking for demo");
      this.scoreData = {
        cohort: "positive",
        timesMs: [1355, 3313, 9319, 121, 1235, 9900, 10000, 10100, 600, 54123],
      };
    }

    this.createReport();
  }
  createReport() {
    const scoreText = this.add
      .text(this.sys.canvas.width * 0.15, this.sys.canvas.height * 0.15, "", {
        fontSize: "40px",
        fontFamily: "Monospace",
      })
      .setDepth(2);
    console.log("sccore data", this.scoreData);

    let lines = [`Experiment report, control group "${this.scoreData.cohort}"`];
    let totalTime = 0;
    for (let i = 0; i < this.scoreData.timesMs.length; i++) {
      const seconds = this.scoreData.timesMs[i] / 1000;
      totalTime += seconds;
      lines.push(`Level ${i + 1}: ${seconds} seconds`);
    }

    // `-1` because level 1 is actually the buton without a timer
    if (this.scoreData.timesMs.length < levelCount - 1) {
      lines.push(`Level ${this.scoreData.timesMs.length + 1}: ???`);
    }
    if (this.scoreData.timesMs.length > 0) {
      lines.push(`Total: ${totalTime.toFixed(3)} seconds`);
    }
    scoreText.setText(lines.join("\n"));

    this.input.on("pointerdown", () => {
      this.scene.start(menuSceneKey);
    });
  }
}
