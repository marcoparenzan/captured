define([], function () {
    return function (game, config) {
        var self = this;

        self.oncreate = config.oncreate;
        self.onrestart = config.onrestart;
        self.onupdatelevel = config.onupdatelevel;
        if (config.mode == "lr") {
            self.oncreate = function (enemy) {
            };
            self.onrestart = function (enemy) {
                enemy.sprite.body.x = config.x0;
                enemy.sprite.body.y = config.y0;
                enemy.right();
            };
            self.onupdatelevel = function (enemy) {
                if (enemy.sprite.body.x >= config.x2) {
                    enemy.left();
                }
                if (enemy.sprite.body.x <= config.x1) {
                    enemy.right();
                }
            };
        }
        else if (config.mode == "ud") {
            self.oncreate = function (enemy) {
            };
            self.onrestart = function (enemy) {
                enemy.sprite.body.x = config.x0;
                enemy.sprite.body.y = config.y0;
                enemy.down();
            };
            self.onupdatelevel = function (enemy) {
                if (enemy.sprite.body.y >= config.y2) {
                    enemy.up();
                }
                if (enemy.sprite.body.y <= config.y1) {
                    enemy.down();
                }
            };
        }

        self.preload = function () {
            game.load.spritesheet(config.name, "images/player.png", 16, 21);
            return self;
        };

        self.create = function () {
            // adding the hero sprite
            self.sprite = game.add.sprite(config.x0, config.y0, config.name);
            self.sprite.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true);
            self.sprite.animations.add('right', [9, 10, 11, 12, 13, 14, 15, 16, 17], 8, true);

            // enabling ARCADE physics for the  hero
            game.physics.enable(self.sprite, Phaser.Physics.ARCADE);
            // setting hero gravity
            self.sprite.body.gravity.x = 0;
            self.sprite.body.gravity.y = 0;

            // setting hero anchor point
            self.sprite.anchor.set(0.5);
            if (self.oncreate != undefined) self.oncreate(self);
            return self;
        };

        self.restart = function () {
            self.sprite.x = config.x0;
            self.sprite.y = config.y0;
            if (self.onrestart != undefined) self.onrestart(self);
            return self;
        }

        self.suspend = function () {
            self.sprite.body.velocity.x = 0;
            self.sprite.body.velocity.y = 0;
            self.sprite.animations.stop();
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

        self.up = function () {
            if (self.sprite.body.velocity.y >= 0) {
                self.sprite.body.velocity.y = -config.speed;
                self.sprite.animations.play("left");
            }
            return self;
        };

        self.down = function () {
            if (self.sprite.body.velocity.y <= 0) {
                self.sprite.body.velocity.y = config.speed;
                self.sprite.animations.play("right");
            }
            return self;
        };

        self.stopright = function () {
            if (self.sprite.body.velocity.x > 0) {
                self.sprite.body.velocity.x = 0;
                self.sprite.animations.stop();
            }
            return self;
        };

        self.stopleft = function () {
            if (self.sprite.body.velocity.x < 0) {
                self.sprite.body.velocity.x = 0;
                self.sprite.animations.stop();
            }
            return self;
        };

        self.stopdown = function () {
            if (self.sprite.body.velocity.y > 0) {
                self.sprite.body.velocity.y = 0;
                self.sprite.animations.stop();
            }
            return self;
        };

        self.stopup = function () {
            if (self.sprite.body.velocity.y < 0) {
                self.sprite.body.velocity.y = 0;
                self.sprite.animations.stop();
            }
            return self;
        };

        self.updatelevel = function (level) {

            if (self.onupdatelevel != undefined) self.onupdatelevel(self);

            // handling collision between the hero and the tiles
            self.onFloor = false;
            game.physics.arcade.collide(self.sprite, level.layer, function (that, layer) {
                self.onFloor = that.body.blocked.down;
            }, null, level);
            return self;
        };

        return self;
    };
});