const chai = require('chai');
const assert = chai.assert;

const Board = require('../lib/board')
const Bullet = require('../lib/bullet')
// const Game = require('../lib/game')

describe('Bullet', function () {
  beforeEach(function() {
    this.board = new Board({shotDelay: 0}, {bulletBlack: {height: 0}, cannon: {height: 0}}, {width: 500, height: 800})
    this.lane = this.board.lanes[0]
    this.player = {fireDirection: 'up'}
  })

  it("should have a reference to the board", function() {
    let bullet = new Bullet(this.board, {bulletBlack: {height: 0, width: 0}, cannon: {height: 0}}, this.lane, this.player)
    assert.equal(bullet.board, this.board)
  })

  it("should have an X-coordinate defined by its lane minus half its width", function() {
    this.lane.x = 50
    let bullet = new Bullet(this.board, {bulletBlack: {height: 10, width: 10}, cannon: {height: 0}}, this.lane, this.player)
    assert.strictEqual(bullet.x, 50 - 10/2)
  })

  it("should have a Y-coordinate equal to the board's height minus the cannon's height if the player's firing direction is 'up'", function() {
    let bullet = new Bullet(this.board, {bulletBlack: {height: 10, width: 10}, cannon: {height: 20}}, this.lane, this.player)
    assert.strictEqual(bullet.y, this.board.size.height - 20)
  })

  it("should have a Y-coordinate equal to the cannon's height minus the bullet's height if the player's firing direction is 'down'", function() {
    this.player.fireDirection = 'down'
    let bullet = new Bullet(this.board, {bulletBlack: {height: 10, width: 0}, cannon: {height: 20}}, this.lane, this.player)
    assert.equal(bullet.y, 20 - 10)
  })

  it("should be included in the board's array of bullets", function() {
    let bullet = new Bullet(this.board, {bulletBlack: {height: 0, width: 0}, cannon: {height: 0}}, this.lane, this.player)
    assert.include(this.board.bullets, bullet)
  })

  it("should add a new bullet to the board's bullets array", function() {
    var originalBulletCount = this.board.bullets.length
    let bullet = new Bullet(this.board, {bulletBlack: {height: 0, width: 0}, cannon: {height: 0}}, this.lane, this.player)
    assert.equal(this.board.bullets.length, originalBulletCount + 1)
  })

});
