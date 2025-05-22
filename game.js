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

function create() {
    arrowKeys = this.input.keyboard.createCursorKeys();
    wasdKeys = this.input.keyboard.addKeys({
        up: "W",
        down: "S",
        left: "A",
        right: "D",
        reset: "R"
    });

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

    if (Phaser.Input.Keyboard.JustDown(wasdKeys.reset)) {
        this.scene.restart();
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

    updateEverything();
}

function move(dx, dy, sprite) {
    const nextSprites = getCell(sprite.xPos + dx, sprite.yPos + dy);

    for (const nextSprite of nextSprites) {
        if (nextSprite && nextSprite.push) {
            move(dx, dy, nextSprite);
        }  
    }
    
    sprite.xPos += dx;
    sprite.yPos += dy;
}

// recursively call checkMove to check all sprites in a line
function checkMove(dx, dy, sprite) {
    const nextSprites = getCell(sprite.xPos + dx, sprite.yPos + dy);

    // true if all empty ahead
    if (nextSprites == []) {
        return true;
    }

    // false if any stop ahead
    for (const nextSprite of nextSprites) {
        if (nextSprite && nextSprite.stop) {
            return false;
        }
    }
    
    // recurse if any push ahead
    for (const nextSprite of nextSprites) {
        if (nextSprite && nextSprite.push) {
            return checkMove(dx, dy, nextSprite);
        }
    }

    return true;
}

function getCell(xPos, yPos) {
    const res = []

    for (const sprite of sprites) {
        if (sprite.xPos == xPos && sprite.yPos == yPos) {
            res.push(sprite);
        }
    }

    return res;
}

function updateSprites() {
    for (const sprite of sprites) {
        sprite.x = sprite.xPos * CELL_SIZE;
        sprite.y = sprite.yPos * CELL_SIZE;
        sprite.setTexture(sprite.name);
    }
}

function updateProperties() {
    for (const sprite of sprites) {
        if (sprite.is) {
            const aboveSprites = getCell(sprite.xPos, sprite.yPos - 1);
            const leftSprites = getCell(sprite.xPos - 1, sprite.yPos);

            for (const aboveSprite of aboveSprites) {
                if (aboveSprite && aboveSprite.noun) {
                    const belowSprites = getCell(sprite.xPos, sprite.yPos + 1);

                    for (const belowSprite of belowSprites) {
                        if (belowSprite && (belowSprite.verb || belowSprite.noun)) {
                            changeProps(aboveSprite, belowSprite);
                        } 
                    }
                }
            }
            
            for (const leftSprite of leftSprites) {
                if (leftSprite && leftSprite.noun) {
                    const rightSprites = getCell(sprite.xPos + 1, sprite.yPos);

                    for (const rightSprite of rightSprites) {
                        if (rightSprite && (rightSprite.verb || rightSprite.noun)) {
                            changeProps(leftSprite, rightSprite);
                        } 
                    }
                }
            }
        }
    }
}

function changeProps(nounTxt, modifierTxt) {
    for (const sprite of sprites) {
        if (sprite.name == nounTxt.name.slice(0,-3)) {
            if (modifierTxt.noun) {
                sprite.name = modifierTxt.name.slice(0,-3);
            } else if (modifierTxt.verb) {
                if (modifierTxt.name == "youTxt") {
                    sprite.you = true;
                } else if (modifierTxt.name == "winTxt") {
                    sprite.win = true;
                } else if (modifierTxt.name == "pushTxt") {
                    sprite.push = true;
                } else if (modifierTxt.name == "stopTxt") {
                    sprite.stop = true;
                }
            }
        }
    }
}

function setAllPropFalse() {
    for (const sprite of sprites) {
        sprite.you = false;
        sprite.win = false;
        sprite.push = false;
        sprite.stop = false;
        
        if (sprite.noun || sprite.verb || sprite.is) {
            sprite.push = true;
        }
    }
}

function updateEverything() {
    setAllPropFalse();
    updateProperties();
    updateSprites();
}

function addSprite(scene, x, y, texture) {
    const sprite = scene.add.sprite(x * CELL_SIZE, y * CELL_SIZE, texture).setOrigin(0);
    sprite.xPos = x;
    sprite.yPos = y;
    sprite.name = texture;
    sprite.you = false;
    sprite.win = false;
    sprite.push = false;
    sprite.stop = false;
    sprite.noun = false;
    sprite.verb = false;
    sprite.is = false;

    sprites.push(sprite)

    return sprite
}

function addText(scene, x, y, texture, type) {
    const sprite = addSprite(scene, x, y, texture)
    sprite.push = true;
    
    if (type == "noun") {
        sprite.noun = true;
    } else if (type == "verb") {
        sprite.verb = true;
    } else if (type == "is") {
        sprite.is = true;
    }

    return sprite
}