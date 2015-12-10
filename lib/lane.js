function Lane(board, laneNumber) {
  this.board = board
  var laneWidth = this.board.size.width / board.laneCount
  this.x = (laneNumber * laneWidth) + (laneWidth / 2)
  this.board.lanes.push(this)
}

module.exports = Lane
