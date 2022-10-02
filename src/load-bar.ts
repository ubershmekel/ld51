// Based on https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/
let firstLoad = true;
export class LoadBar {
  constructor(scene: Phaser.Scene) {
    if (!firstLoad) {
      return;
    }
    firstLoad = false;
    var progressBar = scene.add.graphics();
    var progressBox = scene.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = scene.cameras.main.width;
    var height = scene.cameras.main.height;
    var loadingText = scene.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        color: "#ffffff",
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = scene.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: "18px monospace",
        color: "#ffffff",
      },
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = scene.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        color: "#ffffff",
      },
    });
    assetText.setOrigin(0.5, 0.5);

    scene.load.on("progress", function (value: number) {
      percentText.setText(Math.floor(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    scene.load.on("fileprogress", function (file: Phaser.Loader.File) {
      assetText.setText("Loading asset: " + file.key);
    });
    scene.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
  }
}
