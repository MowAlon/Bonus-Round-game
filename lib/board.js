const Player = require('./player')
const Lane = require('./lane')
const Bullet = require('./bullet')

function Board(game, graphics, size, startingHealth) {
  this.game = game
  this.graphics = graphics
  this.size = {width: size.width,
                height: size.height,
                gamePane: size.gamePane,
                infoPane: size.infoPane
              }
  this.laneCount = 5
  this.lanes = []
  this.bullets = []
  this.players = []
  this.characters = {
    good: [graphics.mario, graphics.luigi, graphics.yoshi, graphics.peach, graphics.toad],
    bad: [graphics.goomba, graphics.evilFlower, graphics.bowser, graphics.footballguy, graphics.koopaTroopa]
  }
  this.addPlayer(graphics, 'up', startingHealth)
  this.addPlayer(graphics, 'down', startingHealth)
  for (var i = 0; i < this.laneCount; i++) {
    this.addLane()
  }
}

Board.prototype = {
  addPlayer: function(graphics, direction, startingHealth) {
    return new Player(this, graphics, direction, startingHealth)
  },

  addLane: function() {
    var laneNumber = this.lanes.length
    return new Lane(this, laneNumber)
  }

}

module.exports = Board
