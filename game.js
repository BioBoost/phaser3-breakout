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
let blocks;
let coins;
let ground;
let lives = 1;
let livesText;

function preload () {
  this.load.image('background', 'assets/backgrounds/space.jpg');
  this.load.image('ball', 'assets/ball.png');
  this.load.image('block', 'assets/blocks/a.png');
  this.load.image('coin', 'assets/coin.png');
  this.load.image('ground', 'assets/ground.png');
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

  // Create a list of blocks as static objects
  blocks = this.physics.add.staticGroup({
    key: 'block',
    repeat: 11,   // 12 in total
    setXY: { x: 150, y: 150, stepX: 85 }
  });

  // Allow ball to destroy the blocks but still make ball
  // separate from block (bounce off)
  coins = this.physics.add.group();
  this.physics.add.collider(balls, blocks, function(ball, block) {
    block.disableBody(true, true);

    // Spawn a coin for destroying the block
    let coin = coins.create(block.x, block.y, 'coin');
    coin.setCollideWorldBounds(true);
    // coin.setVelocity(0, 100);
    coin.setGravityY(80);
  }, null, this);

  // Create bottom ground (ball and coin killer)
  ground =  this.physics.add.staticImage(0, 796, 'ground').setOrigin(0, 0).refreshBody();
  this.physics.add.overlap(ground, coins, function(ground, coin) {
    coin.disableBody(true, true);
  }, null, this);

  // Add score
  livesText = this.add.text(1050, 16, 'lives: ' + lives, { fontSize: '32px', fill: '#fff' });
}

function update () {
}