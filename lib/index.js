const Game = require('./game')

var assets = allAssets()
var assetCount = Object.keys(assets).length
var loadedCount = 0
startGame(assets)

function allAssets() {
  var assets = {}
  assets.bulletUp = newImage('../graphics/bullet_up.gif')
  assets.bulletDown = newImage('../graphics/bullet_down.gif')

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

function newImage(src){
  var image = new Image()
  image.src = src
  return image
}

/*
-----scoring
---health/game over
-automate random dropping of bullets from sky
-

*/
