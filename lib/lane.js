function Lane(board, laneNumber) {
  this.board = board
  var laneWidth = this.board.size.width / board.laneCount
  this.x = (laneNumber * laneWidth) + (laneWidth / 2)
  this.board.lanes.push(this)
}

Lane.prototype = {
  bullets: function(){
    this.board.bullets.filter(function(bullet) {
      return bullet.lane === this
    })
  },

  frontDownBullet: function() {
    this.bullets.filter(function(bullet) {
      return bullet.velocity > 0
    })[0]
  },

  frontUpBullet: function() {
    this.bullets.filter(function(bullet) {
      return bullet.velocity < 0
    })[0]
  }
}

module.exports = Lane
