function Lane(board, laneNumber) {
  this.board = board
  var laneWidth = this.board.size.gamePane / board.laneCount
  this.x = (laneNumber * laneWidth) + (laneWidth / 2)
  this.board.lanes.push(this)
}

Lane.prototype = {
  bullets: function(){
    return this.board.bullets.filter(function(bullet) {
      return bullet.lane.x === this.x
    }, this)
  },

  frontDownBullet: function() {
    return this.bullets().find(function(bullet) {
      return bullet.velocity > 0
    })
  },

  frontUpBullet: function() {
    return this.bullets().find(function(bullet) {
      return bullet.velocity < 0
    })
  }
}

module.exports = Lane
