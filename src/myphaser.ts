export function tweenPromise(
  scene: Phaser.Scene,
  config: Phaser.Types.Tweens.TweenBuilderConfig | object
) {
  return new Promise((resolve) => {
    // Type cast to avoid `onComplete` does not exist on `typeof object`
    (config as Phaser.Types.Tweens.TweenBuilderConfig).onComplete = resolve;
    scene.tweens.add(config);
  });
}
