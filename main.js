//shared

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

let characterWidth = 112 ;
let characterHeight = 16;
let characterPositionX = (canvas.width / 2 - characterWidth / 2);
let characterPositionY = (canvas.height - characterHeight)

function drawCharacter(left_key_name, right_key_name) {
    return {
        x: characterPositionX,
        y: characterPositionY,
        width: characterWidth,
        height: characterHeight,
        vx: 8,
        color: "green",
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

var character = drawCharacter('K_a', 'K_d');

function getRandomSpeed(min, max) {
    min = 6;
    max = 12;
    return Math.floor(Math.random() * (max - min) + min);
}

let xMiddle = (canvas.width / 2);
let yMiddle = (canvas.height / 4 + (canvas.height / 2));

function drawBall(space_key_name) {
    return {
        x: xMiddle,
        y: yMiddle,
        vx: getRandomSpeed(),
        vy: getRandomSpeed(),
        radius: 8,
        color: "gray",
        isPlaying: false,
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.stroke();
        },
        update() {
            if (!this.isPlaying && keys[space_key_name]){
                this.isPlaying = true
            }
            if (this.isPlaying){
                this.resetBall()
                this.x += this.vx;
                this.y += this.vy;
            }
        },
        resetBall() {
            if (this.y + this.radius > canvas.height) {
                this.y = yMiddle;
                this.x = xMiddle;
                this.isPlaying = false
            }
        } 
    }
}; 

function collision() {
    if (character.y < ball.y + ball.radius &&
        character.x < ball.x + ball.radius &&
        character.x + character.width > ball.x 
        ) {
        ball.vy = -ball.vy;

    };
};

function canvasCollision() {
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx = -ball.vx;
    };
    if (ball.y < 0){
        ball.vy = - ball.vy;
    }
};

var ball = drawBall('K_Space');

function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    character.update();
    character.draw();
    character.constrain();
    ball.draw();
    ball.update();
    canvasCollision();
    collision();
}