const Game = require('./game')
const Assets = require('./assets')
var canvas = document.getElementById('gunner');
var canvasContext = canvas.getContext('2d')

startGame(new Assets())

function startGame(assets) {
  var graphicCount = Object.keys(assets.graphics).length
  var loadedCount = 0
  for(var key in assets.graphics){
    assets.graphics[key].onload = function(){
      loadedCount++
      if (loadedCount === graphicCount) {
        new Game(canvas, canvasContext, assets)
      }
    }
  }
}
