const chai = require('chai');
const assert = chai.assert;

const Board = require('../lib/board')
const Player = require('../lib/player')

describe('Player', function () {
  beforeEach(function() {
    this.board = new Board({}, {}, {width: 500, height:800})
  })

  it("should have a defined direction of fire", function() {
    let player = new Player(this.board, {}, 'up')
    assert.equal(player.fireDirection, 'up')
  })

  it("should add a new player to the board's players array", function() {
    let player = new Player(this.board, {}, 'up')
    assert.include(this.board.players, player)
  })

});
