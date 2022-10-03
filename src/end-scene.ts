import { CloseButton } from "./close-button";
import { levelCount } from "./consts";
import { DialogBox } from "./dialog-box";
import { menuSceneKey } from "./menu-scene";
import { SfxNames, Sounds } from "./sounds";
import { Sparkler } from "./sparkler";
import { CohortName, voiceData } from "./voice-lines";

export const endSceneKey = "end-screen";

// const endScene = new Phaser.Scene(endSceneKey);

// endScene.create = function () {};

export interface ScoreData {
  timesMs: number[];
  cohort: CohortName | "";
}

export class EndScene extends Phaser.Scene {
  private sparkler!: Sparkler;
  private scoreData!: ScoreData;
  private sounds!: Sounds;
  private dialogBox!: DialogBox;
  private closeButton!: CloseButton;

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
    this.sounds = new Sounds(this);
    this.dialogBox = new DialogBox(this);
    CloseButton.preload(this);
  }

  create() {
    this.cameras.main.setBackgroundColor("#ffffff");

    this.sounds.create();
    this.sparkler = new Sparkler(this);
    this.sparkler.setDepth(-1);
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

    this.sayEndLine();
  }

  sayEndLine() {
    const cohort = this.scoreData.cohort;
    if (cohort === "") {
      return;
    }
    const soundModifier = this.isWin() ? "win" : "fail";
    const soundKey = `${cohort}-${soundModifier}-1` as SfxNames;
    this.sounds.speak(soundKey);
    // `index - 1` because the voice lines start a `1` and the array index at `0`
    const scriptObj = voiceData[cohort];
    const voiceText = this.isWin() ? scriptObj.win : scriptObj.lose;
    this.dialogBox.setText(voiceText);
    this.dialogBox.show();
    this.dialogBox.onDismiss = () => {
      this.createReport();
    };
  }

  createReport() {
    const scoreText = this.add
      .text(this.sys.canvas.width * 0.15, this.sys.canvas.height * 0.15, "", {
        fontSize: "36px",
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
    if (!this.isWin()) {
      const failedLevelIndex = this.scoreData.timesMs.length + 1;
      lines.push(`Level ${failedLevelIndex}: ???`);
    }
    if (this.scoreData.timesMs.length > 0) {
      lines.push(`Total: ${totalTime.toFixed(3)} seconds`);
    }
    scoreText.setText(lines.join("\n"));

    this.closeButton = new CloseButton(this);
    // closeButton.obj.setFrame(0);
    this.closeButton.obj.setDepth(scoreText.depth + 1);
    this.closeButton.obj.setInteractive();
    this.closeButton.obj.on("pointerdown", () => {
      this.sounds.stopSpeak();
      this.scene.start(menuSceneKey);
    });
    this.closeButton.obj.x = this.sys.canvas.width * 0.85;
    this.closeButton.obj.y = this.sys.canvas.height * 0.85;
    this.closeButton.obj.setFrame(1);
    this.closeButton.obj.visible = true;
  }

  isWin() {
    if (this.scoreData.timesMs.length === levelCount - 1) {
      return true;
    } else {
      return false;
    }
  }
}
