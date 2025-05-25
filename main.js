const CELL_SIZE = 24;
const WIDTH = 33;
const HEIGHT = 18;
const sprites = [];

const config = {
    type: Phaser.AUTO,
    width: WIDTH * CELL_SIZE,
    height: HEIGHT * CELL_SIZE,
    pixelArt: true,
    backgroundColor: "#222",
    scene: [GameScene, WinScene]
};

const game = new Phaser.Game(config);

function startMove(dx, dy) {
    for (const sprite of sprites) {
        if (sprite.you) {
            if (checkMove(dx, dy, sprite)) {
                move(dx, dy, sprite);
            }
        }
    }

    game.moveSound.play();
    updateEverything();
}

// recursively call checkMove to check all sprites in a line
function checkMove(dx, dy, sprite) {
    const nextSprites = getCell(sprite.xPos + dx, sprite.yPos + dy);

    // false if off screen
    if (sprite.xPos + dx >= WIDTH || sprite.xPos + dx < 0 || sprite.yPos + dy >= HEIGHT || sprite.yPos + dy < 0) {
        return false;
    }

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

function getCell(xPos, yPos) {
    const res = []

    for (const sprite of sprites) {
        if (sprite.xPos == xPos && sprite.yPos == yPos) {
            res.push(sprite);
        }
    }

    return res;
}

function updateEverything() {
    setAllPropFalse();
    updateProperties();
    updateSprites();

    checkWin();
}

function setAllPropFalse() {
    for (const sprite of sprites) {
        sprite.you = false;
        sprite.win = false;
        sprite.push = false;
        sprite.stop = false;
        
        
        if (sprite.noun || sprite.verb || sprite.is) {
            sprite.push = true;

            sprite.alpha = 0.5;
        }
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
                            aboveSprite.alpha = 1;
                            belowSprite.alpha = 1;
                            sprite.alpha = 1;
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
                            leftSprite.alpha = 1;
                            rightSprite.alpha = 1;
                            sprite.alpha = 1;
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

function updateSprites() {
    for (const sprite of sprites) {
        sprite.x = sprite.xPos * CELL_SIZE;
        sprite.y = sprite.yPos * CELL_SIZE;
        sprite.setTexture(sprite.name);
    }
}

function checkWin() {
    for (const sprite of sprites) {
        if (sprite.you) {
            for (const sprite2 of sprites) {
                if (sprite2.win && sprite2.xPos == sprite.xPos && sprite2.yPos == sprite.yPos) {
                    game.winSound.play();
                    game.scene.stop("GameScene");
                    game.scene.start("WinScene");
                }
            }
        }
    }
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