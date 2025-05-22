class WinScene extends Phaser.Scene {
    constructor() {
        super("WinScene");
    }

    preload() {
        this.load.image("blue", "assets/blue.png");
    }

    create() {
        this.input.keyboard.on('keydown', () => {
            this.scene.stop("WinScene")
            this.scene.start("GameScene");
        });


        this.add.text(WIDTH*CELL_SIZE/2,HEIGHT*CELL_SIZE/2,"You Win!", 
            { 
                fontSize: "24px", 
                fontStyle: "bold"
            }
        ).setOrigin(0.5);


    }
}