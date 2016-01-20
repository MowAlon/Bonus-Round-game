const Bullet = require('./bullet')
const $ = require('jquery')

var Listeners = function(game) {
  this.game = game
}

Listeners.prototype = {
  keyPress: function() {
    document.addEventListener('keydown', keyPress.bind(null, this.game))
  },

  pauseGame: function() {
    document.addEventListener('keydown', pauseGame.bind(null, this.game))
  },

  startGame: function() {
    $(document).one("keyup", startGame.bind(null, this.game))
  }

}

function startGame(game, keyPressed) {
  // Enter key is keyCode 13
  var fireKeys = [32, 74, 75, 76, 186]
  if (fireKeys.indexOf(keyPressed.keyCode) > -1) {
    game.reset()
    game.justStarted = false
  }
}

function keyPress(game, button) {
  if (firingKeyPressed(game.fireButtons, button.keyCode)) {
    var player = game.players[game.fireButtons[button.keyCode][1]]
    if (player.pastMinimumWait()) {
      new Bullet(game.board, game.assets.graphics, game.board.lanes[game.fireButtons[button.keyCode][0]], player, player.shotStyle())
      if (!game.paused && !game.gameOver()) {game.assets.sounds.bullet.playSound()}
      player.shots.shootTime = timeNow()
    }
  }
}

function firingKeyPressed(fireButtons, keyCode) {
  return Array.isArray(fireButtons[keyCode])
}

function pauseGame(game, keyPressed) {
  // ~/` (tilda/backtick) is keyCode 192
  if (keyPressed.keyCode === 192 && !game.justStarted && !game.gameOver()) {
    game.paused = !game.paused
    game.assets.sounds.pause.playSound()
    if (game.paused) {
      game.context.font = 'bold 100px Bangers'
      game.context.lineWidth = 5
      game.context.strokeStyle = 'red'
      game.context.strokeText("PAUSED", game.board.size.gamePane/2, game.board.size.height/2)
    }
  }
}

function timeNow() {
  return new Date().getTime()
}

module.exports = Listeners
