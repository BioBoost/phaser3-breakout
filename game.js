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
let lives = 2;
let livesText;
let paddle;
let cursors;
let score = 0;
let scoreText;

function preload () {
  this.load.image('background', 'assets/backgrounds/space.jpg');
  this.load.image('ball', 'assets/ball.png');
  this.load.image('block', 'assets/blocks/a.png');
  this.load.image('coin', 'assets/coin.png');
  this.load.image('ground', 'assets/ground.png');
  this.load.image('paddle', 'assets/paddles/basic.png');
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
  scoreText = this.add.text(50, 16, 'score: ' + score, { fontSize: '32px', fill: '#fff' });

  // Ball collisions with the ground
  this.physics.add.overlap(ground, balls, function(ground, ball) {
    ball.disableBody(true, true);

    if (balls.countActive(true) === 0) {
      lives -= 1;
      livesText.setText('lives: ' + lives);
      if (lives === 0) {
        this.physics.pause();
      } else {
        // Spawn a new ball
        let ball = balls.create(640, 400, 'ball');
        ball.setCollideWorldBounds(true);     // Stop from falling through bottom of scene
        ball.setBounce(1);  // Keep bouncing
        ball.setVelocity(200, 200);
      }
    }
  }, null, this);

  // Setup the player paddle
  paddle =  this.physics.add.image(640, 780, 'paddle').setScale(2, 1);
    // Paddle should be sprite: < = >, shich we can stitch together to make a sized paddle
  paddle.setImmovable();    // Dont allow paddle to be knocked away by ball
  this.physics.add.collider(paddle, balls, function(paddle, ball) {
    if (ball.x < paddle.x) {    // Ball hits left side of paddle
      let xDiff = paddle.x - ball.x;
      // Increase horizontal speed vector based on distance from center of paddle
      ball.setVelocityX(-10 * xDiff);
    } else if (ball.x > paddle.x) {
      let xDiff = ball.x - paddle.x;
      ball.setVelocityX(10 * xDiff);
    } // else middle, dont do anything
  }, null, this);

  // Register events for keyboard
  cursors = this.input.keyboard.createCursorKeys();

  // Paddle collisions with the coins
  this.physics.add.overlap(paddle, coins, function(paddle, coin) {
    coin.disableBody(true, true);
    score += 10;
    scoreText.setText('score: ' + score);
  }, null, this);
}

function update () {
  // Check for keyboard events
  if (cursors.left.isDown) {
    paddle.setVelocityX(-450);
  }
  else if (cursors.right.isDown) {
    paddle.setVelocityX(450);
  }
  else {
    paddle.setVelocityX(0);
  }
}