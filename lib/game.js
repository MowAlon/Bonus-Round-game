const Board = require('./board')
const Player = require('./player')
const Bullet = require('./bullet')

var Game = function(assets, canvas, context) {
  document.addEventListener('keydown', keyPress.bind(null, this))
  document.addEventListener('keydown', pauseGame.bind(null, this))
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
  var startingHealth = 10
  this.fireButtons = {32: [0, 0], 74: [1, 0], 75: [2, 0], 76: [3, 0], 186: [4, 0],
                      81: [0, 1], 87: [1, 1], 69: [2, 1], 82: [3, 1], 86: [4, 1]}

  this.board = new Board(this, assets.graphics,
                        {width: canvas.width,
                        height: canvas.height,
                        gamePane: canvas.width / 7 * 5,
                        infoPane: canvas.width / 7 * 2},
                        startingHealth)

  this.players = []
  this.addPlayer('up', startingHealth, this.shotDelay)
  this.addPlayer('down', startingHealth, this.shotDelay)

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

  this.HandleAllCollisions = function(board) {
    var collisionCount = 0
    self = this
    board.lanes.forEach(function(lane) {
      var bullets = [lane.frontUpBullet(), lane.frontDownBullet()]
      if (opposingBulletsExist(bullets[0], bullets[1])) {
        if (destroyIfCollided(bullets[0], bullets[1])) {
          assets.sounds.bulletsCollide.playSound()
          collisionCount++
        }
      } else {
          bullets.forEach(function(bullet) {
            if (bullet && offScreen(bullet)) {
              assets.sounds.explosion.playSound()
              bullet.destroyBullet()

              var laneNumber = board.lanes.indexOf(bullet.lane)
              var goodGuy = board.characters.good[laneNumber]
              var badGuy = board.characters.bad[laneNumber]
              if (bullet.velocity > 0) {
                if (goodGuy.alive) {
                  goodGuy.alive = false
                  otherPlayer(self, bullet.player).reduceHealth(2)
                  assets.sounds.marioMamamia.playSound()
                } else {
                  otherPlayer(self, bullet.player).reduceHealth(1)
                }
              } else {
                if (badGuy.alive) {
                  badGuy.alive = false
                  bullet.player.score += 50
                  assets.sounds.marioYippee.playSound()
                } else {
                  bullet.player.score += 20
                  assets.sounds.marioHappy.playSound()
                }
              }
            }
          })
      }
    })
    var playerBullets = board.bullets.filter(function(bullet) {
      return bullet.velocity < 0
    })
    playerBullets.forEach(function(bullet) {

      if (bullet.distance.allowed - bullet.distance.traveled <= 0) {
        bullet.destroyBullet()
      }
    })
    return collisionCount
  }

  function waitForInput(self) {
    self.paused = self.paused || true
    if (justStarted) {self.showStartScreen(context, self.board)}
    else {self.announceGameOver(context, self.board)}

    document.addEventListener('keyup', startGame)
  }

  function runGame(context, board) {
    self.update(board)
    self.draw(context, board)
    self.dropBombsTimed(board, assets.graphics, assets.sounds)
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
      self.reset(self.board, startingHealth)
      playAgain = false
      document.removeEventListener('keyup', startGame)
    }

    requestAnimationFrame(gameLoop)
  })
////////// Game loop //////////
}

