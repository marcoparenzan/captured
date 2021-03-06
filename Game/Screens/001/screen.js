define(["gameOptions", "player", "enemy"], function (gameOptions, Player, Enemy) {
    return function (game) {
        this.preload = function () {
            // loading level tilemap
            game.load.tilemap("default", 'screens/001/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image("default", "screens/001/tileset.png");
    
            this.player = new Player(game, {
                x0: 30,
                y0: 66,                        
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

            this.enemies["1"] = new Enemy(game, {
                name: "enemy1",
                spriteframesname: "06",
                x0: 13*8+12,
                y0: 7*8,
                y1: 7*8,
                y2: 22*8,
                speed: 95,
                mode: "ud"
            }).preload();
            
            this.enemies["2"] = new Enemy(game, {
                name: "enemy2",
                spriteframesname: "copterside",
                x0: 20*8+12,
                y0: 12*8,
                y1: 12*8,
                y2: 16*8,
                speed: 30,
                mode: "ud"
            }).preload();

            this.enemies["3"] = new Enemy(game, {
                name: "enemy3",
                spriteframesname: "05",
                x0: 23*8+12,
                y0: 20*8,
                x1: 23*8+12,
                x2: 40*8-12,
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