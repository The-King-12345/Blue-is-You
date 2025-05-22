const config = {
    type: Phaser.AUTO,
    width: 792,
    height: 432,
    pixelArt: true,
    backgroundColor: "#222",
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

function preload() {
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
}

const CELL_SIZE = 24;
const sprites = [];
let arrowKeys;
let wasdKeys;
let player;

function create() {
    arrowKeys = this.input.keyboard.createCursorKeys();
    wasdKeys = this.input.keyboard.addKeys({
        up: "W",
        down: "S",
        left: "A",
        right: "D"
    });

    // populate all sprites 
    player = addSprite(this, 12, 10, "blue");
    player.you = true;
    addSprite(this, 20, 10, "green");

    addSprite(this, 16, 9, "yellow");
    addSprite(this, 16, 10, "yellow");
    addSprite(this, 16, 11, "yellow");

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

    addText(this, 11, 6, "blueTxt");
    addText(this, 12, 6, "isTxt");
    addText(this, 13, 6, "youTxt");
    
    addText(this, 19, 6, "greenTxt");
    addText(this, 20, 6, "isTxt");
    addText(this, 21, 6, "winTxt");

    addText(this, 11, 14, "redTxt");
    addText(this, 12, 14, "isTxt");
    addText(this, 13, 14, "stopTxt");

    addText(this, 19, 14, "yellowTxt");
    addText(this, 20, 14, "isTxt");
    addText(this, 21, 14, "pushTxt");

}

function update() {
    if (Phaser.Input.Keyboard.JustDown(arrowKeys.up) || Phaser.Input.Keyboard.JustDown(wasdKeys.up)) {
        startMove(0, -1);
    }

    if (Phaser.Input.Keyboard.JustDown(arrowKeys.down) || Phaser.Input.Keyboard.JustDown(wasdKeys.down)) {
        startMove(0, 1);
    }

    if (Phaser.Input.Keyboard.JustDown(arrowKeys.left) || Phaser.Input.Keyboard.JustDown(wasdKeys.left)) {
        startMove(-1, 0);
    }

    if (Phaser.Input.Keyboard.JustDown(arrowKeys.right) || Phaser.Input.Keyboard.JustDown(wasdKeys.right)) {
        startMove(1, 0);
    }

    
}

function startMove(dx, dy) {
    for (const sprite of sprites) {
        if (sprite.you) {
            if (checkMove(dx, dy, sprite)) {
                move(dx, dy, sprite);
            }
        }
    }

    updateSprites();
}

function move(dx, dy, sprite) {
    const nextSprite = getCell(sprite.xPos + dx, sprite.yPos + dy)
    if (nextSprite != null && nextSprite.push) {
        move(dx, dy, nextSprite);
    }
    
    sprite.xPos += dx;
    sprite.yPos += dy;
}

function checkMove(dx, dy, sprite) {
    const nextSprite = getCell(sprite.xPos + dx, sprite.yPos + dy);

    // recursively call checkMove to check all sprites in a line
    if (nextSprite == null) {
        return true;
    } else if (nextSprite.stop) {
        return false;
    } else if (nextSprite.push) {
        return checkMove(sprite.xPos + dx, sprite.yPos + dy, nextSprite);
    } else {
        return true;
    }
}

function getCell(xPos, yPos) {
    for (const sprite of sprites) {
        if (sprite.xPos == xPos && sprite.yPos == yPos) {
            return sprite;
        }
    }

    return null;
}

function updateSprites() {
    for (const sprite of sprites) {
        sprite.x = sprite.xPos * CELL_SIZE;
        sprite.y = sprite.yPos * CELL_SIZE;
        sprite.setTexture(sprite.texture);
    }
}

function addSprite(scene, x, y, texture) {
    const sprite = scene.add.sprite(x * CELL_SIZE, y * CELL_SIZE, texture).setOrigin(0);
    sprite.xPos = x;
    sprite.yPos = y;
    sprite.texture = texture;
    sprite.you = false;
    sprite.win = false;
    sprite.push = false;
    sprite.stop = false;

    sprites.push(sprite)

    return sprite
}

function addText(scene, x, y, texture) {
    const sprite = addSprite(scene, x, y, texture)
    sprite.push = true;

    return sprite
}