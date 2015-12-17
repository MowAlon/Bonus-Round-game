/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Game = __webpack_require__(1);

	startGame({ graphics: graphics(), sounds: sounds() });

	function startGame(assets) {
	  var graphicCount = Object.keys(assets.graphics).length;
	  var loadedCount = 0;
	  for (var key in assets.graphics) {
	    assets.graphics[key].onload = function () {
	      loadedCount++;
	      if (loadedCount === graphicCount) {
	        new Game(assets);
	      }
	    };
	  }
	}

	function graphics() {
	  var graphics = {};
	  graphics.bulletBlack = newImage('../graphics/bullet_hi-res.gif');
	  graphics.bulletGray = newImage('../graphics/bullet_weak_hi-res.gif');
	  graphics.cannon = newImage('../graphics/cannon.gif');
	  graphics.mario = newImage('../graphics/waving_mario_sprites.gif', 2);
	  graphics.luigi = newImage('../graphics/waving_luigi_sprites.gif', 2);
	  graphics.yoshi = newImage('../graphics/walking_yoshi_sprites.gif', 2);
	  graphics.peach = newImage('../graphics/waving_peach_sprites.gif', 2);
	  graphics.toad = newImage('../graphics/waving_toad_sprites.gif', 2);
	  graphics.bowser = newImage('../graphics/bowser_sprites.gif', 6);
	  graphics.goomba = newImage('../graphics/goomba_sprites.gif', 2);
	  graphics.footballguy = newImage('../graphics/football_player_sprites.gif', 8);
	  graphics.evilFlower = newImage('../graphics/evil_flower_sprites.gif', 2);
	  graphics.koopaTroopa = newImage('../graphics/koopa_troopa_sprites.gif', 2);
	  return graphics;
	}

	function sounds() {
	  var sounds = {};
	  sounds.bullet = new SoundPool(50, 'sounds/super_mario_3_cannon.mp3');
	  sounds.explosion = new SoundPool(50, 'sounds/explosion.mp3');
	  sounds.bulletsCollide = new SoundPool(50, 'sounds/coin.mp3');
	  sounds.pause = new SoundPool(1, 'sounds/pause.mp3');
	  sounds.gameover = new SoundPool(1, 'sounds/gameover.mp3');
	  sounds.marioGameover = new SoundPool(1, 'sounds/mario_gameover.mp3');
	  sounds.marioMamamia = new SoundPool(5, 'sounds/mario_mamamia.mp3');
	  sounds.marioYippee = new SoundPool(2, 'sounds/mario_yippee.mp3');
	  sounds.marioHappy = new SoundPool(2, 'sounds/mario_happy.mp3');
	  // sounds.marioHurt = new SoundPool(1, 'sounds/mario_hurt.mp3')
	  // sounds.luigiHurt = new SoundPool(1, 'sounds/luigi_hurt.mp3')
	  // sounds.yoshiHurt = new SoundPool(1, 'sounds/yoshi_hurt.wav')
	  // sounds.peachHurt = new SoundPool(1, 'sounds/peach_hurt.mp3')
	  // sounds.toadHurt = new SoundPool(1, 'sounds/toad_hurt.mp3')
	  return sounds;
	}

	function newImage(src, frames, frameInterval) {
	  var image = new Image();
	  image.src = src;
	  image.cycle = 0;
	  image.frames = frames || 1;
	  image.frameInterval = frameInterval || 120;
	  image.lastAnimationTime = 0;
	  image.alive = true;
	  return image;
	}

	function SoundPool(size, location) {
	  this.pool = [];
	  // Populates the pool array with the given sound
	  for (var i = 0; i < size; i++) {
	    var sound = new Audio(location);
	    sound.volume = .4;
	    sound.load();
	    this.pool[i] = sound;
	  }

	  var currentSound = 0;
	  this.playSound = function () {
	    if (this.pool[currentSound].currentTime == 0 || this.pool[currentSound].ended) {
	      this.pool[currentSound].play();
	    }
	    currentSound = (currentSound + 1) % size;
	  };
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Board = __webpack_require__(2);
	var Bullet = __webpack_require__(5);

	var Game = function Game(assets) {
	  var canvas = document.getElementById('gunner');
	  document.addEventListener('keydown', keyPress.bind(null, this));
	  document.addEventListener('keydown', pauseGame.bind(null, this));
	  var context = canvas.getContext('2d');
	  this.assets = assets;
	  // assets.sounds.marioGameover.played = false
	  this.shotDelay = 600;
	  this.paused = false;
	  this.bombs = { dropTime: timeNow(),
	    delayBase: this.shotDelay, //milliseconds
	    delayVariance: .7,
	    delay: this.shotDelay,
	    clusterBase: 6,
	    clusterVariance: .5 };
	  this.bombs.cluster = this.bombs.clusterBase;
	  var justStarted = true;
	  var playAgain = false;
	  var startingHealth = 10;

	  this.board = new Board(this, assets.graphics, { width: canvas.width,
	    height: canvas.height,
	    gamePane: canvas.width / 7 * 5,
	    infoPane: canvas.width / 7 * 2 }, startingHealth);

	  function keyPress(self, button) {
	    var buttons = { 32: [0, 0], 74: [1, 0], 75: [2, 0], 76: [3, 0], 186: [4, 0],
	      81: [0, 1], 87: [1, 1], 69: [2, 1], 82: [3, 1], 86: [4, 1] };
	    // var newself = self
	    if (Array.isArray(buttons[button.keyCode])) {
	      var player = self.board.players[buttons[button.keyCode][1]];
	      if (player.pastMinimumWait()) {
	        new Bullet(self.board, assets.graphics, self.board.lanes[buttons[button.keyCode][0]], player, player.shotStyle());
	        if (!self.paused && !self.gameOver()) {
	          assets.sounds.bullet.playSound();
	        }
	        player.shots.shootTime = timeNow();
	      }
	    }
	  }

	  function startGame(keyPressed) {
	    // Enter key is keyCode 13
	    var fireKeys = [32, 85, 73, 79, 80];
	    if (fireKeys.indexOf(keyPressed.keyCode) > -1) {
	      playAgain = true;
	      justStarted = false;
	    }
	  }

	  function pauseGame(self, keyPressed) {
	    // ~/` (tilda/backtick) is keyCode 192
	    if (keyPressed.keyCode === 192 && !justStarted && !self.gameOver()) {
	      self.paused = !self.paused;
	      assets.sounds.pause.playSound();
	      if (self.paused) {
	        context.font = 'bold 100px Verdana';
	        context.lineWidth = 5;
	        context.strokeStyle = 'red';
	        context.strokeText("PAUSED", self.board.size.gamePane / 2, self.board.size.height / 2);
	      }
	    }
	  }

	  this.HandleAllCollisions = function (board) {
	    var collisionCount = 0;
	    board.lanes.forEach(function (lane) {
	      var bullets = [lane.frontUpBullet(), lane.frontDownBullet()];
	      if (opposingBulletsExist(bullets[0], bullets[1])) {
	        if (destroyIfCollided(bullets[0], bullets[1])) {
	          assets.sounds.bulletsCollide.playSound();
	          collisionCount++;
	        }
	      } else {
	        bullets.forEach(function (bullet) {
	          if (bullet && offScreen(bullet)) {
	            assets.sounds.explosion.playSound();
	            bullet.destroyBullet();

	            var laneNumber = board.lanes.indexOf(bullet.lane);
	            var goodGuy = board.characters.good[laneNumber];
	            var badGuy = board.characters.bad[laneNumber];
	            if (bullet.velocity > 0) {
	              if (goodGuy.alive) {
	                goodGuy.alive = false;
	                otherPlayer(bullet.player).reduceHealth(2);
	                assets.sounds.marioMamamia.playSound();
	              } else {
	                otherPlayer(bullet.player).reduceHealth(1);
	              }
	            } else {
	              if (badGuy.alive) {
	                badGuy.alive = false;
	                bullet.player.score += 50;
	                assets.sounds.marioYippee.playSound();
	              } else {
	                bullet.player.score += 20;
	                assets.sounds.marioHappy.playSound();
	              }
	            }
	          }
	        });
	      }
	    });
	    var playerBullets = board.bullets.filter(function (bullet) {
	      return bullet.velocity < 0;
	    });
	    playerBullets.forEach(function (bullet) {

	      if (bullet.distance.allowed - bullet.distance.traveled <= 0) {
	        bullet.destroyBullet();
	      }
	    });
	    return collisionCount;
	  };

	  function waitForInput(self) {
	    self.paused = self.paused || true;
	    if (justStarted) {
	      self.showStartScreen(context, self.board);
	    } else {
	      self.announceGameOver(context, self.board);
	    }

	    document.addEventListener('keyup', startGame);
	  }

	  function runGame(context, board) {
	    self.update(board);
	    self.draw(context, board);
	    self.dropBombsTimed(board, assets.graphics, assets.sounds);
	  }

	  ////////// Game loop //////////
	  var self = this;
	  requestAnimationFrame(function gameLoop() {
	    if (!self.paused) {
	      runGame(context, self.board);
	    }
	    if (self.gameOver() || justStarted) {
	      if (self.gameOver() && assets.sounds.marioGameover.played === false) {
	        assets.sounds.marioGameover.playSound();
	        assets.sounds.marioGameover.played = true;
	      }
	      waitForInput(self);
	    }
	    if (playAgain) {
	      self.reset(self.board, startingHealth);
	      playAgain = false;
	      document.removeEventListener('keyup', startGame);
	    }

	    requestAnimationFrame(gameLoop);
	  });
	  ////////// Game loop //////////
	};

	Game.prototype = {
	  update: function update(board) {
	    self = this;
	    function collisionCount(board) {
	      if (board.bullets.length > 0) {
	        return self.HandleAllCollisions(board);
	      } else {
	        return 0;
	      }
	    }

	    board.players[0].addPoints(collisionCount(board));
	    var bullets = board.bullets;
	    for (var i = 0; i < bullets.length; i++) {
	      bullets[i].update();
	    }
	  },

	  draw: function draw(context, board) {
	    context.clearRect(0, 0, board.size.width, board.size.height);
	    drawBullets(context, board);
	    drawCannons(context, board);
	    drawCharacters(context, board);
	    drawTimingMeter(context, board);
	    drawInfoPane(context, board);
	  },

	  dropBombsTimed: function dropBombsTimed(board, graphics, sounds) {
	    var computerPlayer = board.players.find(function (player) {
	      return player.fireDirection === 'down';
	    });
	    var laneNumber = Math.floor(Math.random() * board.lanes.length);

	    if (timeNow() - this.bombs.dropTime >= this.bombs.delay) {
	      new Bullet(board, graphics, board.lanes[laneNumber], computerPlayer);
	      sounds.bullet.playSound();
	      this.bombs.dropTime = timeNow();
	      var base = this.bombs.delayBase;
	      var variance = this.bombs.delayVariance;
	      this.bombs.delay = base * (1 - variance) + Math.random() * base * variance * 2;
	    }
	  },

	  dropBombsRandom: function dropBombsRandom(board, graphics, sounds) {
	    var computerPlayer = board.players.find(function (player) {
	      return player.fireDirection === 'down';
	    });
	    var laneNumber = Math.floor(Math.random() * board.lanes.length);

	    if (Math.random() > 0.97) {
	      new Bullet(board, graphics, board.lanes[laneNumber], computerPlayer);
	      sounds.bullet.playSound();
	    }
	  },

	  gameOver: function gameOver() {
	    var deadPlayer = this.board.players.find(function (player) {
	      return player.health <= 0;
	    });
	    if (deadPlayer) {
	      return true;
	    } else {
	      return false;
	    }
	  },

	  announceGameOver: function announceGameOver(context, board) {
	    context.clearRect(0, 0, board.size.gamePane, board.size.height);
	    var middleXOfGamePane = board.size.gamePane / 2;
	    context.font = "120px Verdana";
	    context.fillStyle = "red";
	    context.fillText("Game", middleXOfGamePane, board.size.height / 2);
	    context.fillText("Over", middleXOfGamePane, board.size.height / 2 + 120);
	    context.font = "30px Verdana";
	    context.fillText("Fire for another round!", middleXOfGamePane, board.size.height / 2 + 240);
	  },

	  showStartScreen: function showStartScreen(context, board) {
	    context.clearRect(0, 0, board.size.gamePane, board.size.height);
	    var centerOfGamePane = { x: board.size.gamePane / 2, y: board.size.height / 2 };
	    context.font = "120px Verdana";
	    context.fillStyle = "black";
	    context.fillText("Bonus", centerOfGamePane.x, centerOfGamePane.y - 100);
	    context.fillText("Round", centerOfGamePane.x, centerOfGamePane.y + 20);
	    context.font = "50px Verdana";
	    context.fillText("Shoot to start!", centerOfGamePane.x, centerOfGamePane.y + 150);
	    context.fillText("⬛️ ⬛️ ⬛️ ⬛️ ⬛️", centerOfGamePane.x, centerOfGamePane.y + 370);
	    context.font = "30px Verdana";
	    context.fillStyle = 'red';
	    context.fillText("Fire keys:", centerOfGamePane.x, centerOfGamePane.y + 300);
	    context.font = '20px Verdana';
	    context.fillStyle = 'white';
	    context.textAlign = 'left';
	    context.fillText("Spc       J       K        L         ;", centerOfGamePane.x - 153, centerOfGamePane.y + 357);
	    context.fillStyle = 'black';
	    context.textAlign = 'center';
	  },

	  reset: function reset(board, startingHealth, playAgain) {
	    board.bullets = [];
	    this.paused = false;
	    this.assets.sounds.marioGameover.played = false;
	    var characters = board.characters.good.concat(board.characters.bad);
	    characters.forEach(function (lane) {
	      lane.alive = true;
	    });
	    board.players.forEach(function (player) {
	      player.score = 0;
	      player.health = startingHealth;
	    });
	  }

	};

	function drawBullets(context, board) {
	  for (var i = 0; i < board.bullets.length; i++) {
	    var bullet = board.bullets[i];
	    var cannonHeight = board.graphics.cannon.height;
	    var graphic = bullet.graphic;
	    if (bullet.player.fireDirection === 'up') {
	      drawRotatedImage(context, graphic, bullet.x, bullet.y, 0);
	    } else {
	      drawRotatedImage(context, graphic, bullet.x, bullet.y, 180);
	    }
	  }
	}

	function drawCannons(context, board) {
	  for (var playerIndex = 0; playerIndex < board.players.length; playerIndex++) {
	    var player = board.players[playerIndex];
	    var graphic = board.graphics.cannon;

	    for (var laneIndex = 0; laneIndex < board.lanes.length; laneIndex++) {
	      var lane = board.lanes[laneIndex];
	      var graphicX = lane.x - graphic.width / 2;
	      if (player.fireDirection === 'up') {
	        var graphicY = board.size.height - graphic.height;
	        drawRotatedImage(context, graphic, graphicX, graphicY, 0);
	      } else {
	        drawRotatedImage(context, graphic, graphicX, 0, 180);
	      }
	    }
	  }
	}

	function drawCharacters(context, board) {
	  var graphics = board.game.assets.graphics;
	  var goodGuys = board.characters.good;
	  var badGuys = board.characters.bad;
	  goodGuys.forEach(function (character, index) {
	    if (character.alive) {
	      drawAnimatedImage(character, board.lanes[index].x, board.size.height - character.height, context);
	    }
	  });
	  badGuys.forEach(function (character, index) {
	    if (character.alive) {
	      drawAnimatedImage(character, board.lanes[index].x, 0, context);
	    }
	  });
	}

	function drawTimingMeter(context, board) {
	  var player = board.players.find(function (player) {
	    return player.fireDirection === 'up';
	  });
	  var timeMeterHeight = Math.min(100, player.timeSinceLastShot() / player.shots.goodDelay * 100);
	  if (timeMeterHeight === 100) {
	    context.fillStyle = 'lightgreen';
	  }
	  context.fillRect(4, board.size.height - timeMeterHeight, 8, timeMeterHeight);
	  context.fillStyle = 'black';
	}

	function drawInfoPane(context, board) {
	  var middleXOfInfoPane = board.size.gamePane + board.size.infoPane / 2;
	  context.fillStyle = "white";
	  context.strokeStyle = "black";
	  context.globalAlpha = 0.5;
	  context.fillRect(board.size.width - board.size.infoPane, 0, board.size.infoPane, board.size.height);
	  context.globalAlpha = 1;
	  context.textAlign = "center";

	  context.lineWidth = 2;
	  context.font = "bold 35px Verdana";
	  context.fillText("Score", middleXOfInfoPane, 40);
	  context.strokeText("Score", middleXOfInfoPane, 40);
	  context.fillText("Health", middleXOfInfoPane, 250);
	  context.strokeText("Health", middleXOfInfoPane, 250);

	  context.font = "50px Verdana";
	  context.fillText(board.players[0].score, middleXOfInfoPane, 90);
	  context.strokeText(board.players[0].score, middleXOfInfoPane, 90);
	  context.fillText(board.players[0].health, middleXOfInfoPane, 300);
	  context.strokeText(board.players[0].health, middleXOfInfoPane, 300);
	}

	var TO_RADIANS = Math.PI / 180;
	function drawRotatedImage(context, image, x, y, angle) {
	  context.save();
	  context.translate(x + image.width / 2, y + image.height / 2);
	  context.rotate(angle * TO_RADIANS);
	  context.drawImage(image, -(image.width / 2), -(image.height / 2));
	  context.restore();
	}

	function drawAnimatedImage(graphic, x, y, context) {
	  var spriteWidth = spriteWidth || graphic.width / graphic.frames;
	  var x = x - spriteWidth / 2 || 0;
	  var y = y || 0;
	  context.drawImage(graphic,
	  // source rectangle
	  graphic.cycle * spriteWidth, 0, spriteWidth, graphic.height,
	  // destination rectangle
	  x, y, spriteWidth, graphic.height);
	  if (timeNow() - graphic.lastAnimationTime >= graphic.frameInterval) {
	    graphic.cycle = (graphic.cycle + 1) % graphic.frames;
	    graphic.lastAnimationTime = timeNow();
	  }
	}

	function offScreen(bullet) {
	  var downBulletOffScreen = bullet.velocity > 0 && bullet.y >= bullet.board.size.height - bullet.height;
	  var upBulletOffScreen = bullet.velocity < 0 && bullet.y <= 0;
	  return downBulletOffScreen || upBulletOffScreen;
	}

	function shotComplete(bullet) {
	  return bullet.distanceAllowed - bullet.distanceTraveled <= 0;
	}

	function otherPlayer(player) {
	  return player.board.players.find(function (playerFromCollection) {
	    return playerFromCollection !== player;
	  });
	}

	function opposingBulletsExist(upBullet, downBullet) {
	  return upBullet !== undefined && downBullet !== undefined;
	}

	function destroyIfCollided(upBullet, downBullet) {
	  if (bodiesCollide(upBullet, downBullet)) {
	    destroyBullets([upBullet, downBullet]);
	    return true;
	  }
	}

	function bodiesCollide(upBullet, downBullet) {
	  return upBullet.headY() < downBullet.headY();
	}

	function destroyBullets(bullets) {
	  bullets.forEach(function (bullet) {
	    bullet.destroyBullet();
	  });
	}

	function timeNow() {
	  return new Date().getTime();
	}

	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Player = __webpack_require__(3);
	var Lane = __webpack_require__(4);
	var Bullet = __webpack_require__(5);

	function Board(game, graphics, size, startingHealth) {
	  this.game = game;
	  this.graphics = graphics;
	  this.size = { width: size.width,
	    height: size.height,
	    gamePane: size.gamePane,
	    infoPane: size.infoPane
	  };
	  this.laneCount = 5;
	  this.lanes = [];
	  this.bullets = [];
	  this.players = [];
	  this.characters = {
	    good: [graphics.mario, graphics.luigi, graphics.yoshi, graphics.peach, graphics.toad],
	    bad: [graphics.goomba, graphics.evilFlower, graphics.bowser, graphics.footballguy, graphics.koopaTroopa]
	  };
	  this.addPlayer(graphics, 'up', startingHealth);
	  this.addPlayer(graphics, 'down', startingHealth);
	  for (var i = 0; i < this.laneCount; i++) {
	    this.addLane();
	  }
	}

	Board.prototype = {
	  addPlayer: function addPlayer(graphics, direction, startingHealth) {
	    return new Player(this, graphics, direction, startingHealth);
	  },

	  addLane: function addLane() {
	    var laneNumber = this.lanes.length;
	    return new Lane(this, laneNumber);
	  }

	};

	module.exports = Board;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	function Player(board, graphics, direction, startingHealth) {
	  this.board = board;
	  this.fireDirection = direction;
	  this.score = 0;
	  this.health = startingHealth;
	  this.board.players.push(this);
	  this.shots = { shootTime: 0,
	    minimumDelay: 150 };
	  this.shots.goodDelay = board.game.shotDelay * 0.8;
	}

	module.exports = Player;

	Player.prototype = {
	  addPoints: function addPoints(points) {
	    this.score = this.score + points;
	  },

	  reduceHealth: function reduceHealth(hitPoints) {
	    if (this.health - hitPoints >= 0) {
	      this.health -= hitPoints;
	    } else {
	      this.health = 0;
	    }
	  },

	  shotStyle: function shotStyle() {
	    if (timeNow() - this.shots.shootTime < this.shots.goodDelay) {
	      return 'bad';
	    } else {
	      return 'good';
	    }
	  },

	  timeSinceLastShot: function timeSinceLastShot() {
	    return timeNow() - this.shots.shootTime;
	  },

	  pastMinimumWait: function pastMinimumWait() {
	    return this.timeSinceLastShot() >= this.shots.minimumDelay;
	  }
	};

	function timeNow() {
	  return new Date().getTime();
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	function Lane(board, laneNumber) {
	  this.board = board;
	  var laneWidth = this.board.size.gamePane / board.laneCount;
	  this.x = laneNumber * laneWidth + laneWidth / 2;
	  this.board.lanes.push(this);
	}

	Lane.prototype = {
	  bullets: function bullets() {
	    // console.log(this)
	    self = this;
	    return this.board.bullets.filter(function (bullet) {
	      return bullet.lane.x === self.x;
	    });
	  },

	  frontDownBullet: function frontDownBullet() {
	    // console.log(this)
	    return this.bullets().filter(function (bullet) {
	      return bullet.velocity > 0;
	    })[0];
	  },

	  frontUpBullet: function frontUpBullet() {
	    return this.bullets().filter(function (bullet) {
	      return bullet.velocity < 0;
	    })[0];
	  }
	};

	module.exports = Lane;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	function Bullet(board, graphics, lane, player, type) {
	  this.board = board;
	  this.lane = lane;
	  this.player = player;
	  this.velocity = velocity(player);
	  this.graphic = graphic(graphics, type);
	  this.height = this.graphic.height;
	  this.width = this.graphic.width;
	  this.x = lane.x - this.width / 2;
	  this.y = startingY(player, this.graphic.height, graphics.cannon);
	  this.distance = { traveled: 0,
	    bad: 150,
	    good: board.size.height + 100 };
	  this.distance.allowed = this.distanceAllowed(type);
	  this.board.bullets.push(this);
	}

	Bullet.prototype = {
	  update: function update() {
	    self = this;
	    this.y += this.velocity;
	    this.distance.traveled += Math.abs(this.velocity);
	  },

	  headY: function headY() {
	    if (this.velocity < 0) {
	      return this.y;
	    } else {
	      return this.y + this.height;
	    }
	  },

	  destroyBullet: function destroyBullet() {
	    this.board.bullets = this.board.bullets.filter(function (bullet) {
	      return bullet !== this;
	    }, this);
	  },

	  distanceAllowed: function distanceAllowed(type) {
	    if (type === 'bad') {
	      return this.distance.bad;
	    } else {
	      return this.distance.good;
	    }
	  }
	};

	function velocity(player) {
	  var speed = 6;
	  if (player.fireDirection === 'up') {
	    return -speed;
	  } else {
	    return speed;
	  }
	}

	function graphic(graphics, type) {
	  var style = type || 'good';
	  if (style === 'good') {
	    return graphics.bulletBlack;
	  } else {
	    return graphics.bulletGray;
	  }
	}

	function startingY(player, height, cannon) {
	  if (player.fireDirection === 'up') {
	    return player.board.size.height - cannon.height;
	  } else {
	    return -height + cannon.height;
	  }
	}

	module.exports = Bullet;

/***/ }
/******/ ]);