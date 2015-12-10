function Player(board, direction) {
  this.board = board
  this.fireDirection = direction
  this.y = startingY(board, direction)
  this.health = 100
  this.board.players.push(this)
}

function startingY(board, direction) {
  if (direction === "up") {
    return board.size.height
  } else if (direction === "down") {
    return 0
  }
}

module.exports = Player
