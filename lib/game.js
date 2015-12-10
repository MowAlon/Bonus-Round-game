const Board = require('./board')
const Bullet = require('./bullet')

var Game = function() {
  var canvas = document.getElementById('gunner');
  var buttons = {78: [0, 0], 85: [1, 0], 73: [2, 0], 79: [3, 0], 80: [4, 0],
                 81: [0, 1], 87: [1, 1], 69: [2, 1], 82: [3, 1], 86: [4, 1],}



  var context = canvas.getContext('2d');
  var board = new Board({width: canvas.width, height: canvas.height})

  var self = this
  requestAnimationFrame(function gameLoop(){
    self.update(board)
    self.draw(context, board)

    document.onkeydown = function(button) {
      if (Array.isArray(buttons[button.keyCode])) {
        new Bullet(board, board.lanes[buttons[button.keyCode][0]], board.players[buttons[button.keyCode][1]])
      }
    }

    requestAnimationFrame(gameLoop)
  })

}

Game.prototype = {
  update: function(board) {
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
  },

//   buttonPress: function(button){
// console.log("test")
//     //SPACE, U, I, O, P
//     var buttons = {32: 0, x: 1, y: 2, z: 3, a: 4}
//     new Bullet(board, board.lanes[buttons[button.keyCode]], board.players[0])
//   }
}

module.exports = Game
