function Player(game, direction) {
  this.game = game
  this.fireDirection = direction
  this.score = 0
  this.health = game.startingHealth
  this.game.players.push(this)
  this.shots = {shootTime: 0,
                minimumDelay: 150,
                goodDelay: game.shotDelay * 0.8}
}

Player.prototype = {
  addPoints: function(points) {
    this.score = this.score + points
  },

  reduceHealth: function(hitPoints) {
    if (this.health - hitPoints >= 0) {this.health -= hitPoints}
    else {this.health = 0}
  },

  timeSinceLastShot: function() {
    return (timeNow() - this.shots.shootTime)
  },

  shotStyle: function() {
    if (this.timeSinceLastShot() < this.shots.goodDelay) {
      return 'bad'
    }
      else {return 'good'}
  },

  pastMinimumWait: function() {
    return (this.timeSinceLastShot() >= this.shots.minimumDelay)
  }
}

function timeNow() {
  return new Date().getTime()
}

module.exports = Player
