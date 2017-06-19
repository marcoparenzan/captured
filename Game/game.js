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
    playerSpeed: 30,

    // player force
    playerJump: 200
}
var cursors;
var hero;
window.onload = function () {
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, null, "game");
    game.state.add("PreloadGame", preloadGame);
    game.state.add("PlayGame", playGame);
    game.state.start("PreloadGame");
}
var preloadGame = function (game) { }
preloadGame.prototype = {
    preload: function () {
        game.stage.backgroundColor = gameOptions.bgColor;
        game.scale.setUserScale(2,2);
        game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

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
        hero = game.add.sprite(30, 79, "hero");

        // setting hero anchor point
        hero.anchor.set(0.5);

        // enabling ARCADE physics for the  hero
        game.physics.enable(hero, Phaser.Physics.ARCADE);

        // setting hero gravity
        hero.body.gravity.y = gameOptions.playerGravity;

        // handle keyboard
        game.input.keyboard.onDownCallback = this.onDownCallback;
        game.input.keyboard.onUpCallback = this.onUpCallback;
    },
    onDownCallback: function(ev) {
        if (hero.onFloor) {
            switch(ev.keyCode) {
                case 39:
                    if (hero.body.velocity.x<=0) {
                        hero.body.velocity.x = gameOptions.playerSpeed;
                    }
                    break;
                case 37:
                    if (hero.body.velocity.x>=0) {
                        hero.body.velocity.x = -gameOptions.playerSpeed;
                    }
                    break;
                case 38: // UP
                    hero.body.velocity.y = -gameOptions.playerJump;
                    break;        
            }
        }
        else {
            // nothing to do during flight
        }
    },
    onUpCallback: function(ev) {
        switch(ev.keyCode) {
            case 39:
                if (hero.body.velocity.x>0) {
                    hero.body.velocity.x = 0;
                }
                break;
            case 37:
                if (hero.body.velocity.x<0) {
                    hero.body.velocity.x = 0;
                }
                break;
            case 32:
                // nothing to do with space
                break;        
        }
    },
    update: function () {
        // handling collision between the hero and the tiles
        hero.onFloor = false;
        game.physics.arcade.collide(hero, this.layer, function (hero, layer) {
            hero.onFloor = hero.body.blocked.down;
        }, null, this);
    }
}