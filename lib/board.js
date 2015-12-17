const Lane = require('./lane')

function Board(game, graphics, size) {
  this.game = game
  this.graphics = graphics
  this.size = {width: size.width,
                height: size.height,
                gamePane: size.gamePane,
                infoPane: size.infoPane}
  this.laneCount = 5
  this.lanes = []
  this.bullets = []
  this.characters = {
    good: [graphics.mario, graphics.luigi, graphics.yoshi, graphics.peach, graphics.toad],
    bad: [graphics.goomba, graphics.evilFlower, graphics.bowser, graphics.footballguy, graphics.koopaTroopa]
  }
  for (var i = 0; i < this.laneCount; i++) {
    this.addLane()
  }
}

Board.prototype = {
  addLane: function() {
    var laneNumber = this.lanes.length
    return new Lane(this, laneNumber)
  },

  playerBullets: function() {
    return this.bullets.filter(function(bullet) {
      return bullet.velocity < 0
    })
  },

  HandleAllCollisions: function(game) {
    var bombsDestroyed = clearHeadBullets(game, this)
    clearShortBullets(this.playerBullets())
    return bombsDestroyed
  }
}

////////////////////////////////////////////
////////////////////////////////////////////

function clearHeadBullets(game, self) {
  var bombsDestroyed = 0
  self.lanes.forEach(function(lane) {
    var headBullets = [lane.frontUpBullet(), lane.frontDownBullet()]
    if (removeCollidingBullets(headBullets)) {
      game.assets.sounds.bulletsCollide.playSound()
      bombsDestroyed++
    }
    clearOffScreenBullets(game, headBullets)
  })
  return bombsDestroyed
}

function clearOffScreenBullets(game, bullets) {
  bullets.forEach(function(bullet) {
    if (bullet && offScreen(bullet)) {
      var laneNumber = game.board.lanes.indexOf(bullet.lane)
      var goodGuy = game.board.characters.good[laneNumber]
      var badGuy = game.board.characters.bad[laneNumber]

      game.assets.sounds.explosion.playSound()
      bullet.destroyBullet()
      if (bullet.velocity > 0) {
        goodGuyHit(game, bullet, goodGuy)
      } else {
        badGuyHit(game, bullet, badGuy)
      }
    }
  })
}

function clearShortBullets(playerBullets) {
  playerBullets.forEach(function(bullet) {
    if (bullet.travelComplete()) {
      bullet.destroyBullet()
    }
  })
}

function offScreen(bullet) {
  var downBulletOffScreen = (bullet.velocity > 0 && bullet.y >= (bullet.board.size.height - bullet.height))
  var upBulletOffScreen = (bullet.velocity < 0 && bullet.y <= 0)
  return (downBulletOffScreen || upBulletOffScreen)
}

function goodGuyHit(game, bullet, goodGuy) {
  if (goodGuy.alive) {
    goodGuy.alive = false
    otherPlayer(game, bullet.player).reduceHealth(2)
    game.assets.sounds.marioMamamia.playSound()
  } else {
    otherPlayer(game, bullet.player).reduceHealth(1)
  }
}

function badGuyHit(game, bullet, badGuy) {
  if (badGuy.alive) {
    badGuy.alive = false
    bullet.player.score += 50
    game.assets.sounds.marioYippee.playSound()
  } else {
    bullet.player.score += 20
    game.assets.sounds.marioHappy.playSound()
  }
}

function otherPlayer(game, player){
  return game.players.find(function(playerFromCollection){
    return playerFromCollection !== player
  })
}

function removeCollidingBullets(bullets) {
  if (opposingBulletsExist(bullets[0], bullets[1])) {
    return destroyIfCollided(bullets[0], bullets[1])
  }
}

function opposingBulletsExist(upBullet, downBullet) {
  return (upBullet && downBullet)
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

module.exports = Board
