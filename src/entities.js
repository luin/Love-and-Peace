Crafty.c('Grid', {
  init: function() {
    this.requires('2D, DOM');
  },
  at: function(x, y, w, h) {
    if (!w) {
      w = Game.tiles.size;
    }
    if (!h) {
      h = Game.tiles.size;
    }
    this.attr({
      w: w,
      h: h
    });
    this.attr({
      x: x * Game.tiles.size,
      y: y * Game.tiles.size
    });
    return this;
  }
});

Crafty.c('Player', {
  init: function() {
    this.requires('Grid, SpriteAnimation, SprPlayer, Gravity, InertialMove, Collision, VIP');
    this.gravity('platform').gravityConst(0.8);
    this.collision([0, 20], [this.w, 20], [this.w, this.h], [0, this.h]);
    this.inertialMove();
    this.vip();
    this.init([0,0], [0,1], [1,1], [1, 0]);
    this.bind('EnterFrame', function() {
      if (this._movement) {
        var hitStones = this.hit('STONE');
        var hitStoneWithMoneys = this.hit('STONE_WITH_MONEY');
        var hits = hitStones || hitStoneWithMoneys;
        if (hitStones && hitStoneWithMoneys) {
          hits = hitStones.concat(hitStoneWithMoneys);
        }
        if (hits.length) {
          var hitObj = hits[0].obj;
          var w = this.w - Math.abs(hitObj.x - this.x);
          if (w <= 8 && hits.length === 1) {
            this.x = (hitObj.x - this.x) > 0 ? hitObj.x - this.w : hitObj.x + this.w;
          } else {
            this._up = 0;
            this.y = hitObj.y + hitObj.h;
          }
        }
      }
    });
  },
});

Crafty.c('InertialMove', {
  _maxSpeed: 30,
  _gx: 2,
  _moveStatus: {
    right: false,
    left: false
  },
  _currentSpeed: 0,
  _keydown: function (e) {
    if (e.key === 68) {
      this._moveStatus.right = true;
    } else if (e.key === 65) {
      this._moveStatus.left = true;
    } else if (e.key === 87) {
      this._up = true;
      this._moveStatus.up = true;
    }
  },
  _keyup: function (e) {
    if (e.key === 68) {
      this._moveStatus.right = false;
    } else if (e.key === 65) {
      this._moveStatus.left = false;
    } else if (e.key === 87) {
      this._moveStatus.up = false;
    }
  },
  _enterframe: function () {
    this._gx = 0;
    var moveStatus = 'stop';
    if (this._moveStatus.left !== this._moveStatus.right) {
      if (this._moveStatus.left) {
        moveStatus = 'left';
      } else {
        moveStatus = 'right';
      }
    }
    if (moveStatus === 'right' && this._currentSpeed < this._maxSpeed) {
      this._gx += 1;
      this.unflip();
    } else if (moveStatus === 'left' && this._currentSpeed > -this._maxSpeed) {
      this._gx -= 1;
      this.flip();
    } else if (moveStatus === 'stop' && this._currentSpeed) {
      this._gx = -1 * this._currentSpeed / Math.abs(this._currentSpeed);
    }
    this._currentSpeed += this._gx;
    this.x += this._currentSpeed / 5;
    if (this._up) {
      if (!this._moveStatus.up && this._gy < 19) {
        this._gy += 2;
      }
      this.y -= 19;
    }
  },

  _initializeControl: function () {
    return this.unbind("KeyDown", this._keydown)
    .unbind("KeyUp", this._keyup)
    .unbind("EnterFrame", this._enterframe)
    .bind("KeyDown", this._keydown)
    .bind("KeyUp", this._keyup)
    .bind("EnterFrame", this._enterframe);
  },

  inertialMove: function() {
    this._movement = {
      x: 0,
      y: 0
    };
    this._initializeControl();
    return this;
  }
});

Crafty.c('VIP', {
  _viewportX: 0,
  vip: function() {
    this.bind('EnterFrame', function() {
      if ((this.x - this._viewportX) > Game.map.width / 2) {
        this._viewportX = this.x - Game.map.width / 2;
        Crafty.viewport.scroll('_x', -this._viewportX);
      }
      if (this.x < this._viewportX) {
        this.x = this._viewportX;
        this._currentSpeed = 0;
      }
    });
  }
});
