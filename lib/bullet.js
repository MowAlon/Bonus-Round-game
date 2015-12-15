function Bullet(board, assets, lane, player, shootDistance) {
  this.board = board
  this.lane = lane
  this.player = player
  this.velocity = velocity(player)
  this.graphic = assets.bullet
  this.height = this.graphic.height
  this.width = this.graphic.width
  this.x = lane.x - (this.width / 2)
  this.y = startingY(player, this.graphic.height)
  this.distanceAllowed = shootDistance || board.size.height + 100
  this.distanceTraveled = 0
  this.board.bullets.push(this)
}

Bullet.prototype = {
  update: function() {
    self = this
    this.y += this.velocity
    this.distanceTraveled += Math.abs(this.velocity)
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

function graphic(assets, player) {
  if (player.fireDirection === 'up') { return assets.bulletUp}
  else {return assets.bulletDown}
}

function startingY(player, height) {
  if (player.fireDirection === 'up') {
    return player.board.size.height - player.cannonGraphic.height
  } else {
    return -height + player.cannonGraphic.height
  }
}

module.exports = Bullet
