const chai = require('chai');
const assert = chai.assert;

const Board = require('../lib/board')
const Bullet = require('../lib/bullet')

describe('Bullet', function () {
  beforeEach(function() {
    this.board = new Board({shotDelay: 0}, {bulletBlack: {height: 0}, cannon: {height: 0}}, {width: 500, height: 800})
    this.lane = this.board.lanes[0]
    this.player = this.board.players[0]
  })

  it("should have a reference to the board", function() {
    let bullet = new Bullet(this.board, {bulletBlack: {height: 0, width: 0}}, this.lane, this.player)
    assert.equal(bullet.board, this.board)
  })

  it("should have an X-coordinate defined by its lane", function() {
    this.lane.x = 50
    let bullet = new Bullet(this.board, {bulletBlack: {height: 0, width: 0}}, this.lane, this.player)
    assert.strictEqual(bullet.x, 50)
  })

  it("should have a Y-coordinate equal to the board's height if the player's firing direction is 'up'", function() {
    this.player.fireDirection = 'up'
    let bullet = new Bullet(this.board, {bulletBlack: {height: 0, width: 0}}, this.lane, this.player)
    assert.strictEqual(bullet.y, this.board.size.height)
  })

  it("should have a Y-coordinate equal to the cannon's height minus the bullet's height if the player's firing direction is 'down'", function() {
    this.player.fireDirection = 'down'
    let bullet = new Bullet(this.board, {bulletBlack: {height: 1, width: 0}}, this.lane, this.player)
    assert(bullet.y = this.board.graphics.cannon.height - this.board.graphics.bulletBlack.height)
  })

  it("should be included in the board's array of bullets", function() {
    let bullet = new Bullet(this.board, {bulletBlack: {height: 0, width: 0}}, this.lane, this.player)
    assert.include(this.board.bullets, bullet)
  })

  it("should add a new bullet to the board's bullets array", function() {
    var originalBulletCount = this.board.bullets.length
    let bullet = new Bullet(this.board, {bulletBlack: {height: 0, width: 0}}, this.lane, this.player)
    assert.equal(this.board.bullets.length, originalBulletCount + 1)
  })

});
