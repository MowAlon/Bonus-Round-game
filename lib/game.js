const Board = require('./board')
const Player = require('./player')
const Bullet = require('./bullet')
const Screenwriter = require('./screenwriter')
const Listeners = require('./listeners')

var Game = function(canvas, context, assets) {
  this.listeners = new Listeners(this)
  this.listeners.keyPress()
  this.listeners.pauseGame()
  this.context = context
  this.assets = assets
  this.shotDelay = 600
  this.paused = false
  this.bombs = {dropTime: timeNow(),
                delayBase: this.shotDelay, //milliseconds
                delayVariance: 0.7,
                delay: this.shotDelay,
                clusterBase: 6,
                clusterVariance: 0.5}
  this.bombs.cluster = this.bombs.clusterBase
  this.justStarted = true
  this.startingHealth = 10
  this.fireButtons = {32: [0, 0], 74: [1, 0], 75: [2, 0], 76: [3, 0], 186: [4, 0],
                      81: [0, 1], 87: [1, 1], 69: [2, 1], 82: [3, 1], 86: [4, 1]}

  this.board = new Board(this, assets.graphics,
                        {width: canvas.width,
                        height: canvas.height,
                        gamePane: canvas.width / 7 * 5,
                        infoPane: canvas.width / 7 * 2})

  this.screenwriter = new Screenwriter(context, this.board, assets)

  this.players = []
  this.addPlayer('up')
  this.addPlayer('down')

  function waitForInput(self) {
    self.paused = self.paused || true
    if (self.justStarted) {self.screenwriter.showStartScreen()}
    else {self.screenwriter.announceGameOver()}
    self.listeners.startGame()
  }

  function runGame() {
    self.update()
    self.draw()
    self.dropBombsTimed()
    // self.dropBombsRandom(board, assets.graphics, assets.sounds)
  }

////////// Game loop //////////
  var self = this
  requestAnimationFrame(function gameLoop(){
    if (!self.paused) {runGame()}
    if (self.gameOver() || self.justStarted) {
      if (self.gameOver() && assets.sounds.marioGameover.played === false) {
        assets.sounds.marioGameover.playSound()
        assets.sounds.marioGameover.played = true}
      waitForInput(self)
    }

    requestAnimationFrame(gameLoop)
  })
////////// Game loop //////////
}

Game.prototype = {
  addPlayer: function(direction) {
    return new Player(this, direction)
  },

  update: function() {
    var bombsDestroyed = this.board.HandleAllCollisions(this)
    this.players[0].addPoints(bombsDestroyed)
    for (var i = 0; i < this.board.bullets.length; i++) {
      this.board.bullets[i].update()
    }
  },

  draw: function() {
    this.context.clearRect(0, 0, this.board.size.width, this.board.size.height)
    this.screenwriter.drawBullets()
    this.screenwriter.drawCannons(this.players)
    this.screenwriter.drawCharacters()
    this.screenwriter.drawTimingMeter(this.players)
    this.screenwriter.drawInfoPane(this.players[0])
  },

  dropBombsTimed: function() {
    var computerPlayer = this.players.find(function(player) {
      return player.fireDirection === 'down'
    })
    var laneNumber = Math.floor(Math.random() * this.board.lanes.length)

    if (timeNow() - this.bombs.dropTime >= this.bombs.delay) {
      new Bullet(this.board, this.assets.graphics, this.board.lanes[laneNumber], computerPlayer)
      this.assets.sounds.bullet.playSound()
      this.bombs.dropTime = timeNow()
      var base = this.bombs.delayBase
      var variance = this.bombs.delayVariance
      this.bombs.delay = base * (1 - variance) + (Math.random() * base * variance * 2)
    }
  },

  // dropBombsRandom: function(board, graphics, sounds) {
  //   var computerPlayer = this.players.find(function(player) {
  //     return player.fireDirection === 'down'
  //   })
  //   var laneNumber = Math.floor(Math.random() * board.lanes.length)
  //
  //   if (Math.random() > 0.96) {
  //     new Bullet(board, graphics, board.lanes[laneNumber], computerPlayer)
  //     sounds.bullet.playSound()
  //   }
  // },

  gameOver: function() {
    var deadPlayer = this.players.find(function(player){
      return player.health <= 0
    })
    if (deadPlayer) {return true} else {return false}
  },

  reset: function() {
    this.board.bullets = []
    this.paused = false
    this.assets.sounds.marioGameover.played = false
    var characters = this.board.characters.good.concat(this.board.characters.bad)
    characters.forEach(function(lane) {lane.alive = true})
    this.players.forEach(function(player){
      player.score = 0
      player.health = this.startingHealth
    }, this)
  }

}

//////////////////////////////////////////////////////

function firingKeyPressed(fireButtons, keyCode) {
  return Array.isArray(fireButtons[keyCode])
}

function timeNow() {
  return new Date().getTime()
}

module.exports = Game
