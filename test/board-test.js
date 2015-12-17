const chai = require('chai');
const assert = chai.assert;

const Board = require('../lib/board')

describe('Board', function() {

  it("should instantiate a new board", function(){
    let board = new Board({shotDelay: 0}, {cannon: 0}, {width: 500, height: 800})
    assert.isObject(board)
  })

  it("should have a copy of the canvas size specs", function(){
    let board = new Board({shotDelay: 0}, {cannon: 0}, {width: 500, height: 800})
    assert.equal(board.size.width, 500)
    assert.equal(board.size.height, 800)
  })

  it("should have five lanes", function(){
    let board = new Board({shotDelay: 0}, {cannon: 0}, {width: 500, height: 800})
    assert.equal(board.lanes.length, 5)
  })

  it("should start with an empty array of bullets", function(){
    let board = new Board({shotDelay: 0}, {cannon: 0}, {width: 500, height: 800})
    assert.isArray(board.bullets)
    assert.deepEqual(board.bullets, [])
  })

  describe ('addLane', function() {
    it("should add a new lane to the board's lanes array", function() {
      let board = new Board({shotDelay: 0}, {cannon: 0}, {width: 500, height: 800})
      var laneCountBefore = board.lanes.length
      var laneNumber = 0
      let lane = board.addLane(board, laneNumber)
      var laneCountAfter = board.lanes.length
      assert.include(board.lanes, lane)
      assert.equal(laneCountAfter, laneCountBefore + 1)
    })
  })

});
