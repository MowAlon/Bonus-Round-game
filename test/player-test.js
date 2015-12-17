const chai = require('chai');
const assert = chai.assert;

// const Game = require('../lib/game')
const Player = require('../lib/player')

describe('Player', function () {
  beforeEach(function() {
    this.game = {startingHealth: 'x', players: [], shotDelay: 'x'}
  })

  it("should have a reference to the game", function() {
    let player = new Player(this.game, 'up')
    assert.equal(player.game, this.game)
  })

  it("should have a defined direction of fire if passed", function() {
    let player = new Player(this.game, 'up')
    assert.equal(player.fireDirection, 'up')
  })

  it("should have a default score of zero", function() {
    let player = new Player(this.game, 'up')
    assert.equal(player.score, 0)
  })

  it("should have a health value derived from the game", function() {
    this.game.startingHealth = 10
    let player = new Player(this.game, 'up')
    assert.equal(player.health, 10)
  })

  it("should add a new player to the game's players array", function() {
    let player = new Player(this.game, 'up')
    assert.include(this.game.players, player)
  })

  it("should have a default 'shootTime' value (representing the last time it shot a bullet) set to zero", function() {
    let player = new Player(this.game, 'up')
    assert.equal(player.shots.shootTime, 0)
  })

  it("should have a minimumDelay value (the time required between shots) of 150 (milliseconds)", function() {
    let player = new Player(this.game, 'up')
    assert.equal(player.shots.minimumDelay, 150)
  })

  it("should have a goodDelay value (the time it takes to charge to a full power shot) that is 80% of the enemy's shotDelay (game.shotDelay)", function() {
    this.game.shotDelay = 1000
    let player = new Player(this.game, 'up')
    assert.equal(player.shots.goodDelay, 800)
  })

  describe ('addPoints', function() {
    it("can add points to a player's score with a passed argument", function() {
      let player = new Player(this.game, 'up')
      player.addPoints(5)
      assert.equal(player.score, 5)
    })
  })

  describe ('reduceHealth', function() {
    it("can reduce a player's health with a passed argument", function() {
      this.game.startingHealth = 10
      let player = new Player(this.game, 'up')
      player.reduceHealth(3)
      assert.equal(player.health, 7)
    })
  })

  describe ('timeSinceLastShot', function() {
    it("can report the time elapsed since the player's last shot", function() {
      let player = new Player(this.game, 'up')
      var timeNow = new Date().getTime()
      player.shots = {shootTime: timeNow - 100}
      assert.include([100, 101], player.timeSinceLastShot())
    })
  })

  describe ('shotStyle', function() {
    it("reports a player's shotStyle as 'good' if the player has waited through the 'goodDelay' period", function() {
      let player = new Player(this.game, 'up')
      var timeNow = new Date().getTime()
      player.shots = {shootTime: timeNow - 900, goodDelay: 800}
      assert.equal(player.shotStyle(), 'good')
    })

    it("reports a player's shotStyle as 'bad' if the player hasn't waited at least the 'goodDelay' period", function() {
      let player = new Player(this.game, 'up')
      var timeNow = new Date().getTime()
      player.shots = {shootTime: timeNow - 100, goodDelay: 800}
      assert.equal(player.shotStyle(), 'bad')
    })
  })

  describe ('timeSinceLastShot', function() {
    it("returns true if the time since the last shot is at least the minimumDelay for taking another shot", function() {
      let player = new Player(this.game, 'up')
      var timeNow = new Date().getTime()
      player.shots = {shootTime: timeNow - 200, minimumDelay: 150}
      assert.isTrue(player.pastMinimumWait())
    })

    it("returns false if the time since the last isn't at least the minimumDelay for taking another shot", function() {
      let player = new Player(this.game, 'up')
      var timeNow = new Date().getTime()
      player.shots = {shootTime: timeNow - 100, minimumDelay: 150}
      assert.isFalse(player.pastMinimumWait())
    })

  })

});






// it("should add a new player to the board's players array", function() {
//   let player = new Player({startingHealth: 'x', players: []}, 'up')
//
//   assert.include(this.game.players, player)
// })
