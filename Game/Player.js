define([], function () {
    return function (game, config) {
        var self = this;

        self.preload = function () {
            game.load.spritesheet("player", "images/player.png", 16, 21);
            return self;
        };

        self.create = function () {

            // adding the hero sprite
            self.sprite = game.add.sprite(config.x0, config.y0, "player");
            self.sprite.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true);
            self.sprite.animations.add('right', [9, 10, 11, 12, 13, 14, 15, 16, 17], 8, true);
            self.sprite.animations.add('explode', [9, 10, 11, 12, 13, 14, 15, 16, 17], 8);

            // enabling ARCADE physics for the  hero
            game.physics.enable(self.sprite, Phaser.Physics.ARCADE);

            // setting hero anchor point
            self.sprite.anchor.set(0.5);

            // handle keyboard
            game.input.keyboard.onDownCallback = self.onDownCallback;
            game.input.keyboard.onUpCallback = self.onUpCallback;

            return self;
        };

        self.restart = function () {
            self.sprite.x = config.x0;
            self.sprite.y = config.y0;
            // setting hero gravity
            self.sprite.body.gravity.y = config.gravity;
            return self;
        }

        self.suspend = function () {
            self.sprite.body.velocity.x = 0;
            self.sprite.body.velocity.y = 0;
            self.sprite.animations.stop();
            // setting hero gravity
            self.sprite.body.gravity.y = 0;
            return self;
        };

        self.left = function () {
            if (self.sprite.body.velocity.x >= 0) {
                self.sprite.body.velocity.x = -config.speed;
                self.sprite.animations.play("left");
            }
            return self;
        };

        self.right = function () {
            if (self.sprite.body.velocity.x <= 0) {
                self.sprite.body.velocity.x = config.speed;
                self.sprite.animations.play("right");
            }
            return self;
        };

        self.jump = function () {
            if (self.sprite.body.velocity.y >= 0) {
                self.sprite.body.velocity.y = -config.jump;
                self.sprite.animations.play("left");
            }
            return self;
        };

        self.stopright = function () {
            if (self.sprite.body.velocity.x > 0) {
                self.sprite.body.velocity.x = 0;
                self.sprite.animations.stop();
            }
        };

        self.stopleft = function () {
            if (self.sprite.body.velocity.x < 0) {
                self.sprite.body.velocity.x = 0;
                self.sprite.animations.stop();
            }
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
                    self.stopright();
                    break;
                case 37:
                    self.stopleft();
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
                self.onFloor = hero.body.blocked.down;
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