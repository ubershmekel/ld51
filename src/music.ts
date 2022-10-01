import musicUrl from "../assets/music1.mp3";

const key1 = "music1";
let isGlobalMusicCreated = false;

export class Music {
  scene: Phaser.Scene;
  obj!: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene) {
    // this.obj = new Phaser.Sound.BaseSound(scene.sound, key1);
    this.scene = scene;
  }

  preload() {
    this.scene.load.audio(key1, musicUrl);
  }

  create() {
    this.obj = this.scene.sound.add(key1, {
      volume: 0.3,
      loop: true,
    });

    // music1.on("complete", () => {
    //   music2.play();
    // });

    // music2.on("complete", () => {
    //   music1.play();
    // });
  }

  play() {
    if (isGlobalMusicCreated) {
      return;
    } else {
      isGlobalMusicCreated = true;
    }
    this.obj.play();
  }
}