Game.prototype = {
  addPlayer: function(direction, startingHealth) {
    return new Player(this, direction, startingHealth)
  },

  update: function(board) {
    var self = this
    function collisionCount(board) {
      if (board.bullets.length > 0) {
        return self.HandleAllCollisions(board)
      } else {
        return 0
      }
    }

    this.players[0].addPoints(collisionCount(board))
    var bullets = board.bullets
    for (var i = 0; i < bullets.length; i++) {
      bullets[i].update()
    }
  },

  draw: function(context, board) {
    context.clearRect(0, 0, board.size.width, board.size.height)
    drawBullets(context, board)
    drawCannons(this, context, board)
    drawCharacters(context, board)
    drawTimingMeter(this, context, board)
    drawInfoPane(this, context, board)
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
  //   if (Math.random() > 0.97) {
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

  announceGameOver: function(context, board) {
    context.clearRect(0, 0, board.size.gamePane, board.size.height)
    var middleXOfGamePane = board.size.gamePane / 2
    context.font = "120px Verdana"
    context.fillStyle = "red"
    context.fillText("Game", middleXOfGamePane, board.size.height / 2)
    context.fillText("Over", middleXOfGamePane, board.size.height / 2 + 120)
    context.font = "30px Verdana"
    context.fillText("Fire for another round!", middleXOfGamePane, board.size.height / 2 + 240)
  },

  showStartScreen: function(context, board) {
    context.clearRect(0, 0, board.size.gamePane, board.size.height)
    var centerOfGamePane = {x: board.size.gamePane / 2, y: board.size.height / 2}
    context.font = "120px Verdana"
    context.fillStyle = "black"
    context.fillText("Bonus", centerOfGamePane.x, centerOfGamePane.y - 100)
    context.fillText("Round", centerOfGamePane.x, centerOfGamePane.y + 20)
    context.font = "50px Verdana"
    context.fillText("Shoot to start!", centerOfGamePane.x, centerOfGamePane.y + 150)
    context.fillText("⬛️ ⬛️ ⬛️ ⬛️ ⬛️", centerOfGamePane.x, centerOfGamePane.y + 370)
    context.font = "30px Verdana"
    context.fillStyle = 'red'
    context.fillText("Fire keys:", centerOfGamePane.x, centerOfGamePane.y + 300)
    context.font = '20px Verdana'
    context.fillStyle = 'white'
    context.textAlign = 'left'
    context.fillText("Spc       J       K        L         ;", centerOfGamePane.x - 153, centerOfGamePane.y + 357)
    context.fillStyle = 'black'
    context.textAlign = 'center'
  },

  reset: function(board, startingHealth) {
    board.bullets = []
    this.paused = false
    this.assets.sounds.marioGameover.played = false
    var characters = board.characters.good.concat(board.characters.bad)
    characters.forEach(function(lane) {
      lane.alive = true
    })
    this.players.forEach(function(player){
      player.score = 0
      player.health = startingHealth
    })
  }

}

//////////////////////////////////////////////////////

function firingKeyPressed(fireButtons, keyCode) {
  return Array.isArray(fireButtons[keyCode])
}

function drawBullets(context, board) {
  for (var i = 0; i < board.bullets.length; i++) {
    var bullet = board.bullets[i]
    var graphic = bullet.graphic
    if (bullet.player.fireDirection === 'up') {
      drawRotatedImage(context, graphic, bullet.x, bullet.y, 0)
    } else {
      drawRotatedImage(context, graphic, bullet.x, bullet.y, 180)
    }
  }
}

function drawCannons(self, context, board) {
  for (var playerIndex = 0; playerIndex < self.players.length; playerIndex++) {
    var player = self.players[playerIndex]
    var graphic = board.graphics.cannon

    for (var laneIndex = 0; laneIndex < board.lanes.length; laneIndex++) {
      var lane = board.lanes[laneIndex]
      var graphicX = lane.x - (graphic.width / 2)
      if (player.fireDirection === 'up') {
        var graphicY = board.size.height - graphic.height
        drawRotatedImage(context, graphic, graphicX, graphicY, 0)
      } else {
        drawRotatedImage(context, graphic, graphicX, 0, 180)
      }
    }

  }
}

function drawCharacters(context, board) {
  var goodGuys = board.characters.good
  var badGuys = board.characters.bad
  goodGuys.forEach(function(character, index) {
    if (character.alive) {
      drawAnimatedImage(character, board.lanes[index].x, board.size.height - character.height, context)
    }
  })
  badGuys.forEach(function(character, index) {
    if (character.alive) {
      drawAnimatedImage(character, board.lanes[index].x, 0, context)
    }
  })
}

function drawTimingMeter(self, context, board) {
  var player = self.players.find(function(player){
    return player.fireDirection === 'up'
  })
  var timeMeterHeight = Math.min(100, (player.timeSinceLastShot() / player.shots.goodDelay) * 100)
  if (timeMeterHeight === 100) {context.fillStyle = 'lightgreen'}
  context.fillRect(4, board.size.height - timeMeterHeight, 8, timeMeterHeight)
  context.fillStyle = 'black'
}

function drawInfoPane(self, context, board) {
  var middleXOfInfoPane = board.size.gamePane + board.size.infoPane / 2
  context.fillStyle = "white"
  context.strokeStyle = "black"
  context.globalAlpha = 0.5
  context.fillRect(board.size.width - board.size.infoPane, 0, board.size.infoPane, board.size.height)
  context.globalAlpha = 1
  context.textAlign = "center"

  context.lineWidth = 2
  context.font = "bold 35px Verdana"
  context.fillText("Score", middleXOfInfoPane, 40)
  context.strokeText("Score", middleXOfInfoPane, 40)
  context.fillText("Health", middleXOfInfoPane, 250)
  context.strokeText("Health", middleXOfInfoPane, 250)

  context.font = "50px Verdana"
  context.fillText(self.players[0].score, middleXOfInfoPane, 90)
  context.strokeText(self.players[0].score, middleXOfInfoPane, 90)
  context.fillText(self.players[0].health, middleXOfInfoPane, 300)
  context.strokeText(self.players[0].health, middleXOfInfoPane, 300)
}


var TO_RADIANS = Math.PI/180;
function drawRotatedImage(context, image, x, y, angle) {
 	context.save();
 	context.translate(x + image.width/2, y + image.height/2);
 	context.rotate(angle * TO_RADIANS);
	context.drawImage(image, -(image.width/2), -(image.height/2));
	context.restore();
}

function drawAnimatedImage(graphic, x, y, context) {
  var spriteWidth = spriteWidth || graphic.width/graphic.frames
  x = x - spriteWidth/2 || 0
  y = y || 0
  context.drawImage(graphic,
               // source rectangle
               graphic.cycle * spriteWidth, 0, spriteWidth, graphic.height,
               // destination rectangle
               x,               y, spriteWidth, graphic.height)
  if (timeNow() - graphic.lastAnimationTime >= graphic.frameInterval) {
    graphic.cycle = (graphic.cycle + 1) % graphic.frames
    graphic.lastAnimationTime = timeNow()
  }
}

function offScreen(bullet) {
  var downBulletOffScreen = (bullet.velocity > 0 && bullet.y >= (bullet.board.size.height - bullet.height))
  var upBulletOffScreen = (bullet.velocity < 0 && bullet.y <= 0)
  return (downBulletOffScreen || upBulletOffScreen)
}

function otherPlayer(self, player){
  return self.players.find(function(playerFromCollection){
    return playerFromCollection !== player
  })
}

function opposingBulletsExist(upBullet, downBullet) {
  return (upBullet !== undefined && downBullet !== undefined)
}

function destroyIfCollided(upBullet, downBullet) {
  if (bodiesCollide(upBullet, downBullet)) {
    destroyBullets([upBullet, downBullet])
    return true
  }
}

function bodiesCollide(upBullet, downBullet) {
  return upBullet.headY() < downBullet.headY()
}

function destroyBullets(bullets) {
  bullets.forEach(function(bullet){
    bullet.destroyBullet()
  })
}

function timeNow() {
  return new Date().getTime()
}

module.exports = Game
