const Lane = require('./lane')

function Board(game, graphics, size) {
  this.game = game
  this.graphics = graphics
  this.size = {width: size.width,
                height: size.height,
                gamePane: size.gamePane,
                infoPane: size.infoPane}
  this.laneCount = 5
  this.lanes = []
  this.bullets = []
  this.characters = {
    good: [graphics.mario, graphics.luigi, graphics.yoshi, graphics.peach, graphics.toad],
    bad: [graphics.goomba, graphics.evilFlower, graphics.bowser, graphics.footballguy, graphics.koopaTroopa]
  }
  for (var i = 0; i < this.laneCount; i++) {
    this.addLane()
  }
}

Board.prototype = {
  addLane: function() {
    var laneNumber = this.lanes.length
    return new Lane(this, laneNumber)
  },

  playerBullets: function() {
    return this.bullets.filter(function(bullet) {
      return bullet.velocity < 0
    })
  }
}

module.exports = Board
