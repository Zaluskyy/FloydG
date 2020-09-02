const start = document.querySelector(".start")
const startBtn = document.querySelector(".start button")

const startNumberMonsters = document.querySelector(".start input")

const live = document.querySelector(".lives");

const hearts = document.querySelectorAll(".heart")
let lives = hearts.length;

const afterDead = document.querySelector(".afterDead");

const theEnd = document.querySelector(".afterDead");

const tryAgain = document.querySelector(".afterDead button");

const scorePlacee = document.querySelector(".score")
const scorePlace = document.querySelector(".score span")

const winPage = document.querySelector(".win");
const winBtn = document.querySelector(".win button");


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const shopBtn = document.querySelector(".shopBtn");

const moneyPlace = document.querySelector(".moneyPlace span");

const shop = document.querySelector(".shop");


let shopOpened = false

let money = 0;

let currentSkin = 2;
let currentMonster = 1;

const priceSkins = [20, 30, 12, 15, 16, 71]
const ownedSkins = [0]

const floor = canvas.height - 50;
let shoot = false;
let canShoot = true;
let shootSpeed = 10;
let play = false;
let score = 0;
let numberMonsters = 0


const image = new Image();
image.src = `img/skin/${currentSkin}/skinR.png`;

const monsterImageR = new Image();
monsterImageR.src = `img/monster/${currentMonster}/monsterR.png`
const monsterImageL = new Image();
monsterImageL.src = `img/monster/${currentMonster}/monsterL.png`

const distance = (x1, x2, y1, y2) => {
    distanceX = x2 - x1;
    distanceY = y2 - y1;

    return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2))
}

for (let i = 0; i < ownedSkins.length; i++) {
    document.querySelectorAll(".shop div")[ownedSkins[i]].style.backgroundColor = "rgb(73, 147, 190)"
    priceSkins[ownedSkins[i]] = "posiadane"
}

document.querySelectorAll(".shop div").forEach((skin, index) => {
    const skinToBuy = document.createElement("img");
    const price = document.createElement("font");
    skinToBuy.src = `img/skin/${index+1}/skinR.png`;
    if (Number.isInteger(priceSkins[index])) {
        price.textContent = priceSkins[index] + " $"
    } else {
        price.textContent = priceSkins[index]
    }
    skin.appendChild(skinToBuy)
    skin.appendChild(price)
})

const openShop = () => {
    if (!shopOpened) {
        shop.classList.remove("hide")
        shopOpened = true
    } else {
        shop.classList.add("hide")
        shopOpened = false
    }
}

const addMoney = () => {
    moneyPlace.textContent = money;
}

const getMoney = () => {
    const random = Math.floor(Math.random() * 10);
    if (random == 0) {
        money++
        addMoney()
    }
}

const gameRestart = () => {
    shopBtn.classList.remove("hide")
    score = 0
    play = false
    let enemyCount = enemy.length
    for (let i = 0; i < enemyCount; i++) {
        enemy.pop()
    }
}
const bulletRestart = () => {
    canShoot = true
    shoot = false
    bullet.x = undefined
}

const enterClick = () => {
    if (!start.classList.contains("hide")) {
        startGame()
    } else if (!winPage.classList.contains("hide") || !afterDead.classList.contains("hide")) {
        again()
    }

}

const win = () => {
    winPage.classList.remove("hide")
    gameRestart()
}


const square = {
    size: 64,
    width: 32,
    x: canvas.width / 2,
    xVelocity: 0,
    y: 0,
    yVelocity: 0,
    jumping: true,
}

const monster = {
    y: floor - 64,
    width: 32,
    height: 64,
    speed: 3,
}
const bullet = {
    x: undefined,
    y: undefined,
    radius: 2,
}

const controller = {
    left: false,
    up: false,
    right: false,
    down: false,
    move: "right",
    lastMove: function () {
        if (controller.left) {
            controller.move = "left"
        } else if (controller.right) {
            controller.move = "right"
        }
    },
    keyListener: function (e) {
        let keyState = (e.type == "keydown") ? true : false;
        switch (e.keyCode) {
            case 37:
                controller.left = keyState;
                break;
            case 65:
                controller.left = keyState;
                break;
            case 38:
                controller.up = keyState;
                break;
            case 87:
                controller.up = keyState;
                break;
            case 39:
                controller.right = keyState;
                break;
            case 68:
                controller.right = keyState;
                break;
            case 40:
                controller.down = keyState;
                break;
            case 83:
                controller.down = keyState;
                break;
            case 32:
                shoot = true;
                break;
            case 90:
                shoot = true;
                break;
            case 88:
                shoot = true;
                break;
            case 13:
                enterClick()
                break;
        }
        controller.lastMove()
    }
}




