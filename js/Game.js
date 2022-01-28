import { Spaceship } from "./Spaceship.js";
import { Enemy } from "./Enemy.js";

class Game {
    #htmlElements = {
        spaceship: document.querySelector('#js-spaceship'),
        gameContainer: document.querySelector('#js-game-container'),
        lives: document.querySelector('#js-lives'),
        score: document.querySelector('#js-score'),
        modal: document.querySelector('#js-modal'),
        modalText: document.querySelector('#js-modal-text'),
        modalButton: document.querySelector('#js-modal-button'),
    };
    #ship = new Spaceship(this.#htmlElements.spaceship, this.#htmlElements.gameContainer);
    #lives = 3;
    #score = 0;
    #enemySpeed = 10;
    #checkPositionInterval = null;
    #createEnemyInterval = null;
    #enemies = [];
    init() {
        this.#newGame();
        this.#htmlElements.modalButton.addEventListener('click', () => this.#newGame());
        this.#ship.init();
    }
    #newGame() {
        document.querySelectorAll('.missile').forEach((params) => {
            params.remove();
        })
        this.#htmlElements.modal.classList.add('hide');
        this.#score = 0;
        this.#lives = 3;
        this.#updateScoreText();
        this.#updateLivesText();
        this.#ship.setPosition();
        this.#checkPositionInterval = setInterval(() => this.#checkPosition(), 1);
        this.#createEnemyInterval = setInterval(() => this.#randomNewEnemy(), 1000);
    }
    #checkPosition() {
        this.#enemies.forEach((enemy, enemyIndex, enemyArr) => {
            const enemyPosition = {
                top: enemy.element.offsetTop,
                right: enemy.element.offsetLeft + enemy.element.offsetWidth,
                bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
                left: enemy.element.offsetLeft,
            }
            if (enemyPosition.top > window.innerHeight) {
                enemy.removeElement();
                enemyArr.splice(enemyIndex, 1);
                this.#updateLives();
            }
            this.#ship.missiles.forEach((missile, missileIndex, missileArr) => {
                const missilePosition = {
                    top: missile.element.offsetTop,
                    right: missile.element.offsetLeft + missile.element.offsetWidth,
                    bottom: missile.element.offsetTop + missile.element.offsetHeight,
                    left: missile.element.offsetLeft,
                }
                if (missilePosition.top <= enemyPosition.bottom
                    && missilePosition.left <= enemyPosition.right
                    && missilePosition.right >= enemyPosition.left
                ) {
                    enemy.enemyHit();
                    if (!enemy.lives) {
                        enemyArr.splice(enemyIndex, 1);
                        this.#updateScore();
                    }
                    missile.removeElement();
                    missileArr.splice(missileIndex, 1);
                }
                if (missilePosition.bottom < 0) {
                    missile.removeElement();
                    missileArr.splice(missileIndex, 1)
                }
            });
        });

    }
    #createNewEnemy(...params) {
        const enemy = new Enemy(...params);
        enemy.init();
        this.#enemies.push(enemy);
    }
    #randomNewEnemy() {
        const randomNumber = Math.floor(Math.random() * 5) + 1;
        if (randomNumber % 5) {
            this.#createNewEnemy(
                this.#htmlElements.gameContainer,
                this.#enemySpeed,
                'enemy',
                'explosion'
            )
        } else {
            this.#createNewEnemy(
                this.#htmlElements.gameContainer,
                this.#enemySpeed * 2,
                'enemy--big',
                'explosion--big',
                3,
            )
        }
    }
    #updateScore() {
        this.#score++;
        if (this.#score % 5 && this.#enemySpeed >= 10) {
            this.#enemySpeed--;
        }
        this.#updateScoreText();
    }
    #updateLives() {
        this.#lives--;
        this.#updateLivesText();
        this.#htmlElements.gameContainer.classList.add('hit');
        setTimeout(() => {
            this.#htmlElements.gameContainer.classList.remove('hit');
        }, 100);
        if (!this.#lives) {
            this.#endGame();
        }
    }
    #updateScoreText() {
        this.#htmlElements.score.textContent = `Score: ${this.#score}`;
    }
    #updateLivesText() {
        this.#htmlElements.lives.textContent = `Lives: ${this.#lives}`;
    }
    #endGame() {
        this.#htmlElements.modal.classList.remove('hide');
        this.#htmlElements.modalText.textContent = `You lose! Your score is ${this.#score}`;
        clearInterval(this.#createEnemyInterval);

        this.#enemies.forEach((enemy) => {
            enemy.removeElement();
        });
        this.#ship.missiles.forEach((missile) => {
            missile.removeElement();
        });
        setTimeout(() => {
            this.#enemies.length = 0;
        }, 2000)

        setTimeout(() => {
            this.#ship.missiles.length = 0;
            clearInterval(this.#checkPositionInterval);
        }, 1000)


    }
}

window.onload = function () {
    const game = new Game();
    game.init();
}