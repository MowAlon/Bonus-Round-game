const Game = require('./game')

startGame(graphics(), sounds())

function graphics() {
  var graphics = {}
  graphics.bullet = newImage('../graphics/bullet.gif')
  graphics.cannon = newImage('../graphics/cannon.gif')
  return graphics
}

function sounds() {
  var sounds = {}
  sounds.bullet = new SoundPool(50, 'sounds/super_mario_3_cannon.mp3')
  sounds.explosion = new SoundPool(50, 'sounds/explosion.mp3')
  sounds.clang = new SoundPool(50, 'sounds/clang.mp3')
  return sounds
}

function startGame(graphics, sounds) {
  var graphicCount = Object.keys(graphics).length
  var loadedCount = 0
  for(var key in graphics){
    graphics[key].onload = function(){
      loadedCount++
      if (loadedCount === graphicCount) {
        new Game(graphics, sounds)
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
