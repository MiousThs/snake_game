// TODO: fill background with gradient or repeated img of ground
// Pause - Restart BUttons 
// add bootstrap?
// Score for the game

import { IDirection, IPosition, IGrid, ISnakeBody } from "./models/intefaces";
import { DEFAULT_SNAKE_SIZE, DEFAULT_GAME_SPEED } from "./models/constants";

window.onload = () => {
 
    class SnakeGame {
        private gameSpeed: number | undefined;
        private direction: IDirection | undefined;
        private snakeSize: number | undefined;
        private snakePosition: IPosition | undefined;
        private grid: IGrid | undefined;
        private apple: IPosition | undefined;
        private snakeTrail: ISnakeBody[] | undefined;
        private canvas: HTMLCanvasElement | undefined;
        private ctx: CanvasRenderingContext2D | undefined;
        private gameInterval: number | undefined;

        constructor() {
            this._setupPlayingField();
        }
        

        private handleKeyDown(direction: IDirection, e: KeyboardEvent): IDirection {
            switch (e.keyCode) {
                case 37:
                    if (direction.xDirection === 1) break;
                    direction.xDirection = -1;
                    direction.yDirection = 0;
                    break;
                case 38:
                    if (direction.yDirection === 1) break;
                    direction.xDirection = 0;
                    direction.yDirection = -1;
                    break;
                case 39:
                    if (direction.xDirection === -1) break;
                    direction.xDirection = 1;
                    direction.yDirection = 0;
                    break;
                case 40:
                    if (direction.yDirection === -1) break;
                    direction.xDirection = 0;
                    direction.yDirection = 1;
                    break;
                default:
                    break;
            }
            return direction;
        }

        private updatePlayersPosition() {}

        draw(): void {

        }

        private _drawShapes(): void {
            /** Snake border */
            // this.snakeTrail.forEach(snakeCell => {
                
            // })
        }

        private _setupPlayingField(): void {
            // DOM setting
            this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
            this.ctx = this.canvas.getContext('2d')!;
            
            // game settings
            this.snakeSize = DEFAULT_SNAKE_SIZE;
            this.gameSpeed = DEFAULT_GAME_SPEED;
            this.direction = {
                xDirection: 1,
                yDirection: 0
            };
            this.snakePosition = {
                x: 0,
                y: 0
            };
            this.grid = {
                horizontalSize: 30,
                verticalSize: 30
            };
            let i = 0;
            this.gameInterval = setInterval(() => {
                console.log(i++);
            }, 1000/this.gameSpeed!);
            setTimeout(() => clearInterval(this.gameInterval), 20000);
        }
        
    };
    
    const game = new SnakeGame();
}
