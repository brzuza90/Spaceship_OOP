export class Missile {
    constructor(x, y, gameContainer) {
        this.x = x;
        this.y = y;
        this.gameContainer = gameContainer;
        this.missileMoveValue = 2;
        this.missileSpeed = 5;
        this.element = document.createElement('div');
        this.interval = null;
    }
    init() {
        this.element.classList.add('missile');
        this.gameContainer.appendChild(this.element);
        this.element.style.left = `${this.x - this.element.offsetWidth / 2}px`
        this.element.style.top = `${this.y}px`
        this.interval = setInterval(() => this.element.style.top = `${this.element.offsetTop - this.missileMoveValue}px`, this.missileSpeed)
    }
    removeElement() {
        clearInterval(this.interval);
        this.element.remove();
    }
}