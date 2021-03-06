function Bullet(board, graphics, lane, player, type) {
  this.board = board
  this.lane = lane
  this.player = player
  this.velocity = velocity(player)
  this.graphic = graphic(graphics, type)
  this.height = this.graphic.height
  this.width = this.graphic.width
  this.x = lane.x - (this.width / 2)
  this.y = startingY(board, player, this.graphic.height, graphics.cannon)
  this.distance = {traveled: 0,
                    bad: 150,
                    good: board.size.height + 100}
  this.distance.allowed = this.distanceAllowed(type)
  this.board.bullets.push(this)
}

Bullet.prototype = {
  update: function() {
    this.y += this.velocity
    this.distance.traveled += Math.abs(this.velocity)
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
  },

  distanceAllowed: function(type) {
    if (type === 'bad') {return this.distance.bad}
    else {return this.distance.good}
  },

  travelComplete: function() {
    return (this.distance.allowed - this.distance.traveled <= 0)
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

function graphic(graphics, type) {
  var style = type || 'good'
  if (style === 'good') { return graphics.bulletBlack}
  else {return graphics.bulletGray}
}

function startingY(board, player, height, cannon) {
  if (player.fireDirection === 'up') {
    return board.size.height - cannon.height
  } else {
    return cannon.height - height
  }
}

module.exports = Bullet
