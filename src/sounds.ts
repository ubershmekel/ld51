import { sfx } from "../generated/sfx";
import ac3Url from "../generated/sfx.ac3?url";
import m4aUrl from "../generated/sfx.m4a?url";
import mp3Url from "../generated/sfx.mp3?url";
import oggUrl from "../generated/sfx.ogg?url";
import { sampleOne } from "./myphaser";

const key1 = "sounds";

type SfxNames = keyof typeof sfx.spritemap;

export function marker(soundName: SfxNames) {
  const duration =
    sfx.spritemap[soundName].end - sfx.spritemap[soundName].start;

  return {
    name: soundName,
    start: sfx.spritemap[soundName].start,
    duration,
  };
}

export class Sounds {
  scene: Phaser.Scene;
  obj!: Phaser.Sound.BaseSound;
  speaker!: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene) {
    // this.obj = new Phaser.Sound.BaseSound(scene.sound, key1);
    this.scene = scene;
    this.scene.load.audio({
      key: key1,
      url: [oggUrl, mp3Url, m4aUrl, ac3Url],
    });
  }

  create() {
    this.speaker = this.scene.sound.add(key1);
  }

  play(soundName: SfxNames, opts: Phaser.Types.Sound.SoundConfig = {}) {
    this.scene.sound.play(key1, {
      ...marker(soundName),
      config: opts,
    });
  }

  speak(soundName: SfxNames) {
    this.speaker.stop();
    this.speaker.addMarker(marker(soundName));
    this.speaker.play(soundName);
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

  playMusic() {
    this.play("music1", {
      volume: 0.3,
      loop: true,
    });
  }
}
