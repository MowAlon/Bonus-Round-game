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
	var Assets = __webpack_require__(8);
	var canvas = document.getElementById('gunner');
	var canvasContext = canvas.getContext('2d');

	startGame(new Assets());

	function startGame(assets) {
	  var graphicCount = Object.keys(assets.graphics).length;
	  var loadedCount = 0;
	  for (var key in assets.graphics) {
	    assets.graphics[key].onload = function () {
	      loadedCount++;
	      if (loadedCount === graphicCount) {
	        new Game(canvas, canvasContext, assets);
	      }
	    };
	  }
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Board = __webpack_require__(2);
	var Player = __webpack_require__(4);
	var Bullet = __webpack_require__(5);
	var Screenwriter = __webpack_require__(6);
	var Listeners = __webpack_require__(7);

	var Game = function Game(canvas, context, assets) {
	  var listeners = new Listeners(this);
	  if (canvas) {
	    listeners.keyPress();
	  }
	  if (canvas) {
	    listeners.pauseGame();
	  }
	  // document.addEventListener('keydown', keyPress.bind(null, this))
	  // document.addEventListener('keydown', pauseGame.bind(null, this))
	  this.context = context;
	  this.assets = assets;
	  this.shotDelay = 600;
	  this.paused = false;
	  this.bombs = { dropTime: timeNow(),
	    delayBase: this.shotDelay, //milliseconds
	    delayVariance: 0.7,
	    delay: this.shotDelay,
	    clusterBase: 6,
	    clusterVariance: 0.5 };
	  this.bombs.cluster = this.bombs.clusterBase;
	  this.justStarted = true;
	  this.playAgain = false;
	  this.startingHealth = 10;
	  this.fireButtons = { 32: [0, 0], 74: [1, 0], 75: [2, 0], 76: [3, 0], 186: [4, 0],
	    81: [0, 1], 87: [1, 1], 69: [2, 1], 82: [3, 1], 86: [4, 1] };

	  this.board = new Board(this, assets.graphics, { width: canvas.width,
	    height: canvas.height,
	    gamePane: canvas.width / 7 * 5,
	    infoPane: canvas.width / 7 * 2 });

	  this.screenwriter = new Screenwriter(context, this.board, assets);

	  this.players = [];
	  this.addPlayer('up');
	  this.addPlayer('down');

	  // function startGame(self, keyPressed) {
	  //   // Enter key is keyCode 13
	  //   var fireKeys = [32, 74, 75, 76, 186]
	  //   if (fireKeys.indexOf(keyPressed.keyCode) > -1) {
	  //     self.playAgain = true
	  //     self.justStarted = false
	  //   }
	  // }

	  function waitForInput(self) {
	    self.paused = self.paused || true;
	    if (self.justStarted) {
	      self.screenwriter.showStartScreen();
	    } else {
	      self.screenwriter.announceGameOver();
	    }
	    if (canvas) {
	      listeners.startGame();
	    }
	    // document.addEventListener('keyup', startGame.bind(null, self))
	  }

	  function runGame(context, board) {
	    self.update();
	    self.draw();
	    self.dropBombsTimed(board, assets.graphics, assets.sounds);
	    // self.dropBombsRandom(board, assets.graphics, assets.sounds)
	  }

	  ////////// Game loop //////////
	  var self = this;
	  requestAnimationFrame(function gameLoop() {
	    if (!self.paused) {
	      runGame(context, self.board);
	    }
	    if (self.gameOver() || self.justStarted) {
	      if (self.gameOver() && assets.sounds.marioGameover.played === false) {
	        assets.sounds.marioGameover.playSound();
	        assets.sounds.marioGameover.played = true;
	      }
	      waitForInput(self);
	    }
	    if (self.playAgain) {
	      self.reset();
	      self.playAgain = false;
	      if (canvas) {
	        listeners.stopListeningForStartGame();
	      }
	      // document.removeEventListener('keyup', startGame)
	    }

	    requestAnimationFrame(gameLoop);
	  });
	  ////////// Game loop //////////
	};

	Game.prototype = {
	  addPlayer: function addPlayer(direction) {
	    return new Player(this, direction);
	  },

	  update: function update() {
	    var bombsDestroyed = this.board.HandleAllCollisions(this);
	    this.players[0].addPoints(bombsDestroyed);
	    for (var i = 0; i < this.board.bullets.length; i++) {
	      this.board.bullets[i].update();
	    }
	  },

	  draw: function draw() {
	    this.context.clearRect(0, 0, this.board.size.width, this.board.size.height);
	    this.screenwriter.drawBullets();
	    this.screenwriter.drawCannons(this.players);
	    this.screenwriter.drawCharacters();
	    this.screenwriter.drawTimingMeter(this.players);
	    this.screenwriter.drawInfoPane(this.players[0]);
	  },

	  dropBombsTimed: function dropBombsTimed(board, graphics, sounds) {
	    var computerPlayer = this.players.find(function (player) {
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

	  // dropBombsRandom: function(board, graphics, sounds) {
	  //   var computerPlayer = this.players.find(function(player) {
	  //     return player.fireDirection === 'down'
	  //   })
	  //   var laneNumber = Math.floor(Math.random() * board.lanes.length)
	  //
	  //   if (Math.random() > 0.96) {
	  //     new Bullet(board, graphics, board.lanes[laneNumber], computerPlayer)
	  //     sounds.bullet.playSound()
	  //   }
	  // },

	  gameOver: function gameOver() {
	    var deadPlayer = this.players.find(function (player) {
	      return player.health <= 0;
	    });
	    if (deadPlayer) {
	      return true;
	    } else {
	      return false;
	    }
	  },

	  reset: function reset() {
	    this.board.bullets = [];
	    this.paused = false;
	    this.assets.sounds.marioGameover.played = false;
	    var characters = this.board.characters.good.concat(this.board.characters.bad);
	    characters.forEach(function (lane) {
	      lane.alive = true;
	    });
	    this.players.forEach(function (player) {
	      player.score = 0;
	      player.health = this.startingHealth;
	    }, this);
	  }

	};

	//////////////////////////////////////////////////////

	// function firingKeyPressed(fireButtons, keyCode) {
	//   return Array.isArray(fireButtons[keyCode])
	// }

	function timeNow() {
	  return new Date().getTime();
	}

	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Lane = __webpack_require__(3);

	function Board(game, graphics, size) {
	  this.game = game;
	  this.graphics = graphics;
	  this.size = { width: size.width,
	    height: size.height,
	    gamePane: size.gamePane,
	    infoPane: size.infoPane };
	  this.laneCount = 5;
	  this.lanes = [];
	  this.bullets = [];
	  this.characters = {
	    good: [graphics.mario, graphics.luigi, graphics.yoshi, graphics.peach, graphics.toad],
	    bad: [graphics.goomba, graphics.evilFlower, graphics.bowser, graphics.footballguy, graphics.koopaTroopa]
	  };
	  for (var i = 0; i < this.laneCount; i++) {
	    this.addLane();
	  }
	}

	Board.prototype = {
	  addLane: function addLane() {
	    var laneNumber = this.lanes.length;
	    return new Lane(this, laneNumber);
	  },

	  playerBullets: function playerBullets() {
	    return this.bullets.filter(function (bullet) {
	      return bullet.velocity < 0;
	    });
	  },

	  HandleAllCollisions: function HandleAllCollisions(game) {
	    var bombsDestroyed = clearHeadBullets(this, game);
	    clearShortBullets(this.playerBullets());
	    return bombsDestroyed;
	  }
	};

	////////////////////////////////////////////

	function clearHeadBullets(self, game) {
	  var bombsDestroyed = 0;
	  self.lanes.forEach(function (lane) {
	    var headBullets = [lane.frontUpBullet(), lane.frontDownBullet()];
	    if (removeCollidingBullets(headBullets)) {
	      game.assets.sounds.bulletsCollide.playSound();
	      bombsDestroyed++;
	    }
	    clearOffScreenBullets(game, headBullets);
	  });
	  return bombsDestroyed;
	}

	function clearOffScreenBullets(game, bullets) {
	  bullets.forEach(function (bullet) {
	    if (bullet && offScreen(bullet)) {
	      var laneNumber = game.board.lanes.indexOf(bullet.lane);
	      var goodGuy = game.board.characters.good[laneNumber];
	      var badGuy = game.board.characters.bad[laneNumber];

	      game.assets.sounds.explosion.playSound();
	      bullet.destroyBullet();
	      if (bullet.velocity > 0) {
	        goodGuyHit(game, bullet, goodGuy);
	      } else {
	        badGuyHit(game, bullet, badGuy);
	      }
	    }
	  });
	}

	function clearShortBullets(playerBullets) {
	  playerBullets.forEach(function (bullet) {
	    if (bullet.travelComplete()) {
	      bullet.destroyBullet();
	    }
	  });
	}

	function offScreen(bullet) {
	  var downBulletOffScreen = bullet.velocity > 0 && bullet.y >= bullet.board.size.height - bullet.height;
	  var upBulletOffScreen = bullet.velocity < 0 && bullet.y <= 0;
	  return downBulletOffScreen || upBulletOffScreen;
	}

	function goodGuyHit(game, bullet, goodGuy) {
	  if (goodGuy.alive) {
	    goodGuy.alive = false;
	    otherPlayer(game, bullet.player).reduceHealth(2);
	    game.assets.sounds.marioMamamia.playSound();
	  } else {
	    otherPlayer(game, bullet.player).reduceHealth(1);
	  }
	}

	function badGuyHit(game, bullet, badGuy) {
	  if (badGuy.alive) {
	    badGuy.alive = false;
	    bullet.player.score += 50;
	    game.assets.sounds.marioYippee.playSound();
	  } else {
	    bullet.player.score += 20;
	    game.assets.sounds.marioHappy.playSound();
	  }
	}

	function otherPlayer(game, player) {
	  return game.players.find(function (playerFromCollection) {
	    return playerFromCollection !== player;
	  });
	}

	function removeCollidingBullets(bullets) {
	  if (opposingBulletsExist(bullets[0], bullets[1])) {
	    return destroyIfCollided(bullets[0], bullets[1]);
	  }
	}

	function opposingBulletsExist(upBullet, downBullet) {
	  return upBullet && downBullet;
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

	module.exports = Board;

/***/ },
/* 3 */
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
	    var self = this;
	    return this.board.bullets.filter(function (bullet) {
	      return bullet.lane.x === self.x;
	    });
	  },

	  frontDownBullet: function frontDownBullet() {
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
/* 4 */
/***/ function(module, exports) {

	'use strict';

	function Player(game, direction) {
	  this.game = game;
	  this.fireDirection = direction;
	  this.score = 0;
	  this.health = game.startingHealth;
	  this.game.players.push(this);
	  this.shots = { shootTime: 0,
	    minimumDelay: 150 };
	  this.shots.goodDelay = game.shotDelay * 0.8;
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
	  this.y = startingY(board, player, this.graphic.height, graphics.cannon);
	  this.distance = { traveled: 0,
	    bad: 150,
	    good: board.size.height + 100 };
	  this.distance.allowed = this.distanceAllowed(type);
	  this.board.bullets.push(this);
	}

	Bullet.prototype = {
	  update: function update() {
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
	  },

	  travelComplete: function travelComplete() {
	    return this.distance.allowed - this.distance.traveled <= 0;
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

	function startingY(board, player, height, cannon) {
	  if (player.fireDirection === 'up') {
	    return board.size.height - cannon.height;
	  } else {
	    return -height + cannon.height;
	  }
	}

	module.exports = Bullet;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var Screenwriter = function Screenwriter(context, board, assets) {
	  this.context = context;
	  this.board = board;
	  this.assets = assets;
	};

	Screenwriter.prototype = {
	  drawBullets: function drawBullets() {
	    for (var i = 0; i < this.board.bullets.length; i++) {
	      var bullet = this.board.bullets[i];
	      var graphic = bullet.graphic;
	      if (bullet.player.fireDirection === 'up') {
	        drawRotatedImage(this.context, graphic, bullet.x, bullet.y, 0);
	      } else {
	        drawRotatedImage(this.context, graphic, bullet.x, bullet.y, 180);
	      }
	    }
	  },

	  drawCannons: function drawCannons(players) {
	    for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
	      var player = players[playerIndex];
	      var graphic = this.board.graphics.cannon;
	      for (var laneIndex = 0; laneIndex < this.board.lanes.length; laneIndex++) {
	        var lane = this.board.lanes[laneIndex];
	        var graphicX = lane.x - graphic.width / 2;
	        if (player.fireDirection === 'up') {
	          var graphicY = this.board.size.height - graphic.height;
	          drawRotatedImage(this.context, graphic, graphicX, graphicY, 0);
	        } else {
	          drawRotatedImage(this.context, graphic, graphicX, 0, 180);
	        }
	      }
	    }
	  },

	  drawCharacters: function drawCharacters() {
	    var goodGuys = this.board.characters.good;
	    var badGuys = this.board.characters.bad;
	    goodGuys.forEach(function (character, index) {
	      if (character.alive) {
	        drawAnimatedImage(character, this.board.lanes[index].x, this.board.size.height - character.height, this.context);
	      }
	    }, this);
	    badGuys.forEach(function (character, index) {
	      if (character.alive) {
	        drawAnimatedImage(character, this.board.lanes[index].x, 0, this.context);
	      }
	    }, this);
	  },

	  drawTimingMeter: function drawTimingMeter(players) {
	    var player = players.find(function (player) {
	      return player.fireDirection === 'up';
	    });
	    var timeMeterHeight = Math.min(100, player.timeSinceLastShot() / player.shots.goodDelay * 100);
	    this.context.fillStyle = 'red';
	    if (timeMeterHeight === 100) {
	      this.context.fillStyle = 'lightgreen';
	    }
	    this.context.fillRect(4, this.board.size.height - timeMeterHeight, 8, timeMeterHeight);
	  },

	  drawInfoPane: function drawInfoPane(player) {
	    var middleXOfInfoPane = this.board.size.gamePane + this.board.size.infoPane / 2;
	    this.context.fillStyle = "white";
	    this.context.strokeStyle = "black";
	    this.context.globalAlpha = 0.5;
	    this.context.fillRect(this.board.size.width - this.board.size.infoPane, 0, this.board.size.infoPane, this.board.size.height);
	    this.context.globalAlpha = 1;
	    this.context.textAlign = "center";

	    this.context.lineWidth = 2;
	    this.context.font = "bold 35px Verdana";
	    this.context.fillText("Score", middleXOfInfoPane, 40);
	    this.context.strokeText("Score", middleXOfInfoPane, 40);
	    this.context.fillText("Health", middleXOfInfoPane, 250);
	    this.context.strokeText("Health", middleXOfInfoPane, 250);

	    this.context.font = "50px Verdana";
	    this.context.fillText(player.score, middleXOfInfoPane, 90);
	    this.context.strokeText(player.score, middleXOfInfoPane, 90);
	    this.context.fillText(player.health, middleXOfInfoPane, 300);
	    this.context.strokeText(player.health, middleXOfInfoPane, 300);
	  },

	  showStartScreen: function showStartScreen() {
	    this.context.clearRect(0, 0, this.board.size.gamePane, this.board.size.height);
	    var centerOfGamePane = { x: this.board.size.gamePane / 2, y: this.board.size.height / 2 };
	    this.context.font = "120px Verdana";
	    this.context.fillStyle = "black";
	    this.context.fillText("Bonus", centerOfGamePane.x, centerOfGamePane.y - 100);
	    this.context.fillText("Round", centerOfGamePane.x, centerOfGamePane.y + 20);
	    this.context.font = "50px Verdana";
	    this.context.fillText("Press Fire to start!", centerOfGamePane.x, centerOfGamePane.y + 150);
	    this.context.fillText("⬛️ ⬛️ ⬛️ ⬛️ ⬛️", centerOfGamePane.x, centerOfGamePane.y + 370);
	    this.context.font = "30px Verdana";
	    this.context.fillStyle = 'red';
	    this.context.fillText("Fire keys:", centerOfGamePane.x, centerOfGamePane.y + 300);
	    this.context.font = '20px Verdana';
	    this.context.fillStyle = 'white';
	    this.context.textAlign = 'left';
	    this.context.fillText("Spc       J       K        L         ;", centerOfGamePane.x - 153, centerOfGamePane.y + 357);
	    this.context.fillStyle = 'black';
	    this.context.textAlign = 'center';
	  },

	  announceGameOver: function announceGameOver() {
	    this.context.clearRect(0, 0, this.board.size.gamePane, this.board.size.height);
	    var middleXOfGamePane = this.board.size.gamePane / 2;
	    this.context.font = "120px Verdana";
	    this.context.fillStyle = "red";
	    this.context.fillText("Game", middleXOfGamePane, this.board.size.height / 2);
	    this.context.fillText("Over", middleXOfGamePane, this.board.size.height / 2 + 120);
	    this.context.font = "30px Verdana";
	    this.context.fillText("Fire for another round!", middleXOfGamePane, this.board.size.height / 2 + 240);
	  }

	};

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
	  x = x - spriteWidth / 2 || 0;
	  y = y || 0;
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

	function timeNow() {
	  return new Date().getTime();
	}

	module.exports = Screenwriter;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Bullet = __webpack_require__(5);

	var Listeners = function Listeners(game) {
	  this.game = game;
	  // document.addEventListener('keyup', startGame.bind(null, this.game))
	  // document.addEventListener('keydown', keyPress.bind(null, this.game))
	  // document.addEventListener('keydown', pauseGame.bind(null, this.game))
	};

	Listeners.prototype = {
	  keyPress: function keyPress() {
	    document.addEventListener('keydown', _keyPress.bind(null, this.game));
	  },

	  pauseGame: function pauseGame() {
	    document.addEventListener('keydown', _pauseGame.bind(null, this.game));
	  },

	  startGame: function startGame() {
	    console.log("listening for startgame");
	    document.addEventListener('keyup', _startGame.bind(null, this.game));
	  },

	  stopListeningForStartGame: function stopListeningForStartGame() {
	    console.log("STOPPED listening for startgame");
	    document.removeEventListener('keyup', _startGame);
	  }

	};

	function _startGame(self, keyPressed) {
	  // Enter key is keyCode 13
	  var fireKeys = [32, 74, 75, 76, 186];
	  if (fireKeys.indexOf(keyPressed.keyCode) > -1) {
	    self.playAgain = true;
	    self.justStarted = false;
	  }
	}

	function _keyPress(game, button) {
	  if (firingKeyPressed(game.fireButtons, button.keyCode)) {
	    var player = game.players[game.fireButtons[button.keyCode][1]];
	    if (player.pastMinimumWait()) {
	      new Bullet(game.board, game.assets.graphics, game.board.lanes[game.fireButtons[button.keyCode][0]], player, player.shotStyle());
	      if (!game.paused && !game.gameOver()) {
	        game.assets.sounds.bullet.playSound();
	      }
	      player.shots.shootTime = timeNow();
	    }
	  }
	}

	function firingKeyPressed(fireButtons, keyCode) {
	  return Array.isArray(fireButtons[keyCode]);
	}

	function _pauseGame(game, keyPressed) {
	  // ~/` (tilda/backtick) is keyCode 192
	  if (keyPressed.keyCode === 192 && !game.justStarted && !game.gameOver()) {
	    game.paused = !game.paused;
	    game.assets.sounds.pause.playSound();
	    if (game.paused) {
	      game.context.font = 'bold 100px Verdana';
	      game.context.lineWidth = 5;
	      game.context.strokeStyle = 'red';
	      game.context.strokeText("PAUSED", game.board.size.gamePane / 2, game.board.size.height / 2);
	    }
	  }
	}

	function timeNow() {
	  return new Date().getTime();
	}

	module.exports = Listeners;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var Assets = function Assets() {
	  this.graphics = {
	    bulletBlack: newImage('graphics/bullet_hi-res.gif'),
	    bulletGray: newImage('graphics/bullet_weak_hi-res.gif'),
	    cannon: newImage('graphics/cannon.gif'),
	    mario: newImage('graphics/waving_mario_sprites.gif', 2),
	    luigi: newImage('graphics/waving_luigi_sprites.gif', 2),
	    yoshi: newImage('graphics/walking_yoshi_sprites.gif', 2),
	    peach: newImage('graphics/waving_peach_sprites.gif', 2),
	    toad: newImage('graphics/waving_toad_sprites.gif', 2),
	    bowser: newImage('graphics/bowser_sprites.gif', 6),
	    goomba: newImage('graphics/goomba_sprites.gif', 2),
	    footballguy: newImage('graphics/football_player_sprites.gif', 8),
	    evilFlower: newImage('graphics/evil_flower_sprites.gif', 2),
	    koopaTroopa: newImage('graphics/koopa_troopa_sprites.gif', 2)
	  };

	  this.sounds = {
	    bullet: new SoundPool(50, 'sounds/super_mario_3_cannon.mp3'),
	    explosion: new SoundPool(50, 'sounds/explosion.mp3'),
	    bulletsCollide: new SoundPool(50, 'sounds/coin.mp3'),
	    pause: new SoundPool(1, 'sounds/pause.mp3'),
	    gameover: new SoundPool(1, 'sounds/gameover.mp3'),
	    marioGameover: new SoundPool(1, 'sounds/mario_gameover.mp3'),
	    marioMamamia: new SoundPool(5, 'sounds/mario_mamamia.mp3'),
	    marioYippee: new SoundPool(2, 'sounds/mario_yippee.mp3'),
	    marioHappy: new SoundPool(2, 'sounds/mario_happy.mp3')
	    // marioHurt = new SoundPool(1, 'sounds/mario_hurt.mp3')
	    // luigiHurt = new SoundPool(1, 'sounds/luigi_hurt.mp3')
	    // yoshiHurt = new SoundPool(1, 'sounds/yoshi_hurt.wav')
	    // peachHurt = new SoundPool(1, 'sounds/peach_hurt.mp3')
	    // toadHurt = new SoundPool(1, 'sounds/toad_hurt.mp3')
	  };

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
	      sound.volume = 0.4;
	      sound.load();
	      this.pool[i] = sound;
	    }

	    var currentSound = 0;
	    this.playSound = function () {
	      if (this.pool[currentSound].currentTime === 0 || this.pool[currentSound].ended) {
	        this.pool[currentSound].play();
	      }
	      currentSound = (currentSound + 1) % size;
	    };
	  }
	};

	module.exports = Assets;

/***/ }
/******/ ]);