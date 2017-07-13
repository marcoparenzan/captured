define(["gameOptions", "player", "enemy"], function (gameOptions, Player, Enemy) {
    return function (game) {
        this.preload = function () {
            // loading level tilemap
            game.load.tilemap("default", 'screens/002/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image("default", "screens/002/tileset.png");
    
            this.player = new Player(game, {
                x0: 8,
                y0: 160,                        
                // player gravity
                gravity: 900,
                // player horizontal speed
                speed: 60,
                // player force
                jump: 200
            });
            this.player.preload();

            this.enemies = {};
            this.eachenemy = function(callback) {
                var keys = Object.keys(this.enemies);
                for(var i = 0; i<keys.length; i++) {
                    callback(this.enemies[keys[i]]);
                }
            };

            this.enemies["2"] = new Enemy(game, {
                name: "enemy2",
                spriteframesname: "cube",
                x0: 10*8,
                y0: 9*8,
                y1: 9*8,
                y2: 12*8,
                speed: 20,
                mode: "ud"
            }).preload();

            this.enemies["3"] = new Enemy(game, {
                name: "enemy3",
                spriteframesname: "18",
                x0: 17*8+12,
                y0: 22*8,
                x1: 17*8+12,
                x2: 34*8-12,
                speed: 68,
                mode: "lr"
            }).preload();
        };

        this.create = function () {
            var self = this;

            // creatin of "level" tilemap
            self.map = game.add.tilemap("default");
            // which layer should we render? That's right, "layer01"
            self.layer = this.map.createLayer("default");
            // adding tiles (actuallyone tile) to tilemap
            self.map.addTilesetImage("default", "default");
            // tile 1 (the black tile) has the collision enabled
            self.map.setCollisionBetween(2, 18, true);

            self.player.create().restart();

            this.eachenemy(function(enemy){
                enemy.create().restart();
            });
        };

        this.playerOnEnemy = function() {
            var self = this;
            self.suspend();
            // self.decreaseLife();
            setTimeout(function() {
                self.player.explode();
                setTimeout(function() {
                    self.restart();
                }, 250);
            }, 1000);
        };

        this.suspend = function() {
            var self = this;
            self._suspended = true;
            self.player.suspend();
            this.eachenemy(function(enemy){
                enemy.suspend();
            });
        };
        
        this.restart = function() {
            var self = this;
            self.player.restart();
            this.eachenemy(function(enemy){
                enemy.restart();
            });
            self._suspended = false;
        };

        this.update = function () {
            var self = this;
            if (self._suspended == true) return;

            self.player.updatelevel(self);
            this.eachenemy(function(enemy){
                enemy.updatelevel(self);
                self.player.updateenemy(enemy, function(){
                    self.playerOnEnemy();
                });
            });
        };
    };
});