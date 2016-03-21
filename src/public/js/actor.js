var Actor = function(game, map, tilex, tiley, image, frame) {
  this.game = game;
  this.map = map;

  this.isMoving = false;


  // console.log('details',this.game, x, y, image);
  Phaser.Sprite.call(this, this.game, tilex*32, tiley*32, image);
  this.frame = frame;


  this.marker = new Phaser.Point(tilex,tiley);
  // this.anchor.setTo(0.5);

  this.game.physics.arcade.enable(this); // set up player physics

  this.body.fixedRotation = true; // no rotation
  this.body.moves = false;
  // this.body.moves = false;

  this.game.add.existing(this);

  this.direction = 'down';
  // this.animations.add('down', [6, 7], 6, true);
  // this.animations.add('up', [8, 9], 6, true);
  // this.animations.add('right', [4, 11], 6, true);
  // this.animations.add('left', [5, 10], 6, true);

};

Actor.prototype = Object.create(Phaser.Sprite.prototype);
// Actor.prototype.update = function() {
//   if (!this.isMoving) {
//       if (this.direction === 'up') {
//         this.frame = 1;
//       }
//       else if (this.direction === 'down') {
//         this.frame = 0;
//       }
//       else if (this.direction === 'right') {
//         this.frame = 2;
//       }
//       else if (this.direction === 'left') {
//         this.frame = 3;
//       }
//       this.animations.stop();
//   }
//
// };
Actor.prototype.moveTo = function(x,y) {
  if (this.isMoving || this.cantMove(x, y)) {return;}
  this.isMoving = true;

  this.game.add.tween(this).to({x: this.x + x*32, y: this.y + y*32}, 120, Phaser.Easing.Linear.None, true).onComplete.add(function() {
      this.marker.x += x;
      this.marker.y += y;
      this.isMoving = false;

    },this); 


};
Actor.prototype.cantMove = function(x,y) {
  if (this.inCombat) {return true;}

  var newx = this.marker.x + x;
  var newy = this.marker.y + y;

  var tile1 = this.map.getTile(newx, newy, 0); 

  //Block Moving onto a non-existent tile
  if (tile1 === null) {
    return true;
  }

  //Block Layer 1 Collisions
  if (this.map.getTile(newx, newy, 0).collideDown) {
    return true;
  }

  // //Block Layer 2 Collisions if applicable
  // if (this.map.getTile(newx, newy, 1) !== null) {
  //   return this.map.getTile(newx, newy, 1).collideDown;
  // }
  // return false;

};

Actor.prototype.constructor = Actor;