class Player {
    constructor() {
        this.update = () => {
            //dead
            this.dead = () => {
                afterDead.classList.remove("hide")
                gameRestart()
            }


            //pain
            this.pain = () => {
                if (lives > 0) {
                    square.y = 20
                    lives--
                    hearts[lives].classList.add("hide")
                    if (lives == 0) {
                        this.dead()
                    }
                }

            }

            //jump
            if (controller.up && square.jumping == false) {
                square.yVelocity -= 20;
                square.jumping = true
            }
            //left
            if (controller.left) {
                square.xVelocity -= 1
                image.src = `img/skin/${currentSkin}/skinL.png`;
            }
            //right
            if (controller.right) {
                square.xVelocity += 1
                image.src = `img/skin/${currentSkin}/skinR.png`;
            }
            //down
            if (controller.down) {
                square.size = 32
            } else {
                square.size = 64
            }

            //move
            square.yVelocity += 1;
            square.x += square.xVelocity;
            square.y += square.yVelocity;
            //gravity
            square.xVelocity *= 0.9;
            square.yVelocity *= 0.9;

            //stop jumping
            if (square.y >= floor - square.size) {
                square.yVelocity = 0
                square.y = floor - square.size
                square.jumping = false
            }

            //walls
            if (square.x < 0 - square.width / 2) {
                square.x = canvas.width + square.width / 2 - 0.01
            } else if (square.x > canvas.width + square.width / 2) {
                square.x = 0 - square.width / 2 + 0.01
            }

            //shoot
            const shootRight = () => {
                bullet.x += shootSpeed
                ctx.beginPath()
                ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2, false)
                ctx.stroke()
                if (bullet.x <= canvas.width + bullet.radius * 2) {
                    requestAnimationFrame(shootRight)
                } else {
                    bulletRestart()
                }
            }
            const shootLeft = () => {
                bullet.x -= shootSpeed
                ctx.beginPath()
                ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2, false)
                ctx.stroke()
                if (bullet.x >= 0 - bullet.radius * 2) {
                    requestAnimationFrame(shootLeft)
                } else {
                    bulletRestart()
                }
            }

            if (shoot && canShoot) {
                bullet.x = square.x
                bullet.y = square.y + square.size / 2
                if (controller.move == "right") {
                    canShoot = false
                    shootRight()
                } else if (controller.move == "left") {
                    canShoot = false
                    shootLeft()
                }
            }

