const Game = require('./game')

var assets = defineAssets()
var assetCount = Object.keys(assets).length
var loadedCount = 0
startGame(assets)

function defineAssets() {
  var bulletUp = new Image()
  bulletUp.src = '../graphics/bullet_up.gif'
  var bulletDown = new Image()
  bulletDown.src = '../graphics/bullet_down.gif'

  return {
    bulletUp: bulletUp,
    bulletDown: bulletDown
  }
}

function startGame(assets) {
  for(var key in assets){
    assets[key].onload = function(){
      loadedCount++
      if (loadedCount === assetCount) {
        new Game(assets)
      }
    }
  }
}
