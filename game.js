var config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 800,
  physics: {
      default: 'arcade',
      arcade: {
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
  balls = this.physics.add.group();

  // Create initial ball
  let ball = balls.create(640, 400, 'ball');
  // Stop from falling through bottom of scene
  // Does not stop from falling through platforms
  ball.setCollideWorldBounds(true);
  ball.setBounce(1);  // Keep bouncing
  ball.setVelocity(200, 200);
}

function update () {
}