"strict mode";



var conf = {
  tiles: [
    [0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6],
           [1,1], [1,2], [1,3], [1,4], [1,5], [1,6],
                  [2,2], [2,3], [2,4], [2,5], [2,6],
                         [3,3], [3,4], [3,5], [3,6],
                                [4,4], [4,5], [4,6],
                                       [5,5], [5,6],
                                              [6,6],
  ],
  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  initialNumOfTilesForPlayer: 6
};



var Tile = function(s1, s2) {
  this.spot1 = s1;
  this.spot2 = s2;
  this.htmlElement = (function () {
    return document.getElementById("tile" + s1 + s2);
  }());
  this.x = 0; // current position, coordinate x
  this.y = 0; // current position, coordinate y
  this.d = 0; // current degree
};
Tile.prototype = {
  transform: function() {
    this.htmlElement.setAttribute('transform',
        'translate(' + this.x + ', ' + this.y + ') ' +
        'rotate(' + this.d + ', ' + 21 + ', ' + 41 + ')');
  },
  moveTo: function(x, y) {
    this.x = x;
    this.y = y;
    this.transform();
  },
  rotate: function(d) {
    this.d = this.d + d;
    if (this.d >= 360) { this.d = this.d - 360; }
    if (this.d <= -360) { this.d = this.d + 360; }
    this.transform();
  },
  // difference: setDegree() sets specified degree of rotation
  //             rotate()    rotates element in specified
  //                         direction from its current state
  setDegree: function(d) {
    this.d = d;
    this.transform();
  }
};



var Player = function(name) {
  this.name = name;
  this.type = (function () {
    if (name === undefined) {
      return 'computer';
    }
    else {
      return 'human';
    }
  }());
  this.tiles = [];
  this.takeFromBank = function() {
    var randomTileNum = conf.getRandomInt(0, this.tiles.length - 1);
    var randomTile = game.bank.tiles[randomTileNum];
    this.tiles.push(randomTile);
    // remove tile from game bank and update tilesLeft element value
    game.bank.tiles.splice(randomTileNum, 1);
    document.getElementById('tilesLeft').textContent = game.bank.tiles.length;
    // TODO: calculate free space to put tile just taken from bank
    var freeX = 0,
        freeY = 0;
    randomTile.moveTo(freeX, freeY);
  };
};



var game = {
  getBoardWidth: function() {
    return Math.round(
        document.getElementById('board').getBoundingClientRect().width
      );
  },

  bank: {
    tiles: [],
    init: function () {
      this.tiles = [];
      for (var i = 0; i <= conf.tiles.length - 1; i++) {
        this.tiles.push(new Tile(conf.tiles[i][0], conf.tiles[i][1]));
        this.tiles[i].constructor = Tile;
      }
      // update tilesLeft element
      document.getElementById('tilesLeft').textContent = this.tiles.length;
    },
  },

  players: [],

  distributeTiles: function() {
    for (var j = 1; j <= conf.initialNumOfTilesForPlayer; j++) {
      for (var i = 0; i <= this.players.length - 1; i++) {
        this.players[i].takeFromBank();
      }
    }
  },

  init: function() {
    var startGameButton = document.getElementById('startGame');
    // show startGame button
    startGameButton.addEventListener('click', game.start);
    startGameButton.removeAttribute('class');
  },

  start: function() {
    var playerName = document.getElementById('playerName').value;
    // setup bank
    game.bank.init();
    // create players
    game.players[0] = new Player();
    game.players[1] = new Player(playerName);
    // distribute initial set of tiles to each player
    game.distributeTiles();
    game.bank.tiles[0].setDegree(0);
    game.bank.tiles[0].moveTo(100, 100);
    game.bank.tiles[0].rotate(90);
  }

};



window.onload = game.init();