            this.draw()
        }

        this.draw = () => {

            //floor
            ctx.lineWidth = 5;
            ctx.beginPath()
            ctx.moveTo(0, floor)
            ctx.lineTo(canvas.width, floor)
            ctx.stroke()
            ctx.closePath()


            //player
            ctx.fillStyle = "red";
            ctx.drawImage(image, square.x - square.width / 2, square.y, square.width, square.size)
            // ctx.fillRect(square.x, square.y, square.width, square.size)


        }
    }
}
let t = 5;
class Enemy {
    constructor(monsterXL, monsterXR, monsterYL, monsterYR) {
        this.monsterXL = monsterXL
        this.monsterXR = monsterXR
        this.monsterYL = monsterYL
        this.monsterYR = monsterYR

        this.leftL = true;
        this.leftR = false;
        this.update = () => {
            //diedMonster
            const diedMonsterR = () => {
                if (this.monsterYR < canvas.height) {
                    requestAnimationFrame(diedMonsterR)
                    this.monsterYR += 70
                } else {
                    this.monsterXR = undefined
                    this.monsterYR = undefined
                    getMoney()
                    score++
                    scorePlace.textContent = score
                    if (score == enemy.length * 2) {
                        win()
                    }
                }
            }
            const diedMonsterL = () => {
                if (this.monsterYL < canvas.height) {
                    requestAnimationFrame(diedMonsterL)
                    this.monsterYL += 70
                } else {
                    this.monsterXL = undefined
                    this.monsterYL = undefined
                    getMoney()
                    score++
                    scorePlace.textContent = score
                    if (score == enemy.length * 2) {
                        win()
                    }
                }
            }

            //collision detection with bullet
            if (distance(this.monsterXR, bullet.x, this.monsterYR, bullet.y) - (monster.width + bullet.radius) < 0) {
                bulletRestart()
                diedMonsterR()
            } else if (distance(this.monsterXL, bullet.x, this.monsterYL, bullet.y) - (monster.width + bullet.radius) < 0) {
                bulletRestart()
                diedMonsterL()
            }

            //collision detection with player
            if (distance(this.monsterXL, square.x, this.monsterYL, square.y) - (monster.width / 2 + square.width / 2 + 1) <= 0 || distance(this.monsterXR, square.x, this.monsterYR, square.y) - (monster.width / 2 + square.width / 2 + 1) <= 0) {
                player.pain()
            }


            //reflection
            if (this.monsterXL < 0 + monster.width / 2) this.leftL = false
            else if (this.monsterXL > canvas.width - monster.width / 2) this.leftL = true
            if (this.leftL) {
                this.monsterXL -= monster.speed
                monsterImageL.src = `img/monster/${currentMonster}/monsterR.png`
            } else {
                this.monsterXL += monster.speed
                monsterImageL.src = `img/monster/${currentMonster}/monsterL.png`
            }

            if (this.monsterXR < 0 + monster.width / 2) this.leftR = false
            else if (this.monsterXR > canvas.width - monster.width / 2) this.leftR = true
            if (this.leftR) {
                this.monsterXR -= monster.speed
                monsterImageR.src = `img/monster/${currentMonster}/monsterR.png`
            } else {
                this.monsterXR += monster.speed
                monsterImageR.src = `img/monster/${currentMonster}/monsterL.png`
            }

            // this.monsterXR--
            // this.monsterXL++

            this.draw()
        }
        this.draw = () => {
            //right
            ctx.beginPath()
            // ctx.rect(this.monsterXR - monster.width / 2, this.monsterYR, monster.width, monster.height)
            ctx.drawImage(monsterImageR, this.monsterXR - monster.width / 2, this.monsterYR, monster.width, monster.height)
            ctx.fill()
            ctx.closePath()
            //left
            ctx.beginPath()
            // ctx.rect(this.monsterXL - monster.width / 2, this.monsterYL, monster.width, monster.height)
            ctx.drawImage(monsterImageL, this.monsterXL - monster.width / 2, this.monsterYL, monster.width, monster.height)
            ctx.fill()
            ctx.closePath()
        }
    }
}
const player = new Player();

let enemy = []
const getEnemy = () => {
    for (let i = 0; i < numberMonsters; i++) {
        const monsterXL = Math.floor(Math.random() * (0 - (-600) + 1) + (-600))
        const monsterXR = Math.floor(Math.random() * (canvas.width - (canvas.width + 600) + 1) + (canvas.width + 600))
        const monsterYL = monster.y
        const monsterYR = monster.y
        enemy.push(new Enemy(monsterXL, monsterXR, monsterYL, monsterYR))
    }
}

const game = () => {
    if (play) {
        requestAnimationFrame(game)
    } else {
        return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    for (let i = 0; i < enemy.length; i++) {
        enemy[i].update()
    }
}

const startGame = () => {
    if (startNumberMonsters.value == "") {
        numberMonsters = 5
    } else if ((startNumberMonsters.value * 1) % 2 == 0) {
        numberMonsters = (startNumberMonsters.value * 1) / 2
    } else if ((startNumberMonsters.value * 1) % 2 != 0) {
        numberMonsters = (startNumberMonsters.value * 1 + 1) / 2
    }
    start.classList.add("hide")
    live.classList.remove("hide")
    scorePlacee.classList.remove("hide")
    play = true
    getEnemy()
    game()
}

const again = () => {
    shopOpened = true
    openShop()
    shopBtn.classList.add("hide")
    theEnd.classList.add("hide")
    winPage.classList.add("hide")
    play = true
    getEnemy()
    game()
    lives = hearts.length
    hearts.forEach(heart => heart.classList.remove("hide"))
    square.x = canvas.width / 2
    scorePlace.textContent = score
    bulletRestart()
}

shopBtn.addEventListener("click", openShop)
document.addEventListener("keydown", controller.keyListener)
document.addEventListener("keyup", controller.keyListener)
startBtn.addEventListener("click", startGame)
tryAgain.addEventListener("click", again)
winBtn.addEventListener("click", again)
game()
