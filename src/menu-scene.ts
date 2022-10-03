import "phaser";
import particleUrl from "../assets/images/smoke.png";
import buttonPngUrl from "../assets/images/button.png";
import buttonJsonUrl from "../assets/images/button.json";
import gaspUrl from "../assets/sfx/gasp.mp3";
import { sampleOne, tweenPromise } from "./myphaser";
import { Crawler } from "./crawler";
import { SfxNames, Sounds } from "./sounds";
import { LoadBar } from "./load-bar";
import { SlipperyButton } from "./slippery-button";
import { DialogBox } from "./dialog-box";
import { voiceData, CohortName } from "./voice-lines";

export class MenuScene extends Phaser.Scene {
  private sprites: { s: Phaser.GameObjects.Image; r: number }[] = [];
  private level = 1;
  private theButton!: Phaser.GameObjects.Sprite;
  private sounds!: Sounds;
  private lastPressTime = new Date();
  private countdownText!: Phaser.GameObjects.Text;
  // private cohortText!: Phaser.GameObjects.Text;
  private cohort: CohortName | "" = "";
  private crawlers!: Crawler[];
  private dialogBox!: DialogBox;
  private isTimeTicking = false;
  private isButtonLive = false;

  constructor() {
    super({
      key: "MenuScene",
    });
  }

  preload(): void {
    if (import.meta.env.DEV) {
      // which level do you want to work on now?
      this.level = 1;
      console.log("this.evel", this.level);
    }
    new LoadBar(this);
    this.load.image("particle", particleUrl);
    this.load.audio("gasp", gaspUrl);

    this.load.aseprite({
      key: "button",
      textureURL: buttonPngUrl,
      atlasURL: buttonJsonUrl,
    });

    this.sounds = new Sounds(this);
    this.crawlers = [
      new Crawler(this),
      new Crawler(this),
      new Crawler(this),
      new Crawler(this),
      new Crawler(this),
      new Crawler(this),
    ];
    this.crawlers[0].preload();

    DialogBox.preload(this);
  }

  async beatLevel() {
    this.level += 1;
    this.startLevelDialog();
  }

  speakByCohort(index: number) {
    if (this.cohort.length === 0) {
      console.error("bugged out speakByCohort no cohort");
      return;
    }
    const cohort = this.cohort as CohortName;
    const soundKey = (this.cohort + "-" + index) as SfxNames;
    this.sounds.speak(soundKey);
    // `index - 1` because the voice lines start a `1` and the array index at `0`
    this.dialogBox.setText(voiceData[cohort][index - 1]);
    this.dialogBox.show();
  }

  async startTheLevel() {
    this.isTimeTicking = true;
    this.isButtonLive = true;
    this.lastPressTime = new Date();
    await this.tweens.add({
      targets: this.countdownText,
      alpha: 0,
      duration: 300,
      yoyo: true,
    });
    // in case animations overlap and cause alpha to finish somewhere in between
    this.countdownText.alpha = 1.0;
  }

  startLevelDialog() {
    if (this.level === 1) {
      // first level is just the big button
      return;
    }
    this.speakByCohort(this.level - 1);
  }

