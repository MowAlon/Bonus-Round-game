const Game = require('./game')

startGame({graphics: graphics(), sounds: sounds()})

function startGame(assets) {
  var graphicCount = Object.keys(assets.graphics).length
  var loadedCount = 0
  for(var key in assets.graphics){
    assets.graphics[key].onload = function(){
      loadedCount++
      if (loadedCount === graphicCount) {
        new Game(assets)
      }
    }
  }
}

function graphics() {
  var graphics = {}
  graphics.bulletBlack = newImage('../graphics/bullet_black.gif')
  graphics.bulletGray = newImage('../graphics/bullet_gray.gif')
  graphics.cannon = newImage('../graphics/cannon.gif')
  return graphics
}

function sounds() {
  var sounds = {}
  sounds.bullet = new SoundPool(50, 'sounds/super_mario_3_cannon.mp3')
  sounds.explosion = new SoundPool(50, 'sounds/explosion.mp3')
  sounds.bulletsCollide = new SoundPool(50, 'sounds/coin.mp3')
  sounds.pause = new SoundPool(1, 'sounds/pause.mp3')
  sounds.gameover = new SoundPool(1, 'sounds/gameover.mp3')
  sounds.marioGameover = new SoundPool(1, 'sounds/mario_gameover.mp3')

  return sounds
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
