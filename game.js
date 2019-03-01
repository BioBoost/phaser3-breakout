var config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 800,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var game = new Phaser.Game(config);

function preload () {
  this.load.image('background', 'assets/backgrounds/space.jpg');
}

function create () {
  this.add.image(0, 0, 'background').setOrigin(0, 0);
}

function update () {
}