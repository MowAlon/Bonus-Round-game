const Game = require('./game')

// var assets = allAssets()
startGame(allAssets(), allSounds())

function allAssets() {
  var assets = {}
  assets.bullet = newImage('../graphics/bullet.gif')
  assets.cannon = newImage('../graphics/cannon.gif')
  return assets
}

function allSounds() {
  var sounds = {}
  sounds.bullet = new SoundPool(50, 'sounds/cannon_firing.mp3')
  sounds.explosion = new SoundPool(50, 'sounds/explosion.mp3')
  sounds.clang = new SoundPool(50, 'sounds/clang.mp3')
  return sounds
}

function startGame(assets, sounds) {
  var assetCount = Object.keys(assets).length
  var loadedCount = 0
  for(var key in assets){
    assets[key].onload = function(){
      loadedCount++
      if (loadedCount === assetCount) {
        new Game(assets, sounds)
      }
    }
  }
}

function newImage(src){
  var image = new Image()
  image.src = src
  return image
}

function SoundPool(size, location) {
  this.pool = []
  // Populates the pool array with the given sound
  for (var i = 0; i < size; i++) {
    var sound = new Audio(location)
    sound.volume = .4
    sound.load()
    this.pool[i] = sound
  }

  var currentSound = 0
  this.playSound = function() {
    if(this.pool[currentSound].currentTime == 0 || this.pool[currentSound].ended) {
      this.pool[currentSound].play();
    }
    currentSound = (currentSound + 1) % size;
  };
}


/*
-----scoring
-----health/game over
-automate random dropping of bullets from sky -- now force them into a specific time window
-

*/
