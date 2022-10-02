import { sfx } from "../dist/sfx";
import ac3Url from "../dist/sfx.ac3?url";
import m4aUrl from "../dist/sfx.m4a?url";
import mp3Url from "../dist/sfx.mp3?url";
import oggUrl from "../dist/sfx.ogg?url";
import { sampleOne } from "./myphaser";

const key1 = "sounds";

type SfxNames = keyof typeof sfx.spritemap;

export class Sounds {
  scene: Phaser.Scene;
  obj!: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene) {
    // this.obj = new Phaser.Sound.BaseSound(scene.sound, key1);
    this.scene = scene;
    this.scene.load.audio({
      key: key1,
      url: [oggUrl, mp3Url, m4aUrl, ac3Url],
    });
  }

  play(soundName: SfxNames) {
    const duration =
      sfx.spritemap[soundName].end - sfx.spritemap[soundName].start;
    this.scene.sound.play(key1, {
      name: soundName,
      start: sfx.spritemap[soundName].start,
      duration,
    });
  }

  playClickUp() {
    const keys: SfxNames[] = ["click-up1", "click-up2", "click-up3"];
    this.play(sampleOne(keys));
  }

  playClickDown() {
    const keys: SfxNames[] = [
      "click-down1",
      "click-down2",
      "click-down3",
      "click-down4",
    ];
    this.play(sampleOne(keys));
  }
}
