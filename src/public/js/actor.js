var Actor = function(game, x, y, image) {
  this.game = game;

  console.log('details',this.game, x, y, image);
  Phaser.Sprite.call(this, this.game, x, y, image);


  // this.anchor.setTo(0.5);

  this.game.physics.arcade.enable(this); // set up player physics

  this.body.fixedRotation = true; // no rotation
  // this.body.moves = false;

  this.game.add.existing(this);

  this.direction = 'down';
  this.animations.add('down', [6, 7], 6, true);
  this.animations.add('up', [8, 9], 6, true);
  this.animations.add('right', [4, 11], 6, true);
  this.animations.add('left', [5, 10], 6, true);

};

Actor.prototype = Object.create(Phaser.Sprite.prototype);
Actor.prototype.constructor = Actor;
