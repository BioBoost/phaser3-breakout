var config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 800,
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var game = new Phaser.Game(config);

function preload () {
  this.load.image('sky', 'assets/sky.png');
}

function create () {
}

function update () {
}