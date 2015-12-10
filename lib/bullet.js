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
    self.x = lane.x - (self.width / 2)
    self.y = startingY(player, self.graphic.naturalHeight)
  }
  this.board.bullets.push(this)
}

Bullet.prototype = {
  update: function() {
    this.y += this.velocity
    if (this.y > this.board.size.height || this.y < 0 - this.graphic.naturalHeight) {
      this.destroyBullet()
    }
  },
  headY: function() {
    if (this.velocity < 0) {
      return this.y
    } else {
      return this.y + this.height
    }
  },
  destroyBullet: function() {
    this.board.bullets = this.board.bullets.filter( function(bullet) {
      return bullet !== this
    }, this)
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

module.exports = Bullet
