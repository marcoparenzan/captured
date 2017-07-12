define([], function () {
    return function(game, gameOptions) {
        var self = this;

        self.preload = function() {
            game.load.spritesheet("hero", "images/hero.png", 16, 21);
        };

        self.create = function(x, y) {
            // adding the hero sprite
            self.sprite = game.add.sprite(x, y, "hero");
            self.sprite.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true)
            self.sprite.animations.add('right', [9, 10, 11, 12, 13, 14, 15, 16, 17], 8, true)
 
            // enabling ARCADE physics for the  hero
            game.physics.enable(self.sprite, Phaser.Physics.ARCADE);

            // setting hero gravity
            self.sprite.body.gravity.y = gameOptions.playerGravity;

            // setting hero anchor point
            self.sprite.anchor.set(0.5);

            // handle keyboard
            game.input.keyboard.onDownCallback = self.onDownCallback;
            game.input.keyboard.onUpCallback = self.onUpCallback;
        };

        self.onDownCallback = function (ev) {
            if (self.onFloor) {
                switch (ev.keyCode) {
                    case 39:
                        if (self.sprite.body.velocity.x <= 0) {
                            self.sprite.body.velocity.x = gameOptions.playerSpeed;
                            self.sprite.animations.play("right");
                        }
                        break;
                    case 37:
                        if (self.sprite.body.velocity.x >= 0) {
                            self.sprite.body.velocity.x = -gameOptions.playerSpeed;
                            self.sprite.animations.play("left");
                        }
                        break;
                    case 38: // UP
                        self.sprite.body.velocity.y = -gameOptions.playerJump;
                        self.sprite.animations.stop();
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
                    if (self.sprite.body.velocity.x > 0) {
                        self.sprite.body.velocity.x = 0;
                        self.sprite.animations.stop();
                    }
                    break;
                case 37:
                    if (self.sprite.body.velocity.x < 0) {
                        self.sprite.body.velocity.x = 0;
                        self.sprite.animations.stop();
                    }
                    break;
                case 32:
                    // nothing to do with space
                    break;
            }
        };
                
        self.update = function (level) {
            
            // handling collision between the hero and the tiles
            self.onFloor = false;
            game.physics.arcade.collide(self.sprite, level.layer, function (hero, layer) {
                self.onFloor = hero.body.blocked.down;
            }, null, level);
        };

        return this;
    };
});