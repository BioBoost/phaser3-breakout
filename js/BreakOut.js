import GameScene from './GameScene.js';

const phaserConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [
    GameScene
  ]
};

class BreakOut {

  constructor() {
    this.game = new Phaser.Game(phaserConfig);
  }

}

export default BreakOut;