const Player = require('./player')
const Lane = require('./lane')
const Bullet = require('./bullet')

function Board(game, graphics, size, startingHealth) {
  this.game = game
  this.size = {width: size.width,
                height: size.height,
                gamePane: size.gamePane,
                infoPane: size.infoPane
              }
  this.laneCount = 5
  this.lanes = []
  this.bullets = []
  this.players = []
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
  },

  addBullet: function(lane, player) {
    // return new Bullet(this, lane, player)
  },

}

module.exports = Board
