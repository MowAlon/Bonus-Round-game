const Board = require('./board')
const Bullet = require('./bullet')


var Game = function(assets) {
  var canvas = document.getElementById('gunner');
  document.addEventListener('keydown', keyPress, true)
  var context = canvas.getContext('2d');
  var startingHealth = 100
  var board = new Board({width: canvas.width,
                          height: canvas.height,
                          gamePane: canvas.width / 7 * 5,
                          infoPane: canvas.width / 7 * 2
                        }, startingHealth)
  function keyPress(button){
    var buttons = {78: [0, 0], 85: [1, 0], 73: [2, 0], 79: [3, 0], 80: [4, 0],
                   81: [0, 1], 87: [1, 1], 69: [2, 1], 82: [3, 1], 86: [4, 1],}
    if (Array.isArray(buttons[button.keyCode])) {
      new Bullet(board, assets, board.lanes[buttons[button.keyCode][0]], board.players[buttons[button.keyCode][1]])
    }
  }

  function gameOver(){
    var deadPlayer = board.players.find(function(player){
      return player.health <= 0
    })
    if (deadPlayer) {return true} else {return false}
  }

  var self = this
  requestAnimationFrame(function gameLoop(){
    self.update(board)
    self.draw(context, board)

    if (gameOver()) {
      self.reset(board, startingHealth)
    }
    requestAnimationFrame(gameLoop)
  })

}

Game.prototype = {
  update: function(board) {
    function clearCollisions(board) {
      if (board.bullets.length > 1) {
        return HandleAllCollisions(board)
      } else {
        return 0
      }
    }

    board.players[0].addPoints(clearCollisions(board))
    var bullets = board.bullets
    for (var i = 0; i < bullets.length; i++) {
      bullets[i].update()
    }
  },

  draw: function(context, board) {
    context.clearRect(0, 0, board.size.width, board.size.height)
    for (var i = 0; i < board.bullets.length; i++) {
      var graphic = board.bullets[i].graphic
      var bullet = board.bullets[i]
      context.drawImage(graphic, bullet.x, bullet.y)
    }

    var middleXOfInfoPane = board.size.gamePane + board.size.infoPane / 2
    context.textAlign = "center"

    context.font = "25px Verdana"
    context.fillText("Score", middleXOfInfoPane, 30)
    context.fillText("Health", middleXOfInfoPane, 250)

    context.font = "50px Verdana"
    context.fillText(board.players[0].score, middleXOfInfoPane, 80)
    context.fillText(board.players[0].health, middleXOfInfoPane, 300)
  },

  reset: function(board, startingHealth) {
    board.bullets = []
    board.players.forEach(function(player){
      player.score = 0
      player.health = startingHealth
    })
  }

}


function HandleAllCollisions(board) {
  var collisionCount = 0
  board.lanes.forEach(function(lane) {
    var upBullet = lane.frontUpBullet()
    var downBullet = lane.frontDownBullet()
    if (opposingBulletsExist(upBullet, downBullet)) {
      if (destroyIfCollided(upBullet, downBullet)) {
        collisionCount++
      }
    }
  })
  return collisionCount
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

module.exports = Game
