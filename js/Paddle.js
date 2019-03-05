class Paddle extends Phaser.Physics.Arcade.Image {

  constructor(scene, x, y, texture, initialSize, maxSpeed) {
    super(scene, x, y, texture);
    this.maxSpeed = maxSpeed;
    this.initialSize = initialSize;

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.setScale(this.initialSize, 1);
    this.setCollideWorldBounds(true);
    this.setImmovable();    // Dont allow paddle to be knocked away by ball
  }

  moveTowardsLeft() {
    this.setVelocityX(-this.maxSpeed);
  }

  moveTowardsRight() {
    this.setVelocityX(this.maxSpeed);
  }

  stopMoving() {
    this.setVelocity(0);
  }
}

export default Paddle;