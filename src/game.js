var Game = {
  map: {
    width: 980,
    height: 62 * 12
  },
  tiles: {
    size: 62,
    count: [100, 12]
  },
  sprite: {
    8: 'LAND_LEFT',
    2: 'LAND_MID',
    10: 'LAND_RIGHT',
    9: 'LAND',
    5: 'WATER_TOP',
    12: 'WATER',
    4: 'STONE_WITH_MONEY',
    11: 'STONE',
    6: 'CACTUS',
    13: 'GRASS',
    7: 'START',
    1: 'END'
  }
};

Crafty.init(Game.map.width, Game.map.height, document.getElementById('game'));
Crafty.background('url(./assets/images/bg.png)');
Crafty.scene('Loading');
