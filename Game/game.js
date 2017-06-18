var game;
var gameOptions = {

    // width of the game, in pixels
    gameWidth: 320,

    // height of the game, in pixels
    gameHeight: 200,

    // background color
    bgColor: 0x000000,

    // player gravity
    playerGravity: 900,

    // player horizontal speed
    playerSpeed: 1,

    // player force
    playerJump: 200
}
var cursors;
window.onload = function () {
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
    game.state.add("PreloadGame", preloadGame);
    game.state.add("PlayGame", playGame);
    game.state.start("PreloadGame");
}
var preloadGame = function (game) { }
preloadGame.prototype = {
    preload: function () {
        game.stage.backgroundColor = gameOptions.bgColor;
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.disableVisibilityChange = true;

        // loading level tilemap
        game.load.tilemap("screen", 'screens/001.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image("tile", "screens/001-tileset.png");
        game.load.image("hero", "images/hero.png");
    },
    create: function () {
        game.state.start("PlayGame");
    }
}
var playGame = function (game) { }
playGame.prototype = {
    create: function () {

        // starting ARCADE physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // creatin of "level" tilemap
        this.map = game.add.tilemap("screen");

        // which layer should we render? That's right, "layer01"
        this.layer = this.map.createLayer("001");

        // adding tiles (actually one tile) to tilemap
        this.map.addTilesetImage("001", "tile");

        // tile 1 (the black tile) has the collision enabled
        this.map.setCollision([2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18], true);

        // adding the hero sprite
        this.hero = game.add.sprite(30, 79, "hero");

        // setting hero anchor point
        this.hero.anchor.set(0.5);

        // enabling ARCADE physics for the  hero
        game.physics.enable(this.hero, Phaser.Physics.ARCADE);

        // setting hero gravity
        this.hero.body.gravity.y = gameOptions.playerGravity;
    },
    update: function () {

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.hero.x -= gameOptions.playerSpeed;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.hero.x += gameOptions.playerSpeed;
        }

        // handling collision between the hero and the tiles
        game.physics.arcade.collide(this.hero, this.layer, function (hero, layer) {

            if(this.hero.body.blocked.right){
                debugger;
            }
            if(this.hero.body.blocked.left){
                debugger;
            }

        }, null, this);
    }
}