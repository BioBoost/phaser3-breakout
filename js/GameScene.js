const gameParams = {
  lives: 3,
  paddle: {
    max_speed: 500,
    initial_size: 4
  }
};

class GameScene extends Phaser.Scene {
  constructor() {
    super({
        key: 'GameScene'
    });

    this.lives = gameParams.lives;
    this.score = 0;
  }

  preload() {
    this.loadImages();
    this.loadSounds();
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    // Add sounds
    this.sound.add('block');
    this.sound.add('paddle');
    this.sound.add('coin-eat');
  
    // Create the list of balls as a dynamic physics body group
    this.balls = this.physics.add.group();
    this.addBall(this.balls);   // Create initial ball
  
    // Create a list of blocks as static objects
    this.blocks = this.physics.add.staticGroup({
      key: 'block',
      repeat: 11,   // 12 in total
      setXY: { x: 150, y: 150, stepX: 85 }
    });
  
    // Allow ball to destroy the blocks but still make ball
    // separate from block (bounce off)
    this.coins = this.physics.add.group();
    this.physics.add.collider(this.balls, this.blocks, function(ball, block) {
      block.disableBody(true, true);
      this.sound.play('block');
  
      // Spawn a coin for destroying the block
      let coin = this.coins.create(block.x, block.y, 'coin');
      coin.setCollideWorldBounds(true);
      // coin.setVelocity(0, 100);
      coin.setGravityY(80);
    }, null, this);
  
    // Create bottom ground (ball and coin killer)
    this.ground =  this.physics.add.staticImage(0, 796, 'ground').setOrigin(0, 0).refreshBody();
    this.physics.add.overlap(this.ground, this.coins, function(ground, coin) {
      coin.disableBody(true, true);
    }, null, this);
  
    // Add score
    this.livesText = this.add.text(1050, 16, 'lives: ' + this.lives, { fontSize: '32px', fill: '#fff' });
    this.scoreText = this.add.text(50, 16, 'score: ' + this.score, { fontSize: '32px', fill: '#fff' });
  
    // Ball collisions with the ground
    this.physics.add.overlap(this.ground, this.balls, function(ground, ball) {
      ball.disableBody(true, true);
  
      if (this.balls.countActive(true) === 0) {
        this.lives -= 1;
        this.livesText.setText('lives: ' + this.lives);
        if (this.lives === 0) {
          this.physics.pause();
        } else {
          // Spawn a new ball
          this.addBall(this.balls);
        }
      }
    }, null, this);
  
    // Setup the player paddle
    this.paddle = this.createPaddle();
    this.physics.add.collider(this.paddle, this.balls, this.ballHitsPaddle, null, this);
  
    // Register events for keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
  
    // Paddle collisions with the coins
    this.physics.add.overlap(this.paddle, this.coins, function(paddle, coin) {
      coin.disableBody(true, true);
      this.sound.play('coin-eat');
      this.score += 10;
      this.scoreText.setText('score: ' + this.score);
    }, null, this);
  }

  update() {
    // Check for keyboard events
    if (this.cursors.left.isDown) {
      this.paddle.setVelocityX(-gameParams.paddle.max_speed);
    }
    else if (this.cursors.right.isDown) {
      this.paddle.setVelocityX(gameParams.paddle.max_speed);
    }
    else {
      this.paddle.setVelocityX(0);
    }
  }

  loadImages() {
    this.load.image('background', 'assets/backgrounds/space.jpg');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('block', 'assets/blocks/a.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('paddle', 'assets/paddles/basic.png');
  }

  loadSounds() {
    this.load.audio('block', 'assets/sounds/block_hit.mp3');
    this.load.audio('paddle', 'assets/sounds/paddle_hit.wav');
    this.load.audio('coin-eat', 'assets/sounds/coin_eat.wav');
  }

  createPaddle() {
    let paddle = this.physics.add.image(640, 780, 'paddle').setScale(gameParams.paddle.initial_size, 1);
    paddle.setCollideWorldBounds(true);
      // Paddle should be sprite: < = >, shich we can stitch together to make a sized paddle
    paddle.setImmovable();    // Dont allow paddle to be knocked away by ball
    return paddle;
  }

  addBall(balls) {
    let ball = balls.create(640, 400, 'ball');
    ball.setCollideWorldBounds(true);     // Bounce of scene edges
    ball.setBounce(1);  // Keep bouncing
    ball.setVelocity(200, 200);
    return ball;
  }

  ballHitsPaddle(paddle, ball) {
    this.sound.play('paddle');
    if (ball.x < paddle.x) {    // Ball hits left side of paddle
      let xDiff = paddle.x - ball.x;
      // Increase horizontal speed vector based on distance from center of paddle
      ball.setVelocityX(-10 * xDiff);
    } else if (ball.x > paddle.x) {
      let xDiff = ball.x - paddle.x;
      ball.setVelocityX(10 * xDiff);
    } // else middle, dont do anything
  }

};

export default GameScene;