  async setupNextLevel() {
    if (this.level === 1) {
      // Big red button, just waiting for you to click it
      this.theButton.x = this.sys.canvas.width / 2;
      this.theButton.y = this.sys.canvas.height / 2;
      this.theButton.setScale(2);
      this.isTimeTicking = false;
      this.isButtonLive = true;
    }

    if (this.level === 2) {
      this.theButton.setScale(1.0);
      // this.music.play();
      this.sounds.playMusic();
    }

    if (this.level === 3) {
      this.theButton.setScale(0.5);
      this.theButton.x = this.sys.canvas.width / 4;
    }

    if (this.level === 4) {
      this.theButton.setScale(0.5);
      await tweenPromise(this, {
        targets: this.theButton,
        x: this.sys.canvas.width * 0.8,
        y: this.sys.canvas.height * 0.2,
        duration: 100,
      });
      tweenPromise(this, {
        targets: this.theButton,
        yoyo: true,
        y: this.sys.canvas.height * 0.75,
        duration: 600,
        repeat: -1,
      });
    }

    if (this.level === 5) {
      this.theButton.setScale(0.5);
      this.tweens.killTweensOf(this.theButton);
      await tweenPromise(this, {
        targets: this.theButton,
        x: this.sys.canvas.width * 0.2,
        y: this.sys.canvas.height * 0.5,
        duration: 100,
      });

      for (const cr of this.crawlers) {
        cr.obj.x = this.theButton.x + Math.random() * 30;
        cr.obj.y = this.theButton.y + Math.random() * 30;
        cr.obj.angle = -90 + Math.random() * 180;
        cr.isHoming = false;
      }
    }

    if (this.level === 6) {
      this.crawlersGoAway();
      this.level6();
    }

    if (this.level === 7) {
      this.theButton.setScale(0.5);
      this.theButton.alpha = 0;
      const slipper = new SlipperyButton(this, () => {
        this.theButton.alpha = 1;
        this.theButton.x = slipper.obj.x;
        this.theButton.y = slipper.obj.y;
      });
      slipper.create();
      console.log(slipper.obj.x, slipper.obj.y);
    }
    if (this.level === 8) {
      this.theButton.setScale(0.5);
      this.tweens.killTweensOf(this.theButton);
      await tweenPromise(this, {
        targets: this.theButton,
        x: this.sys.canvas.width * 0.5,
        y: this.sys.canvas.height * 0.5,
        duration: 100,
      });

      for (const cr of this.crawlers) {
        cr.obj.x = this.theButton.x + Math.random() * 30;
        cr.obj.y = this.theButton.y + Math.random() * 30;
        cr.obj.angle = -90 + Math.random() * 180;
        cr.homingX = this.theButton.x;
        cr.homingY = this.theButton.y;
        cr.isHoming = true;
      }
    }
    if (this.level === 9) {
      this.crawlersGoAway();
    }
  }

  crawlersGoAway() {
    for (const cr of this.crawlers) {
      cr.isHoming = false;
      this.tweens.killTweensOf(cr.obj);
      tweenPromise(this, {
        targets: cr.obj,
        y: this.sys.canvas.height * 2,
        x: 0,
        duration: 800,
        angle: -90,
      });
    }
  }

  level6() {
    // grid of fake buttons you must click
    const fakeImages: Set<Phaser.GameObjects.Image> = new Set();
    const x0 = this.sys.canvas.width * 0.2;
    const y0 = this.sys.canvas.height * 0.33;
    const ygap = this.sys.canvas.height * 0.2;
    const xgap = this.sys.canvas.width * 0.2;
    this.theButton.setScale(0.5);
    this.theButton.x = -1000;
    this.theButton.y = -1000;
    const xcount = 4;
    const ycount = 3;
    for (let i = 0; i < ycount; i++) {
      for (let j = 0; j < xcount; j++) {
        const scene = this;
        (function () {
          const image = scene.add.image(x0 + j * xgap, y0 + i * ygap, "button");
          fakeImages.add(image);
          image.setScale(0.5);
          image.setInteractive();
          image.on("pointerdown", function () {
            image.alpha = 0;
            image.destroy();
            fakeImages.delete(image);
            if (fakeImages.size === 1) {
              // the last one is the real one
              const [lastImage] = fakeImages;
              scene.theButton.x = lastImage.x;
              scene.theButton.y = lastImage.y;
              lastImage.destroy();
            }
          });
        })();
      }
    }
  }

  youLose() {
    this.level = 1;
    this.sound.play("gasp");
    this.scene.start(this);
  }

