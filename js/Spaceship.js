import { Missile } from "./Missile.js";

export class Spaceship {
    missiles = [];
    #modifier = 5;
    #leftArrow = false;
    #rightArrow = false;
    constructor(element, gameContainer) {
        this.element = element;
        this.halfElementWidth = this.element.offsetWidth / 2;
        this.gameContainer = gameContainer;
    }
    init() {
        this.setPosition();
        this.#eventListeners();
        this.#gameLoop();
    }
    setPosition() {
        this.element.style.bottom = '0px';
        this.element.style.left = `${window.innerWidth / 2 - this.halfElementWidth}px`;
    }
    #getPosition() {
        return this.element.offsetLeft;
    }
    #eventListeners() {
        window.addEventListener('keydown', ({ keyCode }) => {
            switch (keyCode) {
                case 37:
                    this.#leftArrow = true;
                    break;
                case 39:
                    this.#rightArrow = true;
                    break;
            }
        });
        window.addEventListener('keyup', ({ keyCode }) => {
            switch (keyCode) {
                case 32:
                    this.#shot();
                    break;
                case 37:
                    this.#leftArrow = false;
                    break;
                case 39:
                    this.#rightArrow = false;
                    break;
            }
        });
    }
    #gameLoop = () => {
        this.#whatKeyPress();
        requestAnimationFrame(this.#gameLoop);
    }
    #whatKeyPress() {
        if (this.#leftArrow && this.#getPosition() >= this.#modifier) {
            this.element.style.left = `${parseInt(this.element.style.left, 10) - this.#modifier}px`;

        }
        if (this.#rightArrow && this.#getPosition() < window.innerWidth - this.element.offsetWidth) {
            this.element.style.left = `${parseInt(this.element.style.left, 10) + this.#modifier}px`;
        }
    }
    #shot() {
        const missile = new Missile(
            this.#getPosition() + this.halfElementWidth,
            this.element.offsetTop,
            this.gameContainer,
        );
        missile.init();
        this.missiles.push(missile);
    }
}