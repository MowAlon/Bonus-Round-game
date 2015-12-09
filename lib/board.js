const Player = require('./player')
const Lane = require('./lane')
const Bullet = require('./bullet')

function Board() {
  this.canvas = {width: 500, height: 800}
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

Board.prototype.addPlayer = function(direction) {
  return new Player(this, direction)
}

Board.prototype.addLane = function() {
  var laneNumber = this.lanes.length
  return new Lane(this, laneNumber)
}

Board.prototype.addBullet = function(lane, player) {
  return new Bullet(this, lane, player)
}

module.exports = Board
