import "phaser";
import particleUrl from "../assets/smoke.png";
import buttonPngUrl from "../assets/button.png";
import buttonJsonUrl from "../assets/button.json";
import gaspUrl from "../assets/gasp.mp3";
import { Music } from "./music";

export class MenuScene extends Phaser.Scene {
  private startKey!: Phaser.Input.Keyboard.Key;
  private sprites: { s: Phaser.GameObjects.Image; r: number }[] = [];
  private level = 1;
  private theButton!: Phaser.GameObjects.Sprite;
  private music!: Music;
  private lastPressTime = new Date();
  private countdownText!: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "MenuScene",
    });
  }

  preload(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.startKey.isDown = false;
    this.load.image("particle", particleUrl);
    this.load.audio("gasp", gaspUrl);

    this.load.aseprite({
      key: "button",
      textureURL: buttonPngUrl,
      atlasURL: buttonJsonUrl,
    });

    this.music = new Music(this);
    this.music.preload();
  }

  beatLevel() {
    if (this.level === 1) {
      this.theButton.setScale(0.5);
      this.music.play();
    }
    if (this.level === 2) {
      this.theButton.x = this.sys.canvas.width / 4;
    }
    if (this.level === 3) {
      this.theButton.x = (this.sys.canvas.width * 3) / 4;
    }
    if (this.level === 4) {
      this.sound.play("gasp");
    }
    this.level += 1;
    this.lastPressTime = new Date();
  }

  create(): void {
    this.music.create();

    // const button = this.anims.createFromAseprite("button");
    this.theButton = this.add
      .sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "button")
      .setDepth(1)
      .setScale(2);
    this.theButton.setInteractive();
    this.theButton.on("pointerdown", () => {
      console.log("down");
      this.theButton.setFrame(1);
    });
    this.theButton.on("pointerup", () => {
      this.theButton.setFrame(0);
      this.beatLevel();
    });
    // .play({ key: 0, repeat: -1 })
    // .setScale(6);

    this.add.text(0, 0, "Welcome to cohort alpha", {
      fontSize: "60px",
      fontFamily: "Helvetica",
    });

    this.countdownText = this.add
      .text(this.sys.canvas.width / 2, this.sys.canvas.height - 60, "10.0", {
        fontSize: "60px",
        fontFamily: "Helvetica",
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
  }

  youLose() {
    this.scene.start(this);
    this.sound.play("gasp");
    this.level = 1;
  }

  update(): void {
    if (this.level > 1) {
      const timeSinceMs = new Date().getTime() - this.lastPressTime.getTime();
      const timeLeftSeconds = 10.0 - timeSinceMs / 1000.0;
      if (timeLeftSeconds < 0) {
        this.youLose();
      } else {
        this.countdownText.setText("0" + timeLeftSeconds.toFixed(2));
      }
    }
    if (this.startKey.isDown) {
      this.scene.start(this);
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
