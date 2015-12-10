function Bullet(board, lane, player) {
  this.board = board
  // this.lane = lane
  // this.player = player
  this.velocity = velocity(player)
  this.graphic = graphic(player)
  var self = this
  this.graphic.onload = function() {self.x = lane.x - (self.graphic.naturalWidth / 2);}
  this.y = player.y
  this.board.bullets.push(this)
}

function velocity(player) {
  var speed = 6
  if (player.fireDirection = 'up') {
    return -speed
  } else {
    return speed
  }
}

function graphic(player) {
  var image = new Image()
  image.src = '../graphics/bullet_' + player.fireDirection + '.gif'
  return image
}

Bullet.prototype = {
  update: function(){
    this.y += this.velocity
    if (this.y > this.board.size.height || this.y < 0 - this.graphic.naturalHeight) {
      destroyBullet(this)
    }
  }
}

function destroyBullet(deadBullet) {
  deadBullet.board.bullets = deadBullet.board.bullets.filter( function(bullet) {
    return bullet !== deadBullet
  })
}

module.exports = Bullet
