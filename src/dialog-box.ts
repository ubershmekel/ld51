import closeButtonPngUrl from "../assets/images/close-dialog-button.png";
import closeButtonJsonUrl from "../assets/images/close-dialog-button.json";
// Based off of https://gamedevacademy.org/create-a-dialog-modal-plugin-in-phaser-3-part-1/
// but simpler
const config = {
  borderThickness: 3,
  borderColor: 0x404798,
  borderAlpha: 1,
  boxAlpha: 0.8,
  boxColor: 0x373737,
  boxHeight: 150,
  margin: 20,
  padding: 10,
};

const closeImageKey = "close-dialog-button";

export class DialogBox {
  scene: Phaser.Scene;
  sceneText: Phaser.GameObjects.Text;
  graphics: Phaser.GameObjects.Graphics;
  closeButton: Phaser.GameObjects.Image;
  targetText = "";
  resolver: VoidFunction | null = null;
  promise: Promise<void> | null = null;
  onDismiss: VoidFunction | null = null;
  onShow: VoidFunction | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    config.boxHeight = scene.sys.canvas.height * 0.7;
    const gameWidth = +scene.sys.game.config.width;
    const gameHeight = +scene.sys.game.config.height;
    const boxWidth = gameWidth - config.margin * 2;
    const boxX = config.margin;
    const boxY = gameHeight - config.boxHeight - config.margin;

    const graphics = scene.add.graphics();
    this.graphics = graphics;
    // Creates the inner dialog window (where the text is displayed)
    graphics.fillStyle(config.boxColor, config.boxAlpha);
    graphics.fillRect(boxX + 1, boxY + 1, boxWidth - 1, config.boxHeight - 1);

    // Creates the border rectangle of the dialog window
    graphics.lineStyle(
      config.borderThickness,
      config.borderColor,
      config.borderAlpha
    );
    graphics.strokeRect(boxX, boxY, boxWidth, config.boxHeight);
    graphics.setScrollFactor(0);

    // Make text
    this.targetText = "";
    const sceneText = scene.make.text({
      x: config.margin + config.padding,
      y: boxY + config.padding,
      text: "",
      style: {
        wordWrap: { width: gameWidth - config.margin * 2 - 25 },
        fontSize: "36px",
        fontStyle: "bold",
      },
    });
    sceneText.setScrollFactor(0);
    this.sceneText = sceneText;

    // Dialog should be in front of most things
    sceneText.depth = 9;
    graphics.depth = 9;

    this.closeButton = scene.add.sprite(0, 0, closeImageKey);
    this.closeButton.x = boxX + boxWidth - this.closeButton.displayWidth * 0.5;
    this.closeButton.y =
      boxY + config.boxHeight - this.closeButton.displayHeight * 0.5;

    this.closeButton.depth = 9;
    this.closeButton.setInteractive();
    this.closeButton.on("pointerdown", () => {
      this.dismiss();
    });

    this.scene.input.on("pointerup", async () => {
      if (this.sceneText.text === "") {
        // just started, wait a sec
        return;
      }
      this.skipDialogAnim();
    });
  }

  dismiss() {
    if (this.sceneText.text === this.targetText) {
      // dismiss
      this.hide();
      if (this.onDismiss) {
        this.onDismiss();
      }
      return;
    }
  }

  static preload(scene: Phaser.Scene) {
    scene.load.aseprite({
      key: closeImageKey,
      textureURL: closeButtonPngUrl,
      atlasURL: closeButtonJsonUrl,
    });
  }

  moveToTop() {
    const gameHeight = +this.scene.sys.game.config.height;
    const boxY = config.margin;
    const textY = boxY + config.padding;
    // Note that `graphics.y` is an offset, while `sceneText.y` is in screen-space
    this.sceneText.y = textY;
    this.graphics.y =
      -gameHeight + config.boxHeight + config.margin + config.margin;
  }

  moveToBottom() {
    const gameHeight = +this.scene.sys.game.config.height;
    const boxY = gameHeight - config.boxHeight - config.margin;
    // Note that `graphics.y` is an offset, while `sceneText.y` is in screen-space
    this.sceneText.y = boxY + config.padding;
    this.graphics.y = 0;
  }

  setText(text: string): Promise<void> {
    // Slowly display the text in the dialog box
    const sceneText = this.sceneText;
    this.targetText = text;
    sceneText.setText("");
    this.promise = new Promise<void>((resolve) => {
      this.resolver = resolve;
      const doneAnimating = () => {
        this.doneAnimatingText();
        timedEvent.remove();
      };

      const animateText = () => {
        const nextIndex = sceneText.text.length;
        if (this.targetText !== text) {
          // In an async situation where someone called setText
          // and then setText again while this `animateText` is still happening
          // then this.targetText and `text` will be out of sync and corrupt the dialog.
          // I might fix this bug later.
          console.warn(
            "DUPLICATE DIALOG SET TEXT NO BUENO",
            text,
            this.targetText
          );
          doneAnimating();
          return;
        }
        if (nextIndex >= text.length) {
          doneAnimating();
          return;
        }

        sceneText.setText(sceneText.text + text[nextIndex]);
      };
      const timedEvent = this.scene.time.addEvent({
        delay: 1,
        callback: animateText,
        loop: true,
      });
    });

    return this.promise;
  }

  doneAnimatingText() {
    this.closeButton.setFrame(1);
  }

  skipDialogAnim(): Promise<void> {
    console.log("skipDialogAnim");
    if (this.targetText === this.sceneText.text) {
      // dismiss
      if (this.resolver) {
        this.resolver();
      }
      this.resolver = null;
    } else {
      // finish typing it out
      this.sceneText.setText(this.targetText);
    }

    if (this.promise) {
      return this.promise;
    } else {
      // No dialog presented yet. Pretend we dismissed it already.
      return Promise.resolve();
    }
  }

  isVisible() {
    return this.graphics.visible;
  }

  hide() {
    this.sceneText.visible = false;
    this.graphics.visible = false;
    this.closeButton.visible = false;
  }

  show() {
    this.sceneText.visible = true;
    this.graphics.visible = true;
    this.closeButton.visible = true;
    this.closeButton.setFrame(0);
    if (this.onShow) {
      this.onShow();
    }
  }
}
