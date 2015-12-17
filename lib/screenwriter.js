var Screenwriter = function(context, board, assets) {
  this.context = context
  this.board = board
  this.assets = assets
}

Screenwriter.prototype = {
  drawBullets: function() {
    for (var i = 0; i < this.board.bullets.length; i++) {
      var bullet = this.board.bullets[i]
      var graphic = bullet.graphic
      if (bullet.player.fireDirection === 'up') {
        drawRotatedImage(this.context, graphic, bullet.x, bullet.y, 0)
      } else {
        drawRotatedImage(this.context, graphic, bullet.x, bullet.y, 180)
      }
    }
  },

  drawCannons: function(players) {
    for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
      var player = players[playerIndex]
      var graphic = this.board.graphics.cannon

      for (var laneIndex = 0; laneIndex < this.board.lanes.length; laneIndex++) {
        var lane = this.board.lanes[laneIndex]
        var graphicX = lane.x - (graphic.width / 2)
        if (player.fireDirection === 'up') {
          var graphicY = this.board.size.height - graphic.height
          drawRotatedImage(this.context, graphic, graphicX, graphicY, 0)
        } else {
          drawRotatedImage(this.context, graphic, graphicX, 0, 180)
        }
      }

    }
  },

  drawCharacters: function() {
    var goodGuys = this.board.characters.good
    var badGuys = this.board.characters.bad
    goodGuys.forEach(function(character, index) {
      if (character.alive) {
        drawAnimatedImage(character, this.board.lanes[index].x, this.board.size.height - character.height, this.context)
      }
    }, this)
    badGuys.forEach(function(character, index) {
      if (character.alive) {
        drawAnimatedImage(character, this.board.lanes[index].x, 0, this.context)
      }
    }, this)
  },

  drawTimingMeter: function(players) {
    var player = players.find(function(player){
      return player.fireDirection === 'up'
    })
    var timeMeterHeight = Math.min(100, (player.timeSinceLastShot() / player.shots.goodDelay) * 100)
    this.context.fillStyle = 'red'
    if (timeMeterHeight === 100) {this.context.fillStyle = 'lightgreen'}
    this.context.fillRect(4, this.board.size.height - timeMeterHeight, 8, timeMeterHeight)
  },

  drawInfoPane: function(player) {
    var middleXOfInfoPane = this.board.size.gamePane + this.board.size.infoPane / 2
    this.context.fillStyle = "white"
    this.context.strokeStyle = "black"
    this.context.globalAlpha = 0.5
    this.context.fillRect(this.board.size.width - this.board.size.infoPane, 0, this.board.size.infoPane, this.board.size.height)
    this.context.globalAlpha = 1
    this.context.textAlign = "center"

    this.context.lineWidth = 2
    this.context.font = "bold 35px Verdana"
    this.context.fillText("Score", middleXOfInfoPane, 40)
    this.context.strokeText("Score", middleXOfInfoPane, 40)
    this.context.fillText("Health", middleXOfInfoPane, 250)
    this.context.strokeText("Health", middleXOfInfoPane, 250)

    this.context.font = "50px Verdana"
    this.context.fillText(player.score, middleXOfInfoPane, 90)
    this.context.strokeText(player.score, middleXOfInfoPane, 90)
    this.context.fillText(player.health, middleXOfInfoPane, 300)
    this.context.strokeText(player.health, middleXOfInfoPane, 300)
  },

  showStartScreen: function() {
    this.context.clearRect(0, 0, this.board.size.gamePane, this.board.size.height)
    var centerOfGamePane = {x: this.board.size.gamePane / 2, y: this.board.size.height / 2}
    this.context.font = "120px Verdana"
    this.context.fillStyle = "black"
    this.context.fillText("Bonus", centerOfGamePane.x, centerOfGamePane.y - 100)
    this.context.fillText("Round", centerOfGamePane.x, centerOfGamePane.y + 20)
    this.context.font = "50px Verdana"
    this.context.fillText("Press Fire to start!", centerOfGamePane.x, centerOfGamePane.y + 150)
    this.context.fillText("⬛️ ⬛️ ⬛️ ⬛️ ⬛️", centerOfGamePane.x, centerOfGamePane.y + 370)
    this.context.font = "30px Verdana"
    this.context.fillStyle = 'red'
    this.context.fillText("Fire keys:", centerOfGamePane.x, centerOfGamePane.y + 300)
    this.context.font = '20px Verdana'
    this.context.fillStyle = 'white'
    this.context.textAlign = 'left'
    this.context.fillText("Spc       J       K        L         ;", centerOfGamePane.x - 153, centerOfGamePane.y + 357)
    this.context.fillStyle = 'black'
    this.context.textAlign = 'center'
  },

  announceGameOver: function() {
    this.context.clearRect(0, 0, this.board.size.gamePane, this.board.size.height)
    var middleXOfGamePane = this.board.size.gamePane / 2
    this.context.font = "120px Verdana"
    this.context.fillStyle = "red"
    this.context.fillText("Game", middleXOfGamePane, this.board.size.height / 2)
    this.context.fillText("Over", middleXOfGamePane, this.board.size.height / 2 + 120)
    this.context.font = "30px Verdana"
    this.context.fillText("Fire for another round!", middleXOfGamePane, this.board.size.height / 2 + 240)
  }

}

var TO_RADIANS = Math.PI/180
function drawRotatedImage(context, image, x, y, angle) {
 	context.save()
 	context.translate(x + image.width/2, y + image.height/2)
 	context.rotate(angle * TO_RADIANS)
	context.drawImage(image, -(image.width/2), -(image.height/2))
	context.restore()
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

function timeNow() {
  return new Date().getTime()
}

module.exports = Screenwriter
