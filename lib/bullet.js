function Bullet(board, assets, lane, player) {
  this.board = board
  this.lane = lane
  this.player = player
  this.velocity = velocity(player)
  this.graphic = graphic(assets, player)
  this.height = this.graphic.naturalHeight
  this.width = this.graphic.naturalWidth
  this.x = lane.x - (this.width / 2)
  this.y = startingY(player, this.graphic.naturalHeight)
  this.board.bullets.push(this)
}

Bullet.prototype = {
  update: function() {
    self = this
    function offScreen(){
      return (self.y > self.board.size.height || self.y < 0 - self.graphic.naturalHeight)
    }

    function otherPlayer(player){
      return self.board.players.find(function(playerFromCollection){
        return playerFromCollection !== player
      })
    }

    this.y += this.velocity
    if (offScreen()) {
      this.destroyBullet()
      otherPlayer(this.player).reduceHealth(1)
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

function graphic(assets, player) {
  if (player.fireDirection === 'up') { return assets.bulletUp}
  else {return assets.bulletDown}
}

function startingY(player, height) {
  if (player.fireDirection === 'up') {
    return player.board.size.height
  } else {
    return -height
  }
}

module.exports = Bullet
