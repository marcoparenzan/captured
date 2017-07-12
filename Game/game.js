requirejs.config({
    baseUrl: 'game',
    paths: {
    }
});


var game;
var gameOptions = 

requirejs(["gameOptions", "Screen001"], function(gameOptions, Screen001) {
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, null, "game");
    game.state.add("screen001", new Screen001(game));
    game.state.start("screen001");
});
