requirejs.config({
    baseUrl: '.',
    paths: {
    }
});

requirejs(["gameOptions", 
"screens/001/screen"
], function(gameOptions, 
    Screen001
) {
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, null, "game");
    game.state.add("screen001", new Screen001(game));
    game.state.start("screen001");
});
