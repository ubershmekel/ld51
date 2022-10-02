import crawlerPngUrl from "../assets/images/crawler.png";
import crawlerJsonUrl from "../assets/images/crawler.json";
import { tweenPromise } from "./myphaser";

const key = "crawler";

export class Crawler {
  obj!: Phaser.GameObjects.Sprite;
  scene: Phaser.Scene;
  homingX = 0;
  homingY = 0;
  isHoming = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  preload() {
    this.scene.load.aseprite({
      key: key,
      textureURL: crawlerPngUrl,
      atlasURL: crawlerJsonUrl,
    });
  }

  create() {
    this.scene.anims.createFromAseprite(key);
    this.obj = this.scene.add.sprite(0, 0, key);
    this.obj.play({
      key: "wiggle",
      repeat: -1,
      repeatDelay: 30,
    });

    this.obj.setDepth(2);
    this.obj.setInteractive();
    this.scene.input.setDraggable(this.obj);

    this.obj.on(
      "dragend",
      (
        _pointer: Phaser.Input.Pointer,
        _gameObject: Phaser.GameObjects.Sprite
      ) => {
        this.scene.tweens.killTweensOf(this.obj);

        if (this.isHoming) {
          tweenPromise(this.scene, {
            targets: this.obj,
            scale: 1.0,
            duration: 3500,
            x: this.homingX,
            y: this.homingY,
          });
        } else {
          tweenPromise(this.scene, {
            targets: this.obj,
            scale: 1.0,
            duration: 40,
          });
        }
      }
    );

    this.obj.on("dragstart", (_pointer: Phaser.Input.Pointer) => {
      this.scene.tweens.killTweensOf(this.obj);

      tweenPromise(this.scene, {
        targets: this.obj,
        angle: {
          from: -10,
          to: 10,
        },
        yoyo: true,
        duration: 200,
        repeat: -1,
        repeatDelay: 200,
      });
      tweenPromise(this.scene, {
        targets: this.obj,
        scale: 1.5,
        duration: 40,
      });
    });

    this.obj.on(
      "drag",
      (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        this.obj.x = dragX;
        this.obj.y = dragY;
      }
    );
  }
}
