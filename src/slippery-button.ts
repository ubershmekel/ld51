import { buttonImageKey } from "./consts";
import { tweenPromise } from "./myphaser";

export class SlipperyButton {
  obj!: Phaser.GameObjects.Sprite;
  scene: Phaser.Scene;
  onDone: Function;
  isDone = false;

  constructor(scene: Phaser.Scene, onDone: Function) {
    this.scene = scene;
    this.onDone = onDone;
  }
  create() {
    this.obj = this.scene.add
      .sprite(
        this.scene.sys.canvas.width / 2,
        this.scene.sys.canvas.height / 2,
        buttonImageKey
      )
      .setDepth(3);
    this.obj.setScale(0.6);
    this.obj.setInteractive();

    const radius = this.obj.displayWidth * 0.5;
    const socket = this.scene.add
      .circle(
        this.scene.sys.canvas.width * 0.2,
        this.scene.sys.canvas.height * 0.8,
        radius,
        0x000000
      )
      .setDepth(1);
    const overlapGoal = Phaser.Geom.Rectangle.Area(socket.getBounds()) * 0.3;

    this.obj.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.isDone) {
        return;
      }
      const touchX = pointer.x;
      const touchY = pointer.y;
      let xdiff = this.obj.x - touchX;
      let ydiff = this.obj.y - touchY;

      // when click in the middle, jump away
      if (Math.abs(xdiff) < 15 && Math.abs(ydiff) < 15) {
        xdiff = this.obj.displayWidth * 0.5;
        ydiff = this.obj.displayHeight * 0.5;
      }
      let newX = this.obj.x + xdiff * 1.2;
      let newY = this.obj.y + ydiff * 1.2;
      const overlapRect = Phaser.Geom.Intersects.GetRectangleIntersection(
        socket.getBounds(),
        this.obj.getBounds()
      );
      const overlapArea = Phaser.Geom.Rectangle.Area(overlapRect);
      if (overlapArea > overlapGoal) {
        // this.obj.alpha = 0.5;
        this.obj.x = socket.x;
        this.obj.y = socket.y;
        socket.alpha = 0;
        this.obj.alpha = 0;
        this.onDone();
        this.isDone = true;
        return;
      }

      // if going off screen, go back somewhere reasonable
      if (newX < 0 || newX > this.scene.sys.canvas.width) {
        newX = this.scene.sys.canvas.width / 2;
      }
      if (newY < 0 || newY > this.scene.sys.canvas.height) {
        newY = this.scene.sys.canvas.height / 2;
      }
      tweenPromise(this.scene, {
        targets: this.obj,
        x: newX,
        y: newY,
        duration: 50,
      });
      // this.obj.x = this.obj.x + xdiff;
      // this.obj.y = this.obj.y + ydiff;
    });
  }
}
