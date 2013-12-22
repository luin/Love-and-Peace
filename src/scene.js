Crafty.scene('Game', function() {
  Game.map.data.forEach(function(data, index) {
    if (!data) {
      return;
    }
    var tileCount = Game.tiles.count[0];
    var mapX = index % tileCount;
    var mapY = parseInt(index / tileCount);

    if (Game.sprite[data]) {
      var componentName = ['Grid', Game.sprite[data]];
      if (['LAND', 'LAND_LEFT', 'LAND_MID', 'LAND_RIGHT', 'STONE', 'STONE_WITH_MONEY'].indexOf(Game.sprite[data]) !== -1) {
        componentName.push('platform');
      }
      Crafty.e(componentName.join(','))
            .at(mapX, mapY);
    }

  });

  Crafty.e('Player')
        .at(0, 0, 62, 71);
});

Crafty.scene('Loading', function() {
  Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({ x: 0, y: Game.map.height /2 - 24, w: Game.map.width });
  Crafty.load(['assets/images/tiles.png', 'assets/images/character.png'], function() {
    var spriteData = {};
    Object.keys(Game.sprite).forEach(function(spriteIndex) {
      var spriteName = Game.sprite[spriteIndex];
      var spriteX = (spriteIndex - 1) % 7;
      var spriteY = parseInt((spriteIndex - 1) / 7);
      spriteData[spriteName] = [spriteX, spriteY];
    });
    Crafty.sprite(124, 'assets/images/tiles.png', spriteData);
    Crafty.sprite(1, 'assets/images/player.png', {
      SprPlayer: [0, 0, 124, 142]
    });

    $.getJSON('map/level1.json', function(data) {
      Game.map.data = data.layers[0].data;
      Crafty.scene('Game');
    });
  });
});
