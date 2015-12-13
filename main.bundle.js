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

	var assets = allAssets();
	var assetCount = Object.keys(assets).length;
	var loadedCount = 0;
	startGame(assets);

	function allAssets() {
	  var assets = {};
	  assets.bullet = newImage('../graphics/bullet.gif');
	  assets.cannon = newImage('../graphics/cannon.gif');

	  return assets;
	}

	function startGame(assets) {
	  for (var key in assets) {
	    assets[key].onload = function () {
	      loadedCount++;
	      if (loadedCount === assetCount) {
	        new Game(assets);
	      }
	    };
	  }
	}

	function newImage(src) {
	  var image = new Image();
	  image.src = src;
	  return image;
	}

	/*
	-----scoring
	-----health/game over
	-automate random dropping of bullets from sky
	-

	*/

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Board = __webpack_require__(2);
	var Bullet = __webpack_require__(5);

	var Game = function Game(assets) {
	  var canvas = document.getElementById('gunner');
	  document.addEventListener('keydown', keyPress, true);
	  var context = canvas.getContext('2d');

	  this.paused = false;
	  var playAgain = false;
	  var startingHealth = 100;
	  var board = new Board(assets, { width: canvas.width,
	    height: canvas.height,
	    gamePane: canvas.width / 7 * 5,
	    infoPane: canvas.width / 7 * 2 }, startingHealth);

	  function keyPress(button) {
	    var buttons = { 78: [0, 0], 85: [1, 0], 73: [2, 0], 79: [3, 0], 80: [4, 0],
	      81: [0, 1], 87: [1, 1], 69: [2, 1], 82: [3, 1], 86: [4, 1] };
	    if (Array.isArray(buttons[button.keyCode])) {
	      new Bullet(board, assets, board.lanes[buttons[button.keyCode][0]], board.players[buttons[button.keyCode][1]]);
	    }
	  }

	  function enterKey(keyPressed) {
	    // Enter key is keyCode 13
	    if (keyPressed.keyCode === 13) {
	      playAgain = true;
	    }
	  }

	  function runGame(context, board) {
	    self.update(board);
	    self.draw(context, board);
	  }

	  function gameOver() {
	    var deadPlayer = board.players.find(function (player) {
	      return player.health <= 0;
	    });
	    if (deadPlayer) {
	      return true;
	    } else {
	      return false;
	    }
	  }

	  function waitForRestart(self) {
	    self.paused = self.paused || true;
	    self.announceGameOver(context, board);

	    document.addEventListener('keyup', enterKey, true);
	    if (playAgain) {
	      self.reset(board, startingHealth);
	      playAgain = false;
	      document.removeEventListener('keyup', enterKey);
	    }
	  }

	  ////////// Game loop //////////
	  var self = this;
	  requestAnimationFrame(function gameLoop() {
	    if (!self.paused) {
	      runGame(context, board);
	    }
	    if (gameOver()) {
	      waitForRestart(self);
	    }

	    requestAnimationFrame(gameLoop);
	  });
	  ////////// Game loop //////////
	};

	Game.prototype = {
	  update: function update(board) {
	    function clearCollisions(board) {
	      if (board.bullets.length > 1) {
	        return HandleAllCollisions(board);
	      } else {
	        return 0;
	      }
	    }

	    board.players[0].addPoints(clearCollisions(board));
	    var bullets = board.bullets;
	    for (var i = 0; i < bullets.length; i++) {
	      bullets[i].update();
	    }
	  },

	  draw: function draw(context, board) {
	    context.clearRect(0, 0, board.size.width, board.size.height);
	    drawBullets(context, board);
	    drawCannons(context, board);
	    drawInfoPane(context, board);
	  },

	  announceGameOver: function announceGameOver(context, board) {
	    context.clearRect(0, 0, board.size.gamePane, board.size.height);
	    var middleXOfGamePane = board.size.gamePane / 2;
	    context.font = "120px Verdana";
	    context.fillText("Game", middleXOfGamePane, board.size.height / 2);
	    context.fillText("Over", middleXOfGamePane, board.size.height / 2 + 120);
	    context.font = "30px Verdana";
	    context.fillText("Press Enter for another round!", middleXOfGamePane, board.size.height / 2 + 240);
	  },

	  reset: function reset(board, startingHealth) {
	    board.bullets = [];
	    board.players.forEach(function (player) {
	      player.score = 0;
	      player.health = startingHealth;
	      this.paused = false;
	    }, this);
	  }

	};

	function drawBullets(context, board) {
	  for (var i = 0; i < board.bullets.length; i++) {
	    var bullet = board.bullets[i];
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
	    var graphic = player.cannonGraphic;

	    for (var laneIndex = 0; laneIndex < board.lanes.length; laneIndex++) {
	      var lane = board.lanes[laneIndex];
	      var graphicX = lane.x - graphic.width / 2;
	      // debugger
	      if (player.fireDirection === 'up') {
	        var graphicY = board.size.height - graphic.height;
	        drawRotatedImage(context, graphic, graphicX, graphicY, 0);
	      } else {
	        context.drawImage(graphic, graphicX, 0);
	      }
	    }
	  }
	  if (board.bullets.length > 0) {
	    drawRotatedImage(context, board.bullets[0].graphic, 0, 0, 0);
	    // debugger
	  }
	}

	function drawInfoPane(context, board) {
	  var middleXOfInfoPane = board.size.gamePane + board.size.infoPane / 2;
	  context.textAlign = "center";

	  context.font = "25px Verdana";
	  context.fillText("Score", middleXOfInfoPane, 30);
	  context.fillText("Health", middleXOfInfoPane, 250);

	  context.font = "50px Verdana";
	  context.fillText(board.players[0].score, middleXOfInfoPane, 80);
	  context.fillText(board.players[0].health, middleXOfInfoPane, 300);
	}

	var TO_RADIANS = Math.PI / 180;
	function drawRotatedImage(context, image, x, y, angle) {
	  context.save();
	  context.translate(x, y);
	  context.rotate(angle * TO_RADIANS);
	  context.drawImage(image, -(image.width / 2), -(image.height / 2));
	  context.restore();
	}

	function HandleAllCollisions(board) {
	  var collisionCount = 0;
	  board.lanes.forEach(function (lane) {
	    var upBullet = lane.frontUpBullet();
	    var downBullet = lane.frontDownBullet();
	    if (opposingBulletsExist(upBullet, downBullet)) {
	      if (destroyIfCollided(upBullet, downBullet)) {
	        collisionCount++;
	      }
	    }
	  });
	  return collisionCount;
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

	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Player = __webpack_require__(3);
	var Lane = __webpack_require__(4);
	var Bullet = __webpack_require__(5);

	function Board(assets, size, startingHealth) {
	  this.size = { width: size.width,
	    height: size.height,
	    gamePane: size.gamePane,
	    infoPane: size.infoPane
	  };
	  this.laneCount = 5;
	  this.lanes = [];
	  this.bullets = [];
	  this.players = [];
	  this.addPlayer(assets, 'up', startingHealth);
	  this.addPlayer(assets, 'down', startingHealth);
	  for (var i = 0; i < this.laneCount; i++) {
	    this.addLane();
	  }
	}

	Board.prototype = {
	  addPlayer: function addPlayer(assets, direction, startingHealth) {
	    return new Player(this, assets, direction, startingHealth);
	  },

	  addLane: function addLane() {
	    var laneNumber = this.lanes.length;
	    return new Lane(this, laneNumber);
	  },

	  addBullet: function addBullet(lane, player) {
	    // return new Bullet(this, lane, player)
	  }

	};

	module.exports = Board;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	function Player(board, assets, direction, startingHealth) {
	  this.board = board;
	  this.cannonGraphic = assets.cannon;
	  this.fireDirection = direction;
	  this.score = 0;
	  this.health = startingHealth;
	  this.board.players.push(this);
	}

	module.exports = Player;

	Player.prototype = {
	  addPoints: function addPoints(points) {
	    this.score = this.score + points;
	  },

	  reduceHealth: function reduceHealth(hitPoints) {
	    this.health -= hitPoints;
	  }
	};

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

	function Bullet(board, assets, lane, player) {
	  this.board = board;
	  this.lane = lane;
	  this.player = player;
	  this.velocity = velocity(player);
	  this.graphic = assets.bullet;
	  this.height = this.graphic.height;
	  this.width = this.graphic.width;
	  this.x = lane.x - this.width / 2;
	  this.y = startingY(player, this.graphic.height);
	  this.board.bullets.push(this);
	}

	Bullet.prototype = {
	  update: function update() {
	    self = this;
	    function offScreen() {
	      return self.y > self.board.size.height || self.y < 0 - self.graphic.height;
	    }

	    function otherPlayer(player) {
	      return self.board.players.find(function (playerFromCollection) {
	        return playerFromCollection !== player;
	      });
	    }

	    this.y += this.velocity;
	    if (offScreen()) {
	      this.destroyBullet();
	      otherPlayer(this.player).reduceHealth(1);
	    }
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

	function graphic(assets, player) {
	  if (player.fireDirection === 'up') {
	    return assets.bulletUp;
	  } else {
	    return assets.bulletDown;
	  }
	}

	function startingY(player, height) {
	  if (player.fireDirection === 'up') {
	    return player.board.size.height;
	  } else {
	    return -height;
	  }
	}

	module.exports = Bullet;

/***/ }
/******/ ]);