  create(): void {
    if (import.meta.env.PROD) {
      this.input.on("pointerdown", () => {
        if (!this.scale.isFullscreen) {
          // go fullscreen after the first tap
          this.scale.startFullscreen();
        }
      });
    }

    this.dialogBox = new DialogBox(this);
    this.dialogBox.onDismiss = () => {
      this.setupNextLevel();
      this.startTheLevel();
    };
    this.dialogBox.onShow = () => {
      this.isTimeTicking = false;
      this.isButtonLive = false;
    };
    this.dialogBox.hide();
    this.sounds.create();
    for (const cr of this.crawlers) {
      cr.create();
      cr.obj.x = 2 * this.sys.canvas.width;
    }

    this.theButton = this.add
      .sprite(this.sys.canvas.width, this.sys.canvas.height, "button")
      .setDepth(1);
    this.theButton.setInteractive();
    this.theButton.on("pointerdown", () => {
      if (!this.isButtonLive) {
        return;
      }
      this.sounds.playClickDown();
      this.theButton.setFrame(1);
    });
    this.theButton.on("pointerup", () => {
      if (!this.isButtonLive) {
        return;
      }
      this.sounds.playClickUp();
      this.theButton.setFrame(0);
      this.beatLevel();
    });

    this.cohort = sampleOne(["positive", "sociopath", "negative"]);
    const cohortCode = this.cohort.slice(0, 2).toUpperCase();
    // set up the first level which is just the first big red button
    this.setupNextLevel();
    // this.cohortText =
    // this.add.text(10, 0, "Welcome to control group " + cohortCode, {
    //   fontSize: "60px",
    //   fontFamily: "Helvetica",
    // });

    this.countdownText = this.add
      .text(this.sys.canvas.width / 2, this.sys.canvas.height - 60, "10.0", {
        fontSize: "60px",
        fontFamily: "monospace",
        fontStyle: "bold",
        strokeThickness: 6,
        stroke: "#000000",
        color: "#dd0000",
        align: "center",
      })
      .setOrigin(0.5);
    this.countdownText.setText("");

    for (let i = 0; i < 300; i++) {
      const x = Phaser.Math.Between(-64, this.sys.game.canvas.width);
      const y = Phaser.Math.Between(-64, this.sys.game.canvas.height);

      const image = this.add.image(x, y, "particle");
      image.alpha = 0.1;
      image.setBlendMode(Phaser.BlendModes.ADD);
      this.sprites.push({ s: image, r: 1 + Math.random() * 2 });
    }

    //   const bounds = this.cohortText.getBounds();
    //   window.debugr = this.add
    //     .rectangle(
    //       bounds.centerX,
    //       bounds.centerY,
    //       bounds.width,
    //       bounds.height,
    //       // this.sys.canvas.width * 0.5,
    //       // this.sys.canvas.height * 0.5,
    //       // this.sys.canvas.width * 0.5,
    //       // this.sys.canvas.height * 0.5,
    //       0x00ff00
    //     )
    //     .setAlpha(0.5);
  }

  update(): void {
    if (this.isTimeTicking) {
      // Show the timer
      const timeSinceMs = new Date().getTime() - this.lastPressTime.getTime();
      const timeToSolvePuzzle = 10.3;
      let timeLeftSeconds = timeToSolvePuzzle - timeSinceMs / 1000.0;
      if (timeLeftSeconds < 0) {
        this.youLose();
      } else {
        let timeLeftString = "0" + timeLeftSeconds.toFixed(2);
        if (timeLeftSeconds > 9.98) {
          // 9.98 because sometimes toFixed rounds 9.99 to 10 and then we get "010.00" timeLeftString
          timeLeftString = "10.00";
        }
        this.countdownText.setText(timeLeftString);
      }
    }

    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i].s;

      sprite.y += this.sprites[i].r;

      if (sprite.y > this.sys.canvas.height + 256) {
        sprite.y = -64;
      }
    }
  }
}
