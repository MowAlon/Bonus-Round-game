const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon')

const Board = require('../lib/board')
const Lane = require('../lib/lane')


describe('Lane', function () {
  beforeEach(function() {
    this.board = new Board({}, {}, {width: 500, height: 800, gamePane: 500})
  })

  it("should have an X-coordinate", function() {
    var junk = { hello: function(){return 'hello'}}
    //sinon //.spy(junk, 'hello')
    var laneNumber = 1
    var canvasWidth = 500
    var laneCount = 5
    var laneWidth = canvasWidth / laneCount
    var properX = (laneNumber * laneWidth) + (laneWidth / 2)
    let lane = new Lane(this.board, laneNumber)
    assert.strictEqual(lane.x, 150)
  })

  it("should add a new lane to the board's lanes array", function() {
    var laneNumber = 0
    let lane = new Lane(this.board, laneNumber)
    assert.include(this.board.lanes, lane)
  })

});
