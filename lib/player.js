function Player(board, assets, direction, startingHealth) {
  this.board = board
  this.cannonGraphic = assets.cannon
  this.fireDirection = direction
  this.score = 0
  this.health = startingHealth
  this.board.players.push(this)
  this.shots = {shootTime: 0,
                minimumDelay: 150}
  this.shots.goodDelay = this.shots.minimumDelay * 2
}

module.exports = Player

Player.prototype = {
  addPoints: function(points) {
    this.score = this.score + points
  },

  reduceHealth: function(hitPoints) {
    this.health -= hitPoints
  },

  shotStyle: function() {
    if (timeNow() - this.shots.shootTime < this.shots.goodDelay) {
      return 'bad'
    }
      else {return 'good'}
  },

  timeSinceLastShot: function() {
    return (timeNow() - this.shots.shootTime)
  },

  pastMinimumWait: function() {
    return (this.timeSinceLastShot() >= this.shots.minimumDelay)
  }
}

function timeNow() {
  return new Date().getTime()
}
