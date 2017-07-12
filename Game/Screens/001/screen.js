define(["gameOptions", "player"], function (gameOptions, Player) {
    return function (game) {
        this.preload = function () {
            game.stage.backgroundColor = gameOptions.bgColor;
            game.scale.setUserScale(2, 2);
            game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            game.stage.disableVisibilityChange = true;

            // loading level tilemap
            game.load.tilemap("screen001", 'screens/001/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image("tile001", "screens/001/tileset.png");
    
            this.player = new Player(game, gameOptions);
            this.player.preload();
        };

        this.create = function () {

            // starting ARCADE physics
            game.physics.startSystem(Phaser.Physics.ARCADE);

            // creatin of "level" tilemap
            this.map = game.add.tilemap("screen001");
            // which layer should we render? That's right, "layer01"
            this.layer = this.map.createLayer("001");
            // adding tiles (actually one tile) to tilemap
            this.map.addTilesetImage("001", "tile001");
            // tile 1 (the black tile) has the collision enabled
            this.map.setCollisionBetween(2, 18, true);

            this.player.create(30, 66);
        };
        
        this.update = function () {
            
            this.player.update(this);

        };
    };
});