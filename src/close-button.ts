import closeButtonPngUrl from "../assets/images/close-dialog-button.png";
import closeButtonJsonUrl from "../assets/images/close-dialog-button.json";

const closeImageKey = "close-dialog-button";

export class CloseButton {
  obj: Phaser.GameObjects.Sprite;

  static preload(scene: Phaser.Scene) {
    scene.load.aseprite({
      key: closeImageKey,
      textureURL: closeButtonPngUrl,
      atlasURL: closeButtonJsonUrl,
    });
  }

  constructor(scene: Phaser.Scene) {
    this.obj = scene.add.sprite(0, 0, closeImageKey);
    // `x` frame
    this.obj.setFrame(1);
  }
}
