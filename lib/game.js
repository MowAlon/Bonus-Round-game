const Board = require('./board')
const Bullet = require('./bullet')


var Game = function(assets) {
  var canvas = document.getElementById('gunner');
  document.addEventListener('keydown', keyPress, true)
  var context = canvas.getContext('2d');
  var board = new Board({width: canvas.width, height: canvas.height})

  function keyPress(button){
    var buttons = {78: [0, 0], 85: [1, 0], 73: [2, 0], 79: [3, 0], 80: [4, 0],
                   81: [0, 1], 87: [1, 1], 69: [2, 1], 82: [3, 1], 86: [4, 1],}
    if (Array.isArray(buttons[button.keyCode])) {
      new Bullet(board, assets, board.lanes[buttons[button.keyCode][0]], board.players[buttons[button.keyCode][1]])
    };
  };

  var self = this

  requestAnimationFrame(function gameLoop(){
    self.update(board)
    self.draw(context, board)

    requestAnimationFrame(gameLoop)
  })

}

Game.prototype = {
  update: function(board) {
    function clearCollisions(board) {
      if (board.bullets.length > 1) {
        HandleAllCollisions(board)
      }
    }

    clearCollisions(board)
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
  }

}


function HandleAllCollisions(board) {
  board.lanes.forEach(function(lane) {
    var upBullet = lane.frontUpBullet()
    var downBullet = lane.frontDownBullet()
    if (opposingBulletsExist(upBullet, downBullet)) {
      checkTwoBulletsForCollision(upBullet, downBullet)
    }
  })
}

function opposingBulletsExist(upBullet, downBullet) {
  return (upBullet !== undefined && downBullet !== undefined)
}

function checkTwoBulletsForCollision(upBullet, downBullet) {
  if (bodiesCollide(upBullet, downBullet)) {
    destroyBullets([upBullet, downBullet])
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
