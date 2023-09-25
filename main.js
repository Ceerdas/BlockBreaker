// shared

const canvas = document.getElementById("squareCanvas");
const ctx = canvas.getContext("2d");
setInterval(main, 16)

var keys = {
    K_a: false,
    K_d: false,
    K_Space: false,
};

var keyDict = {
    'a': 'K_a',
    'd': 'K_d',
    ' ': 'K_Space',
};

window.onkeydown = function (e) {
    keys[keyDict[e.key]] = true;
};

window.onkeyup = function (e) {
    keys[keyDict[e.key]] = false;
};

// character

let characterWidth = 112;
let characterHeight = 16;
let characterPositionX = (canvas.width / 2 - characterWidth / 2);
let characterPositionY = (canvas.height - characterHeight)

function createCharacter(left_key_name, right_key_name) {
    return {
        x: characterPositionX,
        y: characterPositionY,
        width: characterWidth,
        height: characterHeight,
        vx: 8,
        color: "#F78CA2",
        draw() {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
            ctx.fillStyle = this.color;
            ctx.fill();
        },
        update() {
            if (keys[left_key_name]) {
                this.x -= this.vx;
            };
            if (keys[right_key_name]) {
                this.x += this.vx;
            };
        },
        constrain() {
            if (this.x < 0) {
                this.x = 5
            }
            else if (this.x + characterWidth > canvas.width) {
                this.x = canvas.width - this.width - 5
            }
        }
    };
};

var character = createCharacter('K_a', 'K_d');

//ball

function getRandomSpeed(min, max) {
    min = 6;
    max = 8;
    return Math.floor(Math.random() * (max - min) + min);
}

let xMiddle = (canvas.width / 2);
let yMiddle = (canvas.height / 4 + (canvas.height / 2));

function drawBall(space_key_name) {
    return {
        x: character.x + characterWidth / 2,
        y: character.y - 8,
        vx: getRandomSpeed(),
        vy: -getRandomSpeed(),
        radius: 8,
        color: "#F9DEC9",
        isPlaying: false,
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.stroke();
        },
        update() {
            if (!this.isPlaying) {
                this.y = character.y - this.radius;
                this.x = character.x + characterWidth / 2;
            }
            if (!this.isPlaying && keys[space_key_name]) {
                this.isPlaying = true
            }
            if (this.isPlaying) {
                this.resetBall()
                this.x += this.vx;
                this.y += this.vy;
            }
        },
        resetBall() {
            if (this.y + this.radius > canvas.height) {
                this.isPlaying = false;
                resetMultiplier();
                losingLife();
            }
        }
    }
};

function collision() {
    // if (character.y < ball.y + ball.radius &&
    //     character.x < ball.x + ball.radius &&
    //     character.x + character.width > ball.x
    // ) {
    //     ball.vy = -ball.vy;

    // };
    if (ball.vy > character.y - ball.y + ball.radius &&
        ball.x + ball.radius > character.x &&
        ball.x < character.x + characterWidth) {
        ball.vy = -ball.vy;
        ball.y = character.y - ball.radius - 1;
    }
};

function canvasCollision() {
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx = -ball.vx;
    };
    if (ball.y < 0) {
        ball.vy = - ball.vy;
    }
};

var ball = drawBall('K_Space');

// blocks

const blockRows = 10;
const blockColumns = 13;
const blockWidth = (canvas.width / (blockColumns + 1.2));
const blockHeight = (canvas.height / 2) / 10;
const blockPadding = 2;
const blockOffsetTop = 2;
const blockOffsetLeft = 2;

const blocks = [];
const maxY = ((blockRows -2) * (blockHeight + blockPadding)) + blockOffsetTop;
for (let c = 0; c < blockColumns; c++) {
    blocks[c] = [];
    for (let r = 0; r < blockRows; r++) {
        const blockX = (c * (blockWidth + blockPadding)) + blockOffsetLeft;
        const blockY = (r * (blockHeight + blockPadding)) + blockOffsetTop;
        const color = "rgb("+(blockY/maxY)*255+","+(blockY/maxY)*100+",100)";
        blocks[c][r] = { x: blockX, y: blockY, status: 1, color: color};
    }
};

function drawBlocks() {
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            if (blocks[c][r].status === 1) {
                ctx.beginPath();
                ctx.rect(blocks[c][r].x, blocks[c][r].y, blockWidth, blockHeight);
                ctx.fillStyle = blocks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
};

function blockCollision() {
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            const b = blocks[c][r];
            if (b.status === 1) {
                if (ball.x + ball.radius > b.x &&
                    ball.x < b.x + blockWidth &&
                    ball.y > b.y &&
                    ball.y - ball.radius < b.y + blockHeight
                ) {
                    ball.vy = -ball.vy
                    b.status = 0;
                    multiplier++;
                    score += multiplier;
                    console.log(score);
                    console.log(multiplier);
                    console.log(sum);
                }
            }
        }
    }
}
// score

let score = 0;
let multiplier = 0;

function somaScore() {
    sum = score
};

var value = somaScore;

function resetMultiplier() {
    multiplier = 0;
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#D80032";
    ctx.fillText(`Score: ${sum}`, 8, 20);
}

// life

let life = 3

function losingLife() {
    life = life - 1;
    console.log(life)
    if (life < 1) {
        window.location.replace("gameover.html");
        document.getElementById("scoreSum").innerHTML=`Score: ${sum}`
    }
}

function drawLife() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#D80032";
    ctx.fillText(`Tries: ${life}`, 265, 825);
}

// draw phase

function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    character.update();
    character.draw();
    character.constrain();
    ball.draw();
    ball.update();
    drawBlocks();
    blockCollision();
    canvasCollision();
    collision();
    somaScore();
    drawScore();
    drawLife();
}