const Board = require('./board')
const Player = require('./player')
const Bullet = require('./bullet')
const Screenwriter = require('./screenwriter')

var Game = function(canvas, context, assets) {
  document.addEventListener('keydown', keyPress.bind(null, this))
  document.addEventListener('keydown', pauseGame.bind(null, this))
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
  var justStarted = true
  var playAgain = false
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

  function keyPress(self, button) {
    if (firingKeyPressed(self.fireButtons, button.keyCode)) {
      var player = self.players[self.fireButtons[button.keyCode][1]]
      if (player.pastMinimumWait()) {
        new Bullet(self.board, assets.graphics, self.board.lanes[self.fireButtons[button.keyCode][0]], player, player.shotStyle())
        if (!self.paused && !self.gameOver()) {assets.sounds.bullet.playSound()}
        player.shots.shootTime = timeNow()
      }
    }
  }

  function startGame(keyPressed) {
    // Enter key is keyCode 13
    var fireKeys = [32, 85, 73, 79, 80]
    if (fireKeys.indexOf(keyPressed.keyCode) > -1) {
      playAgain = true
      justStarted = false
    }
  }

  function pauseGame(self, keyPressed) {
    // ~/` (tilda/backtick) is keyCode 192
    if (keyPressed.keyCode === 192 && !justStarted && !self.gameOver()) {
      self.paused = !self.paused
      assets.sounds.pause.playSound()
      if (self.paused) {
        context.font = 'bold 100px Verdana'
        context.lineWidth = 5
        context.strokeStyle = 'red'
        context.strokeText("PAUSED", self.board.size.gamePane/2, self.board.size.height/2)
      }
    }
  }

  function waitForInput(self) {
    self.paused = self.paused || true
    if (justStarted) {self.screenwriter.showStartScreen()}
    else {self.screenwriter.announceGameOver()}
    document.addEventListener('keyup', startGame)
  }

  function runGame(context, board) {
    self.update()
    self.draw()
    self.dropBombsTimed(board, assets.graphics, assets.sounds)
    // self.dropBombsRandom(board, assets.graphics, assets.sounds)
  }

////////// Game loop //////////
  var self = this
  requestAnimationFrame(function gameLoop(){
    if (!self.paused) {runGame(context, self.board)}
    if (self.gameOver() || justStarted) {
      if (self.gameOver() && assets.sounds.marioGameover.played === false) {
        assets.sounds.marioGameover.playSound()
        assets.sounds.marioGameover.played = true}
      waitForInput(self)
    }
    if (playAgain) {
      self.reset()
      playAgain = false
      document.removeEventListener('keyup', startGame)
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

  dropBombsTimed: function(board, graphics, sounds) {
    var computerPlayer = this.players.find(function(player) {
      return player.fireDirection === 'down'
    })
    var laneNumber = Math.floor(Math.random() * board.lanes.length)

    if (timeNow() - this.bombs.dropTime >= this.bombs.delay) {
      new Bullet(board, graphics, board.lanes[laneNumber], computerPlayer)
      sounds.bullet.playSound()
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
