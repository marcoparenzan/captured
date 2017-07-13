requirejs.config({
    baseUrl: '.',
    paths: {
    }
});

requirejs(["gameOptions",
    "screens/001/screen",
    "screens/002/screen",
    "screens/003/screen",
    "screens/004/screen",
], function (gameOptions,
    Screen001,
    Screen002,
    Screen003,
    Screen004
) {
        game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight, null, "game");

        var Init = function (game) {
            this.preload = function () {
                game.stage.backgroundColor = gameOptions.bgColor;
                game.scale.setUserScale(2, 2);
                game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

                game.scale.pageAlignHorizontally = true;
                game.scale.pageAlignVertically = true;
                game.stage.disableVisibilityChange = true;
            };

            this.create = function () {
                // starting ARCADE physics
                game.physics.startSystem(Phaser.Physics.ARCADE);
                game.state.start("title");
            };
        };

        var Title = function (game) {

            // C&4 color table
            var colorTable = [
                Phaser.Color.hexToColor("#ffffff"),
                Phaser.Color.hexToColor("#882000"),
                Phaser.Color.hexToColor("#68d0a8"),
                Phaser.Color.hexToColor("#a838a0")
            ];
            var colorTable_i = 0;

            this.preload = function () {
                game.stage.backgroundColor = gameOptions.bgColor;
                game.load.image("title", "images/title.png");
            };

            this.create = function () {
                game.add.sprite(0, 0, 'title');

                // handle keyboard
                game.input.keyboard.onDownCallback = function (ev) {
                    switch (ev.keyCode) {
                        case 32:
                        case 38:
                            game.state.start("screen001");
                            break;
                    }
                };

                setInterval(function () {
                    game.stage.backgroundColor = colorTable[colorTable_i];
                    colorTable_i = (colorTable_i + 1) % colorTable.length;
                }, 1000);
            };
        };

        game.state.add("init", new Init(game));
        game.state.add("title", new Title(game));
        game.state.add("screen001", new Screen001(game));
        game.state.add("screen002", new Screen002(game));
        game.state.add("screen003", new Screen003(game));
        game.state.add("screen004", new Screen004(game));
        game.state.start("init");
    });
