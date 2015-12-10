function Bullet(board, lane, player) {
  this.board = board
  this.lane = lane
  // this.player = player
  this.velocity = velocity(player)
  this.graphic = graphic(player)
  var self = this
  this.graphic.onload = function() {
    self.height = self.graphic.naturalHeight
    self.width = self.graphic.naturalWidth
  }
  this.x = lane.x - (this.width / 2)
  this.y = startingY(player, this.graphic.naturalHeight)
  this.board.bullets.push(this)
}

Bullet.prototype = {
  update: function() {
    this.y += this.velocity
    if (this.y > this.board.size.height || this.y < 0 - this.graphic.naturalHeight) {
      destroyBullet(this)
    }
  },
  headY: function() {
    if (this.velocity < 0) {
      return this.y
    } else {
      return this.y + this.height
    }
  }
}

function velocity(player) {
  var speed = 6
  if (player.fireDirection === 'up') {
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

function startingY(player, height) {
  if (player.fireDirection === 'up') {
    return player.board.size.height
  } else {
    return -height
  }
}

function destroyBullet(deadBullet) {
  deadBullet.board.bullets = deadBullet.board.bullets.filter( function(bullet) {
    return bullet !== deadBullet
  })
}

module.exports = Bullet
