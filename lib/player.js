function Player(board, direction, startingHealth) {
  this.board = board
  this.fireDirection = direction
  this.score = 0
  this.health = startingHealth
  this.board.players.push(this)
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
