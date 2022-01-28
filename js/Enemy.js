export class Enemy {
    constructor(container, enemySpeed, enemyClass, explosionClass, lives = 1) {
        this.container = container;
        this.enemyClass = enemyClass;
        this.element = document.createElement('div');
        this.enemyInterval = null;
        this.enemySpeed = enemySpeed;
        this.lives = lives;
        this.explosionClass = explosionClass;
    }

    init() {
        this.#setEnemy();
        this.#updateEnemyPosition();
    }
    #setEnemy() {
        this.element.classList.add(this.enemyClass);
        this.element.style.top = '0px';
        this.element.style.left = `${this.#randomPosition()}px`;
        this.container.appendChild(this.element);
    }
    #randomPosition() {
        return Math.floor(Math.random() * (window.innerWidth - this.element.offsetWidth));
    }
    #updateEnemyPosition() {
        this.enemyInterval = setInterval(() => {
            this.#setNewPosition()
        }, this.enemySpeed);
    }
    #setNewPosition() {
        this.element.style.top = `${this.element.offsetTop + 2}px`
    }
    enemyHit() {
        this.lives--;
        if (!this.lives) {
            this.enemyExplode();
        }
        clearInterval(this.enemyInterval);
        this.element.remove();
    }
    removeElement() {
        clearInterval(this.enemyInterval);
        this.element.remove();
    }
    enemyHit() {
        this.lives--;
        if (!this.lives) {
            this.enemyExplode();
        }
    }
    enemyExplode() {
        const animationTime = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--explosion-animation-time'), 10);
        this.element.classList.remove(this.enemyClass);
        this.element.classList.add(this.explosionClass);
        clearInterval(this.enemyInterval);
        setTimeout(() => {
            this.element.remove();
        }, animationTime);
    }
}