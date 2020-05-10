// TODO: fill background with gradient or repeated img of ground
// Pause - Restart BUttons 
// add bootstrap?
// Score for the game
// array of changes direction on every key press

import { IDirection, IPosition, IGrid, GameState } from "./models/intefaces";
import { DEFAULT_SNAKE_SIZE, DEFAULT_GAME_SPEED, CELL_SIZE, DEFAULT_GRID_LENGTH, DEFAULT_CANVAS_SIZE } from "./models/constants";
import { AppleService } from "./services/Apple.service";

window.onload = () => {
 
    class SnakeGame {
        private gameSpeed: number;
        private direction: IDirection;
        private cellSize: number;
        private applePosition: IPosition;
        private snakeTrail: IPosition[];
        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;
        private gameInterval: number;
        private gridLength: number;
        private gameState: GameState;
        private startSnakeSize: number;
        private isNewDirection: boolean;
        private previousTailPosition: IPosition;
        private gameScore: number;

        constructor(
            private appleService: AppleService
        ) {
            this._setupPlayingField();
        }

        private gameTick(): void {
            this.updatePlayersPosition();
            this.checkOnCollision();
            this.drawPlayField();
        }

        public updatePlayersPosition() {
            this.previousTailPosition = this.snakeTrail[0];
            const newSnakePart: IPosition = {
                x: this._getNextCoordinate(
                    this.snakeTrail[this.snakeTrail.length - 1].x,
                    this.direction.xDirection,
                    this.gridLength
                ),
                y: this._getNextCoordinate(
                    this.snakeTrail[this.snakeTrail.length - 1].y,
                    this.direction.yDirection,
                    this.gridLength
                )
            };
            const newSnakeTrail: IPosition[] = [...this.snakeTrail];
            newSnakeTrail.push(newSnakePart);
            newSnakeTrail.shift();
            this.snakeTrail = [...newSnakeTrail];
        }

        public checkOnCollision(): void {
            const isSelfDestroyed = this.snakeTrail.filter((snakePart: IPosition) => {
                return this.snakeTrail.filter((targetPart: IPosition) => {
                    return this._isCollision(targetPart, snakePart);
                }).length > 1;
            }).length;
            if (isSelfDestroyed) {
                this.handleGameLoose();
            }

            const isAppleEaten = this.snakeTrail.find((snakePart: IPosition) => {
                return this._isCollision(snakePart, this.applePosition);
            });

            if (isAppleEaten) {
                this.handleAppleEat();
            }
        }

        private drawPlayField(): void {
            this._drawFieldBackground();
            this.snakeTrail.forEach((snakeBody: IPosition) => this._drawPlayerPart(snakeBody));
            this._drawApple(this.applePosition);
            this.isNewDirection = false;
        }

        private pauseGame(): void {
            if (this.gameState === GameState.inProgress) {
                clearInterval(this.gameInterval);
                this.gameState = GameState.paused;
            }
        }
        
        private resumeGame(): void {
            if (this.gameState === GameState.paused) {
                this.gameInterval = setInterval(()=> this.gameTick(), 1000/this.gameSpeed);
                this.gameState = GameState.inProgress;
            }
        }

        private handleAppleEat(): void {
            this.snakeTrail.unshift({...this.previousTailPosition});
            this.applePosition = this.appleService.getApplePosition([...this.snakeTrail], this.gridLength);
            this.gameScore += 1;
        }

        private handleGameLoose(): void {
            clearInterval(this.gameInterval);
            // TODO: generate message
            alert(`Даша, твій рахунок: ${this.gameScore} балів!`);
            // this.restartGame();
            this.gameState = GameState.terminated;
        }

        private handleKeyDown(e: KeyboardEvent): void {
            if (this.isNewDirection) return;
            switch (e.keyCode) {
                case 37:
                    if (this.direction.xDirection === 1) break;
                    this.direction.xDirection = -1;
                    this.direction.yDirection = 0;
                    this.isNewDirection = true;
                    break;
                case 38:
                    if (this.direction.yDirection === 1) break;
                    this.direction.xDirection = 0;
                    this.direction.yDirection = -1;
                    this.isNewDirection = true;
                    break;
                case 39:
                    if (this.direction.xDirection === -1) break;
                    this.direction.xDirection = 1;
                    this.direction.yDirection = 0;
                    this.isNewDirection = true;
                    break;
                case 40:
                    if (this.direction.yDirection === -1) break;
                    this.direction.xDirection = 0;
                    this.direction.yDirection = 1;
                    this.isNewDirection = true;
                    break;
                default:
                    break;
            }
        }


        private _drawPlayerPart(part: IPosition): void {
            this.ctx.fillStyle = 'green';
            this.ctx.fillRect(part.x * this.cellSize, part.y * this.cellSize, this.cellSize, this.cellSize);
        }

        private _drawApple(apple: IPosition): void {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(apple.x * this.cellSize, apple.y * this.cellSize, this.cellSize, this.cellSize);
        }

        private _drawFieldBackground(): void {
            this.ctx.fillStyle = 'lightGrey';
            this.ctx.fillRect(0, 0, DEFAULT_CANVAS_SIZE, DEFAULT_CANVAS_SIZE);
        }

        private _isCollision(a: IPosition, b: IPosition): boolean {
            return a.x === b.x && a.y === b.y;
        }
        
        private _setupPlayingField(): void {
            this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
            this.ctx = this.canvas.getContext('2d')!;
            this._setupListeners();
            this._setupGameSettings();
        }

        private _setupListeners(): void {
            document.addEventListener('keydown', (e: KeyboardEvent) => this.handleKeyDown(e));
            document.getElementById('pauseBtn')?.addEventListener('click', () => this.pauseGame());
            document.getElementById('resumeBtn')?.addEventListener('click', () => this.resumeGame());
        }

        private _setupGameSettings(): void {
            this.cellSize = CELL_SIZE;
            this.gameSpeed = DEFAULT_GAME_SPEED;
            this.gridLength = DEFAULT_GRID_LENGTH;
            this.startSnakeSize = DEFAULT_SNAKE_SIZE;
            this.gameState = GameState.inProgress;
            this.isNewDirection = false;
            this.direction = {xDirection: 1, yDirection: 0};
            this.gameScore = 0;
            this.snakeTrail = this._getSnakeTrail(this.startSnakeSize, {x: 10, y: 10}, this.direction);
            this.applePosition = this.appleService.getApplePosition([...this.snakeTrail], this.gridLength)
            this.gameInterval = setInterval(()=> this.gameTick(), 1000/this.gameSpeed!);
        }

        private _getSnakeTrail(size: number, startPosition: IPosition, direction: IDirection): IPosition[] {
            const snakeTrail: IPosition[] = [];
            for (let i = 0; i < size; i++) {
                const item: IPosition = {
                    x: this._getNextCoordinate(
                        direction.xDirection !== 0 ? startPosition.x - (size - 1 - i) : startPosition.x,
                        direction.xDirection,
                        this.gridLength
                    ),
                    y: this._getNextCoordinate(
                        direction.yDirection !== 0 ? startPosition.y - (size - 1 - i) : startPosition.y,
                        direction.yDirection,
                        this.gridLength
                    )
                };
                
                snakeTrail.push(item);
            }
            
            return snakeTrail;
        }

        private _getNextCoordinate(current: number, direction: number, maxLength: number): number {
            return (current + direction + maxLength) % maxLength;
        }

    };
    
    const game = new SnakeGame(
        new AppleService()
    );
}
