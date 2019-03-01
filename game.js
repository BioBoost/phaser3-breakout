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

let game = new Phaser.Game(config);
let balls;

function preload () {
  this.load.image('background', 'assets/backgrounds/space.jpg');
  this.load.image('ball', 'assets/ball.png');
}

function create () {
  this.add.image(0, 0, 'background').setOrigin(0, 0);

  // Create the list of balls as a dynamic physics body group
  balls = this.physics.add.group({
    key: 'ball',
    setXY: { x: 640, y: 500 }
  });
}

function update () {
}