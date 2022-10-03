import smokeUrl from "../assets/images/smoke.png";

const imageKey = "sparkler-image";

export class Sparkler {
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private manager: Phaser.GameObjects.Particles.ParticleEmitterManager;

  constructor(scene: Phaser.Scene) {
    this.manager = scene.add.particles(imageKey);
    this.emitter = this.manager.createEmitter({
      alpha: { start: 1, end: 0 },
      scale: { start: 0.1, end: 2 },
      // tint: { start: 0xff945e, end: 0xff945e },
      speedX: { min: -10, max: 10 },
      speedY: { min: -10, max: 10 },
      accelerationY: 10,
      angle: { min: -175, max: 175 },
      rotate: { min: -180, max: 180 },
      lifespan: { min: 1000, max: 99000 },
      // tint: { min: 0x999999, max: 0xaaaaaa },
      blendMode: "ADD",
      frequency: 100,
      // maxParticles: 10,
      x: {
        min: -scene.sys.canvas.width * 0.5,
        max: scene.sys.canvas.width * 0.5,
      },
      y: {
        min: -scene.sys.canvas.height * 0.5,
        max: scene.sys.canvas.height * 0.5,
      },
    });
    this.manager.setDepth(12);
    this.emitter.stop();
  }

  static preload(scene: Phaser.Scene) {
    scene.load.image(imageKey, smokeUrl);
  }

  start() {
    this.emitter.start();
  }

  setPos(x: number, y: number) {
    this.manager.x = x;
    this.manager.y = y;
  }
}
