var config = {
    type: Phaser.AUTO,
    width: window_config.width,
    height: window_config.height,
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