define([], function () {
    return function (game, config) {
        var self = this;

        self.preload = function () {
            game.load.spritesheet("player", "images/player.png", 24, 21);
            return self;
        };

        self.create = function () {

            // adding the hero sprite
            self.sprite = game.add.sprite(config.x0, config.y0, "player");
            self.sprite.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true);
            self.sprite.animations.add('right', [9, 10, 11, 12, 13, 14, 15, 16, 17], 8, true);
            self.sprite.animations.add('explode', [24,25,26,27,28,29,30], 8);

            // enabling ARCADE physics for the  hero
            game.physics.enable(self.sprite, Phaser.Physics.ARCADE);
            self.sprite.body.setSize(14 / Math.abs(self.sprite.scale.x), 21 / Math.abs(self.sprite.scale.y));
            self.sprite.body.collideWorldBounds = true;

            // setting hero anchor point
            self.sprite.anchor.x = 0.5;
            self.sprite.anchor.y = 1.0;

            // handle keyboard
            game.input.keyboard.onDownCallback = self.onDownCallback;
            game.input.keyboard.onUpCallback = self.onUpCallback;

            return self;
        };

        self.startanimation = function() {
            var vx = self.sprite.body.velocity.x;
            if (vx>0)
                self.sprite.animations.play("right");
            else if (vx<0)
                self.sprite.animations.play("left");
            else
                self.sprite.animations.play("stop");
        };

        self.stopanimation = function() {
            self.sprite.animations.stop(null, true);
        };

        self.restart = function () {
            self.sprite.x = config.x0;
            self.sprite.y = config.y0;
            // setting hero gravity
            self.sprite.body.gravity.y = config.gravity;
            self.sprite.animations.play("stopright");
            return self;
        }

        self.suspend = function () {
            self.sprite.body.velocity.x = 0;
            self.sprite.body.velocity.y = 0;
            self.sprite.animations.stop(null, true);
            // setting hero gravity
            self.sprite.body.gravity.y = 0;
            return self;
        };

        self.left = function () {
            if (self.onFloor != true) return;

            if (self.sprite.body.velocity.x >= 0) {
                self.sprite.body.velocity.x = -config.speed;
                self.startanimation();
            }
            return self;
        };

        self.right = function () {
            if (self.onFloor != true) return;
            if (self.sprite.body.velocity.x <= 0) {
                self.sprite.body.velocity.x = config.speed;
                self.startanimation();
            }
            return self;
        };

        self.jump = function () {
            if (self.onFloor != true) return;
            if (self.sprite.body.velocity.y >= 0) {
                self.sprite.body.velocity.y = -config.jump;
            }
            self.stopanimation();
            return self;
        };

        self.stop = function () {
            if (self.sprite.body.velocity.x != 0) {
                self.sprite.body.velocity.x = 0;
            }
            self.stopanimation();
            return self;
        };

        self.explode = function () {
            self.sprite.animations.play("explode");
            return self;
        };

        self.onDownCallback = function (ev) {
            if (self.onFloor) {
                switch (ev.keyCode) {
                    case 39:
                        self.right();
                        break;
                    case 37:
                        self.left();
                        break;
                        break;
                    case 38: // UP
                        self.jump();
                        break;
                }
            }
            else {
                // nothing to do during flight
            }
        };
        self.onUpCallback = function (ev) {
            switch (ev.keyCode) {
                case 39:
                    self.stop();
                    break;
                case 37:
                    self.stop();
                    break;
                case 32:
                    // nothing to do with space
                    break;
            }
        };

        self.updatelevel = function (level) {
            // handling collision between the hero and the tiles
            self.onFloor = false;
            game.physics.arcade.collide(self.sprite, level.layer, function (hero, layer) {
                if (self.onFloor == false && hero.body.blocked.down) {
                    // touch down!
                    self.onFloor = hero.body.blocked.down;
                    self.startanimation();
                }
            }, null, level);
            return self;
        };

        self.updateenemy = function (enemy, callback) {
            // handling collision between the hero and the tiles
            game.physics.arcade.collide(self.sprite, enemy.sprite, function (hero, enemy) {
                callback();
            }, null, enemy);
            return self;
        };

        return this;
    };
});