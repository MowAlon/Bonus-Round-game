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

	var bulletUp = new Image();
	bulletUp.src = '../graphics/bullet_up.gif';
	var bulletDown = new Image();
	bulletDown.src = '../graphics/bullet_down.gif';

	var assets = {
	  bulletUp: bulletUp,
	  bulletDown: bulletDown
	};

	document.addEventListener('keydown', function () {
	  console.log('KEYPRESS!!!!!!!');
	});

	assets.bulletUp.onload = function () {
	  assets.bulletDown.onload = function () {
	    new Game(assets);
	  };
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Board = __webpack_require__(2);
	var Bullet = __webpack_require__(5);

	var Game = function Game(assets) {
	  var canvas = document.getElementById('gunner');
	  document.addEventListener('keydown', keyPress, true);
	  // canvas.focus()
	  var context = canvas.getContext('2d');
	  var board = new Board({ width: canvas.width, height: canvas.height });

	  function keyPress(button) {
	    var buttons = { 78: [0, 0], 85: [1, 0], 73: [2, 0], 79: [3, 0], 80: [4, 0],
	      81: [0, 1], 87: [1, 1], 69: [2, 1], 82: [3, 1], 86: [4, 1] };
	    if (Array.isArray(buttons[button.keyCode])) {
	      new Bullet(board, assets, board.lanes[buttons[button.keyCode][0]], board.players[buttons[button.keyCode][1]]);
	    };
	  };

	  var self = this;

	  requestAnimationFrame(function gameLoop() {
	    self.update(board);
	    self.draw(context, board);

	    requestAnimationFrame(gameLoop);
	  });
	};

	Game.prototype = {
	  update: function update(board) {
	    function clearCollisions(board) {
	      if (board.bullets.length > 1) {
	        HandleAllCollisions(board);
	      }
	    }

	    clearCollisions(board);
	    var bullets = board.bullets;
	    for (var i = 0; i < bullets.length; i++) {
	      bullets[i].update();
	    }
	  },

	  draw: function draw(context, board) {
	    context.clearRect(0, 0, board.size.width, board.size.height);
	    for (var i = 0; i < board.bullets.length; i++) {
	      var graphic = board.bullets[i].graphic;
	      var bullet = board.bullets[i];
	      context.drawImage(graphic, bullet.x, bullet.y);
	    }
	  }

	};

	function HandleAllCollisions(board) {
	  board.lanes.forEach(function (lane) {
	    var upBullet = lane.frontUpBullet();
	    var downBullet = lane.frontDownBullet();
	    if (opposingBulletsExist(upBullet, downBullet)) {
	      checkTwoBulletsForCollision(upBullet, downBullet);
	    }
	  });
	}

	function opposingBulletsExist(upBullet, downBullet) {
	  return upBullet !== undefined && downBullet !== undefined;
	}

	function checkTwoBulletsForCollision(upBullet, downBullet) {
	  if (bodiesCollide(upBullet, downBullet)) {
	    destroyBullets([upBullet, downBullet]);
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

	function Board(size) {
	  this.size = { width: size.width, height: size.height };
	  this.laneCount = 5;
	  this.lanes = [];
	  this.bullets = [];
	  this.players = [];
	  this.addPlayer('up');
	  this.addPlayer('down');
	  for (var i = 0; i < this.laneCount; i++) {
	    this.addLane();
	  }
	}

	Board.prototype = {
	  addPlayer: function addPlayer(direction) {
	    return new Player(this, direction);
	  },

	  addLane: function addLane() {
	    var laneNumber = this.lanes.length;
	    return new Lane(this, laneNumber);
	  },

	  addBullet: function addBullet(lane, player) {
	    return new Bullet(this, lane, player);
	  }

	};

	module.exports = Board;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	function Player(board, direction) {
	  this.board = board;
	  this.fireDirection = direction;
	  this.health = 100;
	  this.board.players.push(this);
	}

	module.exports = Player;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	function Lane(board, laneNumber) {
	  this.board = board;
	  var laneWidth = this.board.size.width / board.laneCount;
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
	  // this.player = player
	  this.velocity = velocity(player);
	  this.graphic = graphic(assets, player);
	  var self = this;
	  // this.graphic.onload = function() {
	  self.height = self.graphic.naturalHeight;
	  self.width = self.graphic.naturalWidth;
	  self.x = lane.x - self.width / 2;
	  self.y = startingY(player, self.graphic.naturalHeight);
	  // }
	  this.board.bullets.push(this);
	}

	Bullet.prototype = {
	  update: function update() {
	    this.y += this.velocity;
	    if (this.y > this.board.size.height || this.y < 0 - this.graphic.naturalHeight) {
	      this.destroyBullet();
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
	  // var image = new Image()
	  // image.src = '../graphics/bullet_' + player.fireDirection + '.gif'
	  // return image
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