function Player(game, direction, startingHealth, shotDelay) {
  this.game = game
  this.fireDirection = direction
  this.score = 0
  this.health = startingHealth
  this.game.players.push(this)
  this.shots = {shootTime: 0,
                minimumDelay: 150}
  this.shots.goodDelay = shotDelay * 0.8
}

module.exports = Player

Player.prototype = {
  addPoints: function(points) {
    this.score = this.score + points
  },

  reduceHealth: function(hitPoints) {
    if (this.health - hitPoints >= 0) {this.health -= hitPoints}
    else {this.health = 0}
  },

  shotStyle: function() {
    if (timeNow() - this.shots.shootTime < this.shots.goodDelay) {
      return 'bad'
    }
      else {return 'good'}
  },

  timeSinceLastShot: function() {
    return (timeNow() - this.shots.shootTime)
  },

  pastMinimumWait: function() {
    return (this.timeSinceLastShot() >= this.shots.minimumDelay)
  }
}

function timeNow() {
  return new Date().getTime()
}
