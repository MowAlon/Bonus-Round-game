function Lane(board, laneNumber) {
  this.board = board
  var laneWidth = this.board.size.gamePane / board.laneCount
  this.x = (laneNumber * laneWidth) + (laneWidth / 2)
  this.alive = true
  this.board.lanes.push(this)
}

Lane.prototype = {
  bullets: function(){
    // console.log(this)
    self = this
    return this.board.bullets.filter(function(bullet) {
      return bullet.lane.x === self.x
    })
  },

  frontDownBullet: function() {
    // console.log(this)
    return this.bullets().filter(function(bullet) {
      return bullet.velocity > 0
    })[0]
  },

  frontUpBullet: function() {
    return this.bullets().filter(function(bullet) {
      return bullet.velocity < 0
    })[0]
  }
}

module.exports = Lane
