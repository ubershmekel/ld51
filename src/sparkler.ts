export class Sparkler {
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private manager: Phaser.GameObjects.Particles.ParticleEmitterManager;

  constructor(
    scene: Phaser.Scene,
    imageKey: string,
    config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
  ) {
    this.manager = scene.add.particles(imageKey);
    this.emitter = this.manager.createEmitter(config);
    this.manager.setDepth(12);
    this.emitter.stop();
  }

  static configSnowing(scene: Phaser.Scene) {
    return {
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
    };
  }

  static configGush() {
    return {
      alpha: { start: 1, end: 1.0 },
      scale: { start: 0.2, end: 2 },
      // tint: { start: 0xff945e, end: 0xff945e },
      speedX: { min: -400, max: 400 },
      speedY: { min: -400, max: -1300 },
      accelerationY: 1500,
      angle: { min: -175, max: 175 },
      rotate: { min: -180, max: 180 },
      lifespan: 5000,
      // tint: { min: 0x999999, max: 0xaaaaaa },
      // blendMode: "ADD",
      frequency: 50,
      maxParticles: 100,
      x: {
        min: -20,
        max: 20,
      },
      y: {
        min: -20,
        max: 20,
      },
    };
  }
  start() {
    this.emitter.start();
  }

  setPos(x: number, y: number) {
    this.manager.x = x;
    this.manager.y = y;
  }
  setDepth(depth: number) {
    this.manager.depth = depth;
  }
}
