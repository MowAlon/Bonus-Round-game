const Board = require('./board')
const Bullet = require('./bullet')

var Game = function(assets, sounds) {
  var canvas = document.getElementById('gunner');
  document.addEventListener('keydown', keyPress)
  document.addEventListener('keydown', pauseGame.bind(null, this))
  var context = canvas.getContext('2d');
  this.shotDelay = 600
  this.paused = false
  this.bombs = {dropTime: timeNow(),
                delayBase: this.shotDelay, //milliseconds
                delayVariance: .7,
                delay: this.shotDelay,
                clusterBase: 6,
                clusterVariance: .5}
  this.bombs.cluster = this.bombs.clusterBase
  var justStarted = true
  var playAgain = false
  var startingHealth = 100
  var board = new Board(this, assets,
                        {width: canvas.width,
                        height: canvas.height,
                        gamePane: canvas.width / 7 * 5,
                        infoPane: canvas.width / 7 * 2},
                        startingHealth)

  function keyPress(button) {
    var buttons = {32: [0, 0], 85: [1, 0], 73: [2, 0], 79: [3, 0], 80: [4, 0],
                   81: [0, 1], 87: [1, 1], 69: [2, 1], 82: [3, 1], 86: [4, 1]}
    if (Array.isArray(buttons[button.keyCode])) {
      var player = board.players[buttons[button.keyCode][1]]
      if (player.pastMinimumWait()) {
        new Bullet(board, assets, board.lanes[buttons[button.keyCode][0]], player, player.shotStyle())
        sounds.bullet.playSound()
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
    if (keyPressed.keyCode === 192) {
      self.paused = !self.paused
      if (self.paused) {
        context.font = 'bold 100px Verdana'
        context.lineWidth = 5
        context.strokeStyle = 'red'
        context.strokeText("PAUSED", board.size.gamePane/2, board.size.height/2)
      }
    }
  }

  this.HandleAllCollisions = function(board) {
    var collisionCount = 0
    board.lanes.forEach(function(lane) {
      var bullets = [lane.frontUpBullet(), lane.frontDownBullet()]
      if (opposingBulletsExist(bullets[0], bullets[1])) {
        if (destroyIfCollided(bullets[0], bullets[1])) {
          sounds.clang.playSound()
          collisionCount++
        }
      } else {
          bullets.forEach(function(bullet) {
            if (bullet && offScreen(bullet)) {
              sounds.explosion.playSound()
              bullet.destroyBullet()
              otherPlayer(bullet.player).reduceHealth(1)
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

  function gameOver(){
    var deadPlayer = board.players.find(function(player){
      return player.health <= 0
    })
    if (deadPlayer) {return true} else {return false}
  }

  function waitForInput(self) {
    self.paused = self.paused || true
    if (justStarted) {self.showStartScreen(context, board)}
    else {self.announceGameOver(context, board)}

    document.addEventListener('keyup', startGame)
  }

  function runGame(context, board) {
    self.update(board)
    self.draw(context, board)
    self.dropBombsTimed(board, assets, sounds)
  }

////////// Game loop //////////
  var self = this
  requestAnimationFrame(function gameLoop(){
    if (!self.paused) {runGame(context, board)}
    if (gameOver() || justStarted) {waitForInput(self)}
    if (playAgain) {
      self.reset(board, startingHealth)
      playAgain = false
      document.removeEventListener('keyup', startGame)
    }

    requestAnimationFrame(gameLoop)
  })
////////// Game loop //////////
}

Game.prototype = {
  update: function(board) {
    self = this
    function collisionCount(board) {
      if (board.bullets.length > 0) {
        return self.HandleAllCollisions(board)
      } else {
        return 0
      }
    }

    board.players[0].addPoints(collisionCount(board))
    var bullets = board.bullets
    for (var i = 0; i < bullets.length; i++) {
      bullets[i].update()
    }
  },

  draw: function(context, board) {
    context.clearRect(0, 0, board.size.width, board.size.height)
    drawBullets(context, board)
    drawCannons(context, board)
    drawTimingMeter(context, board)
    drawInfoPane(context, board)
  },

  dropBombsTimed: function(board, assets, sounds) {
    var computerPlayer = board.players.find(function(player) {
      return player.fireDirection === 'down'
    })
    var laneNumber = Math.floor(Math.random() * board.lanes.length)

    if (timeNow() - this.bombs.dropTime >= this.bombs.delay) {
      new Bullet(board, assets, board.lanes[laneNumber], computerPlayer)
      sounds.bullet.playSound()
      this.bombs.dropTime = timeNow()
      var base = this.bombs.delayBase
      var variance = this.bombs.delayVariance
      this.bombs.delay = base * (1 - variance) + (Math.random() * base * variance * 2)
    }
  },

  dropBombsRandom: function(board, assets, sounds) {
    var computerPlayer = board.players.find(function(player) {
      return player.fireDirection === 'down'
    })
    var laneNumber = Math.floor(Math.random() * board.lanes.length)

    if (Math.random() > 0.97) {
      new Bullet(board, assets, board.lanes[laneNumber], computerPlayer)
      sounds.bullet.playSound()
    }
  },

  announceGameOver: function(context, board) {
    context.clearRect(0, 0, board.size.gamePane, board.size.height)
    var middleXOfGamePane = board.size.gamePane / 2
    context.font = "120px Verdana"
    context.fillText("Game", middleXOfGamePane, board.size.height / 2)
    context.fillText("Over", middleXOfGamePane, board.size.height / 2 + 120)
    context.font = "30px Verdana"
    context.fillText("Fire for another round!", middleXOfGamePane, board.size.height / 2 + 240)
  },

  showStartScreen: function(context, board) {
    context.clearRect(0, 0, board.size.gamePane, board.size.height)
    var centerOfGamePane = {x: board.size.gamePane / 2, y: board.size.height / 2}
    context.font = "120px Verdana"
    context.fillText("Gunner", centerOfGamePane.x, centerOfGamePane.y - 100)
    context.font = "50px Verdana"
    context.fillText("Shoot to start!", centerOfGamePane.x, centerOfGamePane.y + 100)
    context.font = "35px Verdana"
    context.fillText("Fire: SPACE-U-I-O-P", centerOfGamePane.x, centerOfGamePane.y + 370)
  },

  reset: function(board, startingHealth, playAgain) {
    board.bullets = []
    this.paused = false
    board.players.forEach(function(player){
      player.score = 0
      player.health = startingHealth
    })
  }

}


function drawBullets(context, board) {
  for (var i = 0; i < board.bullets.length; i++) {
    var bullet = board.bullets[i]
    var cannonHeight = bullet.player.cannonGraphic.height
    var graphic = bullet.graphic
    if (bullet.player.fireDirection === 'up') {
      drawRotatedImage(context, graphic, bullet.x, bullet.y, 0)
    } else {
      drawRotatedImage(context, graphic, bullet.x, bullet.y, 180)
    }
  }
}

function drawCannons(context, board) {
  for (var playerIndex = 0; playerIndex < board.players.length; playerIndex++) {
    var player = board.players[playerIndex]
    var graphic = player.cannonGraphic

    for (var laneIndex = 0; laneIndex < board.lanes.length; laneIndex++) {
      var lane = board.lanes[laneIndex]
      var graphicX = lane.x - (graphic.width / 2)
      // debugger
      if (player.fireDirection === 'up') {
        var graphicY = board.size.height - graphic.height
        drawRotatedImage(context, graphic, graphicX, graphicY, 0)
      } else {
        drawRotatedImage(context, graphic, graphicX, 0, 180)
      }
    }

  }
}

function drawTimingMeter(context, board) {
  var player = board.players.find(function(player){
    return player.fireDirection === 'up'
  })
  var timeMeterHeight = Math.min(100, (player.timeSinceLastShot() / player.shots.goodDelay) * 100)
  if (timeMeterHeight === 100) {context.fillStyle = 'yellow'}
  context.fillRect(4, board.size.height - timeMeterHeight, 6, timeMeterHeight)
  context.fillStyle = 'black'
}

function drawInfoPane(context, board) {
  var middleXOfInfoPane = board.size.gamePane + board.size.infoPane / 2
  context.textAlign = "center"

  context.font = "25px Verdana"
  context.fillText("Score", middleXOfInfoPane, 30)
  context.fillText("Health", middleXOfInfoPane, 250)

  context.font = "50px Verdana"
  context.fillText(board.players[0].score, middleXOfInfoPane, 80)
  context.fillText(board.players[0].health, middleXOfInfoPane, 300)
}


var TO_RADIANS = Math.PI/180;
function drawRotatedImage(context, image, x, y, angle) {
 	context.save();
 	context.translate(x + image.width/2, y + image.height/2);
 	context.rotate(angle * TO_RADIANS);
	context.drawImage(image, -(image.width/2), -(image.height/2));
	context.restore();
}

function offScreen(bullet) {
  var downBulletOffScreen = (bullet.velocity > 0 && bullet.y >= (bullet.board.size.height - bullet.height))
  var upBulletOffScreen = (bullet.velocity < 0 && bullet.y <= 0)
  return (downBulletOffScreen || upBulletOffScreen)
}

function shotComplete(bullet) {
  return (bullet.distanceAllowed - bullet.distanceTraveled <= 0)
}

function otherPlayer(player){
  return player.board.players.find(function(playerFromCollection){
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
