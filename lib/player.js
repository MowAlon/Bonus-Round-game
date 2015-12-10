function Player(board, direction) {
  this.board = board
  this.fireDirection = direction
  this.health = 100
  this.board.players.push(this)
}

module.exports = Player
