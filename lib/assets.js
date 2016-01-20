var Assets = function() {
  this.graphics = {
    bulletBlack: newImage('graphics/bullet_hi-res.gif'),
    bulletGray: newImage('graphics/bullet_weak_hi-res.gif'),
    cannon: newImage('graphics/cannon_hi-res_64.gif'),
    mario: newImage('graphics/waving_mario_sprites.gif', 2),
    luigi: newImage('graphics/waving_luigi_sprites.gif', 2),
    yoshi: newImage('graphics/walking_yoshi_sprites.gif', 2),
    peach: newImage('graphics/waving_peach_sprites.gif', 2),
    toad : newImage('graphics/waving_toad_sprites.gif', 2),
    bowser: newImage('graphics/bowser_sprites.gif', 6),
    goomba: newImage('graphics/goomba_sprites.gif', 2),
    footballguy: newImage('graphics/football_player_sprites.gif', 8),
    evilFlower: newImage('graphics/evil_flower_sprites.gif', 2),
    koopaTroopa: newImage('graphics/koopa_troopa_sprites.gif', 2)
  }

  this.sounds = {
    bullet: new SoundPool(50, 'sounds/super_mario_3_cannon.mp3'),
    explosion: new SoundPool(50, 'sounds/explosion.mp3'),
    bulletsCollide: new SoundPool(50, 'sounds/coin.mp3'),
    pause: new SoundPool(1, 'sounds/pause.mp3'),
    marioGameover: new SoundPool(1, 'sounds/mario_gameover.mp3'),
    marioMamamia: new SoundPool(5, 'sounds/mario_mamamia.mp3'),
    marioYippee: new SoundPool(2, 'sounds/mario_yippee.mp3'),
    marioHappy: new SoundPool(2, 'sounds/mario_happy.mp3')
  }

  function newImage(src, frames, frameInterval){
    var image = new Image()
    image.src = src
    image.cycle = 0
    image.frames = frames || 1
    image.frameInterval = frameInterval || 120
    image.lastAnimationTime = 0
    image.alive = true
    return image
  }

  function SoundPool(size, location) {
    this.pool = []
    // Populates the pool array with the given sound
    for (var i = 0; i < size; i++) {
      var sound = new Audio(location)
      sound.volume = 0.4
      sound.load()
      this.pool[i] = sound
    }

    var currentSound = 0
    this.playSound = function() {
      if(this.pool[currentSound].currentTime === 0 || this.pool[currentSound].ended) {
        this.pool[currentSound].play()
      }
      currentSound = (currentSound + 1) % size
    }
  }

}

module.exports = Assets
