const Board = require('./board')

var Game = function() {
  var canvas = document.getElementById('gunner');
  var context = canvas.getContext('2d');
  var board = new Board({width: canvas.width, height: canvas.height})


////////////////
const Bullet = require('./bullet')
new Bullet(board, board.lanes[0], board.players[0])
////////////////

  var self = this
  requestAnimationFrame(function gameLoop(){
    self.update(board)
    self.draw(context, board)

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
  }
}

module.exports = Game
