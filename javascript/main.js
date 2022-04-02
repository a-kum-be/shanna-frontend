var config = {
    type: Phaser.AUTO,
    width: window_config.width,
    height: window_config.height,
    backgroundColor: window_config.backgroundcolor,
    physics: {
        default: 'arcade',
        arcade: {
        }
    },
    scene: [
        Homepage
    ]
};
var game = new Phaser.Game(config);