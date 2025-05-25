class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }
    
    preload() {
        this.load.image("blue", "assets/blue.png");
        this.load.image("green", "assets/green.png");
        this.load.image("yellow", "assets/yellow.png");
        this.load.image("red", "assets/red.png");
        this.load.image("blueTxt", "assets/blueTxt.png");
        this.load.image("greenTxt", "assets/greenTxt.png");
        this.load.image("yellowTxt", "assets/yellowTxt.png");
        this.load.image("redTxt", "assets/redTxt.png");
        this.load.image("youTxt", "assets/youTxt.png");
        this.load.image("winTxt", "assets/winTxt.png");
        this.load.image("pushTxt", "assets/pushTxt.png");
        this.load.image("stopTxt", "assets/stopTxt.png");
        this.load.image("isTxt", "assets/isTxt.png");
        this.load.audio("moveSound", "assets/audio/drop_003.ogg");
        this.load.audio("winSound", "assets/audio/confirmation_002.ogg");
    }

    create() {
        game.arrowKeys = this.input.keyboard.createCursorKeys();
        game.wasdKeys = this.input.keyboard.addKeys({
            up: "W",
            down: "S",
            left: "A",
            right: "D",
            reset: "R"
        });
        game.moveSound = this.sound.add("moveSound", {volume: 0.5});
        game.winSound = this.sound.add("winSound", {volume: 0.5});

        game.lose = false;

        // populate all sprites 
        sprites.length = 0;

        addSprite(this, 11, 8, "red");
        addSprite(this, 12, 8, "red");
        addSprite(this, 13, 8, "red");
        addSprite(this, 14, 8, "red");
        addSprite(this, 15, 8, "red");
        addSprite(this, 16, 8, "red");
        addSprite(this, 17, 8, "red");
        addSprite(this, 18, 8, "red");
        addSprite(this, 19, 8, "red");
        addSprite(this, 20, 8, "red");
        addSprite(this, 21, 8, "red");

        addSprite(this, 11, 12, "red");
        addSprite(this, 12, 12, "red");
        addSprite(this, 13, 12, "red");
        addSprite(this, 14, 12, "red");
        addSprite(this, 15, 12, "red");
        addSprite(this, 16, 12, "red");
        addSprite(this, 17, 12, "red");
        addSprite(this, 18, 12, "red");
        addSprite(this, 19, 12, "red");
        addSprite(this, 20, 12, "red");
        addSprite(this, 21, 12, "red");
        
        addSprite(this, 16, 9, "yellow");
        addSprite(this, 16, 10, "yellow");
        addSprite(this, 16, 11, "yellow");
        
        addSprite(this, 20, 10, "green");
        addSprite(this, 12, 10, "blue");

        addText(this, 11, 6, "blueTxt", "noun");
        addText(this, 12, 6, "isTxt", "is");
        addText(this, 13, 6, "youTxt", "verb");
        
        addText(this, 19, 6, "greenTxt", "noun");
        addText(this, 20, 6, "isTxt", "is");
        addText(this, 21, 6, "winTxt", "verb");

        addText(this, 11, 14, "redTxt", "noun");
        addText(this, 12, 14, "isTxt", "is");
        addText(this, 13, 14, "stopTxt", "verb");

        addText(this, 19, 14, "yellowTxt", "noun");
        addText(this, 20, 14, "isTxt", "is");
        addText(this, 21, 14, "pushTxt", "verb");

        updateEverything();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(game.arrowKeys.up) || Phaser.Input.Keyboard.JustDown(game.wasdKeys.up)) {
            startMove(0, -1);
        }

        if (Phaser.Input.Keyboard.JustDown(game.arrowKeys.down) || Phaser.Input.Keyboard.JustDown(game.wasdKeys.down)) {
            startMove(0, 1);
        }

        if (Phaser.Input.Keyboard.JustDown(game.arrowKeys.left) || Phaser.Input.Keyboard.JustDown(game.wasdKeys.left)) {
            startMove(-1, 0);
        }

        if (Phaser.Input.Keyboard.JustDown(game.arrowKeys.right) || Phaser.Input.Keyboard.JustDown(game.wasdKeys.right)) {
            startMove(1, 0);
        }

        if (Phaser.Input.Keyboard.JustDown(game.wasdKeys.reset)) {
            this.scene.restart();
        }
        
    }
}
