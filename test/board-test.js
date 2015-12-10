const chai = require('chai');
const assert = chai.assert;

const Board = require('../lib/board')

describe('Board', function () {

  it("should instantiate a new board", function(){
    let board = new Board({width: 500, height: 800})
    assert.isObject(board)
  })

  it("should have a copy of the canvas size specs", function(){
    let board = new Board({width: 500, height: 800})
    assert.equal(board.size.width, 500)
    assert.equal(board.size.height, 800)
  })

  it("should have five lanes", function(){
    let board = new Board({width: 500, height: 800})
    assert.equal(board.lanes.length, 5)
  })

  it("should start with an empty array of bullets", function(){
    let board = new Board({width: 500, height: 800})
    assert.isArray(board.bullets)
    assert.deepEqual(board.bullets, [])
  })

  it("should have two players", function(){
    let board = new Board({width: 500, height: 800})
    assert.equal(board.players.length, 2)
  })

  it("should assign the first player's firing direction as 'up'", function() {
    let board = new Board({width: 500, height: 800})
    assert.equal(board.players[0].fireDirection, 'up')
  })

  it("should assign the second player's firing direction as 'down'", function() {
    let board = new Board({width: 500, height: 800})
    assert.equal(board.players[1].fireDirection, 'down')
  })

  describe ('addPlayer', function() {
    it("should add a new player to the board's players array", function() {
      let board = new Board({width: 500, height: 800})
      let player = board.addPlayer('up')
      assert.include(board.players, player)
    })
  })

  describe ('addLane', function() {
    it("should add a new lane to the board's lanes array", function() {
      let board = new Board({width: 500, height: 800})
      var laneCountBefore = board.lanes.length
      var laneNumber = 0
      let lane = board.addLane(board, laneNumber)
      var laneCountAfter = board.lanes.length
      assert.include(board.lanes, lane)
      assert.equal(laneCountAfter, laneCountBefore + 1)
    })
  })

  describe ('addBullet', function() {
    it("should add a new bullet to the board's bullets array", function() {
      let board = new Board({width: 500, height: 800})
      let bullet = board.addBullet(board.lanes[0], board.players[0])
      assert.include(board.bullets, bullet)
    })
  })

});
