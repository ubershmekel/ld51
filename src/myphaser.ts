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

export function sampleOne<Type>(arr: Type[]): Type {
  // https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
  return arr[Math.floor(Math.random() * arr.length)];
}
