function Player(board, assets, direction, startingHealth) {
  this.board = board
  this.cannonGraphic = assets.cannon
  this.fireDirection = direction
  this.score = 0
  this.health = startingHealth
  this.board.players.push(this)
  this.shots = {shootTime: 0,
                delayBase: 300, //milliseconds
                delayVariance: .7}
  this.shots.delay = this.shots.delayBase
}

module.exports = Player

Player.prototype = {
  addPoints: function(points) {
    this.score = this.score + points
  },

  reduceHealth: function(hitPoints) {
    this.health -= hitPoints
  }
}
