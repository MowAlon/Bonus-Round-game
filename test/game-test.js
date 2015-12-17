// const chai = require('chai');
// const assert = chai.assert;
//
// const Game = require('../lib/game')
//
// describe('Game', function() {
//   // beforeEach(function() {
//     // this.board = new Board({shotDelay: 0}, {bulletBlack: {height: 0}, cannon: {height: 0}}, {width: 500, height: 800})
//     // this.lane = this.board.lanes[0]
//     // this.player = this.board.players[0]
//   // })
//
//   it("should instantiate a new game", function(){
//     let game = new Game()
//     assert.isObject(game)
//   })
//
//   it("should have two players", function(){
//     let game = new Game(null, null, null, true)
//     assert.equal(game.players.length, 2)
//   })
//
//   it("should assign the first player's firing direction as 'up'", function() {
//     let game = new Game(null, null, null, true)
//     assert.equal(game.players[0].fireDirection, 'up')
//   })
//
//   it("should assign the second player's firing direction as 'down'", function() {
//     let game = new Game(null, null, null, true)
//     assert.equal(game.players[1].fireDirection, 'down')
//   })
//
//   describe ('addPlayer', function() {
//     it("should add a new player to the game's players array", function() {
//       let game = new Game(null, null, null, true)
//       let player = game.addPlayer('up')
//       assert.include(game.players, player)
//     })
//   })
//
// });
