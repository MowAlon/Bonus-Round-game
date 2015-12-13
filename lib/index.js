const Game = require('./game')

var assets = allAssets()
var assetCount = Object.keys(assets).length
var loadedCount = 0
startGame(assets)

function allAssets() {
  var assets = {}
  assets.bulletUp = new Image()
  assets.bulletUp.src = '../graphics/bullet_up.gif'
  assets.bulletDown = new Image()
  assets.bulletDown.src = '../graphics/bullet_down.gif'

  return assets
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
