const Player = require('./player')
const Lane = require('./lane')
const Bullet = require('./bullet')

function Board(size) {
  this.size = {width: size.width,
                height: size.height,
                gamePane: size.gamePane,
                infoPane: size.infoPane
              }
  this.laneCount = 5
  this.lanes = []
  this.bullets = []
  this.players = []
  this.addPlayer('up')
  this.addPlayer('down')
  for (var i = 0; i < this.laneCount; i++) {
    this.addLane()
  }
}

Board.prototype = {
  addPlayer: function(direction) {
    return new Player(this, direction)
  },

  addLane: function() {
    var laneNumber = this.lanes.length
    return new Lane(this, laneNumber)
  },

  addBullet: function(lane, player) {
    return new Bullet(this, lane, player)
  },

}

module.exports = Board
