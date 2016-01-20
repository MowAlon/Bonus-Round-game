const chai = require('chai');
const assert = chai.assert;

const Board = require('../lib/board')
const Bullet = require('../lib/bullet')

describe('Board', function() {
  beforeEach(function() {
    this.game = {startingHealth: 'x', players: [], shotDelay: 'x',
                  assets: {graphics: {mario: {src: 'proxy_file_location'}}}
  }})

  it("should have a reference to the game", function() {
    let board = new Board(this.game, {cannon: 0}, {width: 700, height: 800})
    assert.equal(board.game, this.game)
  })

  it("should instantiate a new board", function() {
    let board = new Board({shotDelay: 0}, {cannon: 0}, {width: 700, height: 800})
    assert.isObject(board)
  })

  it("should have a reference to the graphics object", function() {
    let board = new Board(null, {mario: {src: 'proxy_file_location'}},
                          {width: 700, height: 800})
    assert.equal(board.graphics.mario.src, 'proxy_file_location')
  })

  it("should know the width of the board", function() {
    let board = new Board({shotDelay: 0}, {cannon: 0},
                          {width: 700, height: 800, gamePane: 500, infoPane: 200})
    assert.equal(board.size.width, 700)
  })

  it("should know the height of the board", function() {
    let board = new Board({shotDelay: 0}, {cannon: 0},
                          {width: 700, height: 800, gamePane: 500, infoPane: 200})
    assert.equal(board.size.height, 800)
  })

  it("should know the width of the gamePane", function() {
    let board = new Board({shotDelay: 0}, {cannon: 0},
                          {width: 700, height: 800, gamePane: 500, infoPane: 200})
    assert.equal(board.size.gamePane, 500)
  })

  it("should know the width of the infoPane", function() {
    let board = new Board({shotDelay: 0}, {cannon: 0},
                          {width: 700, height: 800, gamePane: 500, infoPane: 200})
    assert.equal(board.size.infoPane, 200)
  })

  it("should have defined laneCount", function() {
    let board = new Board({shotDelay: 0}, {cannon: 0}, {width: 700, height: 800})
    assert(!isNaN(board.laneCount))
  })

  it("should have five lanes", function() {
    let board = new Board({shotDelay: 0}, {cannon: 0}, {width: 700, height: 800})
    assert.equal(board.lanes.length, 5)
  })

  it("should have an array of five 'good' characters", function() {
    let board = new Board({shotDelay: 0}, {cannon: 0}, {width: 700, height: 800})
    assert.equal(board.characters.good.length, 5)
  })

  it("should have an array of five 'bad' characters", function() {
    let board = new Board({shotDelay: 0}, {cannon: 0}, {width: 700, height: 800})
    assert.equal(board.characters.good.length, 5)
  })

  it("should start with an empty array of bullets", function() {
    let board = new Board({shotDelay: 0}, {cannon: 0}, {width: 700, height: 800})
    assert.isArray(board.bullets)
    assert.deepEqual(board.bullets, [])
  })

  describe('addLane', function() {
    it("can add a new lane to the board's lanes array", function() {
      let board = new Board({shotDelay: 0}, {cannon: 0}, {width: 700, height: 800})
      var laneCountBefore = board.lanes.length
      var laneNumber = 0
      let lane = board.addLane(board, laneNumber)
      var laneCountAfter = board.lanes.length

      assert.include(board.lanes, lane)
      assert.equal(laneCountAfter, laneCountBefore + 1)
    })
  })

  describe('playerBullets', function() {
    it("can provide the list of bullets that belong to the player judged by pos/neg velocity", function() {
      var board = new Board({shotDelay: 0}, {bulletBlack: {height: 0}, cannon: {height: 0}}, {width: 500, height: 800})
      var lane = board.lanes[0]
      var player = {fireDirection: 'up'}
      let bullet1 = new Bullet(board, {bulletBlack: {height: 0, width: 0}, cannon: {height: 0}}, lane, player)
      let bullet2 = new Bullet(board, {bulletBlack: {height: 0, width: 0}, cannon: {height: 0}}, lane, player)
      let bullet3 = new Bullet(board, {bulletBlack: {height: 0, width: 0}, cannon: {height: 0}}, lane, player)
      bullet1.velocity = -1
      bullet2.velocity = 1
      bullet3.velocity = -1

      assert.equal(board.playerBullets().length, 2)
    })
  })

  describe('handleAllCollisions', function() {
    it("destroys the two frontmost bullets in a lane upon collision and returns the number of such collisions", function() {
      var board = new Board({shotDelay: 0}, {bulletBlack: {height: 0}, cannon: {height: 0}}, {width: 500, height: 800})
      board.game.assets = {sounds: {bulletsCollide: {src: "../sounds/coin.mp3"}}}
      var lane = board.lanes[0]
      lane.x = 50
      var player = {fireDirection: 'up'}
      let bullet1 = new Bullet(board, {bulletBlack: {height: 1, width: 10}, cannon: {height: 0}}, lane, player)
      let bullet2 = new Bullet(board, {bulletBlack: {height: 1, width: 10}, cannon: {height: 0}}, lane, player)
      let bullet3 = new Bullet(board, {bulletBlack: {height: 1, width: 10}, cannon: {height: 0}}, lane, player)
      bullet1.velocity = -1
      bullet2.velocity = 1
      bullet3.velocity = -1
      bullet1.y = 51
      bullet2.y = 50
      bullet3.y = 60
      assert.equal(board.bullets.length, 3)
      bullet1.y = 50
      assert.equal(board.handleAllCollisions(board.game), 1)
      assert.equal(board.bullets.length, 1)
    })
  })


});
