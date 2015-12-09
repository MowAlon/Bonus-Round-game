function Bullet(board, lane, player) {
  this.board = board
  this.lane = lane
  this.player = player
  this.x = lane.x
  this.y = player.y
  this.board.bullets.push(this)
}

module.exports = Bullet
