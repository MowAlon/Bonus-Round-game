const chai = require('chai');
const assert = chai.assert;

const Board = require('../lib/board')
const Bullet = require('../lib/bullet')

describe('Bullet', function () {
  beforeEach(function() {
    this.board = new Board()
    this.lane = this.board.lanes[0]
    this.player = this.board.players[0]
  })

  it("should have a reference to the board", function() {
    let bullet = new Bullet(this.board, this.lane, this.player)
    assert.equal(bullet.board, this.board)
  })

  it("should have an X-coordinate defined by its lane", function() {
    this.lane.x = 50
    let bullet = new Bullet(this.board, this.lane, this.player)
    assert.strictEqual(bullet.x, 50)
  })

  it("should have a Y-coordinate defined by its player", function() {
    this.player.y = 800
    let bullet = new Bullet(this.board, this.lane, this.player)
    assert.strictEqual(bullet.y, this.player.y)
  })

  it("should be included in the board's array of bullets", function() {
    let bullet = new Bullet(this.board, 0, 0)
    assert.include(this.board.bullets, bullet)
  })

  it("should add a new bullet to the board's bullets array", function() {
    let board = new Board()
    let bullet = board.addBullet(this.lane, this.player)
    assert.include(board.bullets, bullet)
  })

});
