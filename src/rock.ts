import rockPngUrl from "../assets/images/rock.png";

const imageKey = "rock";

export class Rock {
  obj!: Phaser.GameObjects.Image;
  scene: Phaser.Scene;
  onDone = () => {};
  isDone = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    scene.load.image(imageKey, rockPngUrl);
  }

  create() {
    this.obj = this.scene.add
      .image(
        this.scene.sys.canvas.width * 0.7,
        this.scene.sys.canvas.height * 0.35,
        imageKey
      )
      .setDepth(3)
      .setOrigin(0.5, 1.0);
    // this.obj.setScale(0.5);
    this.obj.angle = 15;
    this.obj.setInteractive();
    this.obj.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.isDone) {
        return;
      }
      const touchX = pointer.x;
      let xdiff = this.obj.x - touchX;
      // let ydiff = this.obj.y - touchY;
      console.log("rock", xdiff, this.obj.angle);
      if (xdiff > 25) {
        this.obj.angle += 5;
      }
      if (xdiff < -25) {
        this.obj.angle -= 5;
      }

      if (this.obj.angle < -35) {
        this.isDone = true;
        this.onDone();
      }
      // when click in the middle, jump away
      // if (Math.abs(xdiff) < 15 && Math.abs(ydiff) < 15) {
      //   xdiff = this.obj.displayWidth * 0.5;
      //   ydiff = this.obj.displayHeight * 0.5;
      // }
      // let newX = this.obj.x + xdiff * 1.2;
      // let newY = this.obj.y + ydiff * 1.2;
    });
  }
}
