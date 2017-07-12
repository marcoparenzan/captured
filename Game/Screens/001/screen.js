define(["gameOptions", "player", "enemy"], function (gameOptions, Player, Enemy) {
    return function (game) {
        this.preload = function () {
            // loading level tilemap
            game.load.tilemap("screen001", 'screens/001/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image("tile001", "screens/001/tileset.png");
    
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

            this.enemy1 = new Enemy(game, {
                name: "enemy1",
                spriteframesname: "06",
                x0: 112,
                y0: 48,
                y1: 48,
                y2: 154,
                speed: 95,
                mode: "ud"
            });
            this.enemy1.preload();
            
            this.enemy2 = new Enemy(game, {
                name: "enemy2",
                spriteframesname: "copterside",
                x0: 168,
                y0: 72,
                y1: 73,
                y2: 106,
                speed: 39,
                mode: "ud"
            });
            this.enemy2.preload();

            this.enemy3 = new Enemy(game, {
                name: "enemy3",
                spriteframesname: "05",
                x0: 192,
                y0: 150,
                x1: 192,
                x2: 302,
                speed: 68,
                mode: "lr"
            });
            this.enemy3.preload();
        };

        this.create = function () {
            var self = this;

            // creatin of "level" tilemap
            self.map = game.add.tilemap("screen001");
            // which layer should we render? That's right, "layer01"
            self.layer = this.map.createLayer("001");
            // adding tiles (actually one tile) to tilemap
            self.map.addTilesetImage("001", "tile001");
            // tile 1 (the black tile) has the collision enabled
            self.map.setCollisionBetween(2, 18, true);

            self.player.create().restart();

            self.enemy1.create().restart();
            self.enemy2.create().restart();
            self.enemy3.create().restart();
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
            self.enemy1.suspend();
            self.enemy2.suspend();
            self.enemy3.suspend();
        };
        
        this.restart = function() {
            var self = this;
            self.player.restart();
            self.enemy1.restart();
            self.enemy2.restart();
            self.enemy3.restart();
            self._suspended = false;
        };

        this.update = function () {
            var self = this;
            if (self._suspended == true) return;

            self.player.updatelevel(self);
            self.enemy1.updatelevel(self);
            self.enemy2.updatelevel(self);
            self.enemy3.updatelevel(self);
            
            self.player.updateenemy(self.enemy1, function(){
                self.playerOnEnemy();
            });
            self.player.updateenemy(self.enemy2, function(){
                self.playerOnEnemy();
            });
            self.player.updateenemy(self.enemy3, function(){
                self.playerOnEnemy();
            });
        };
    };
});