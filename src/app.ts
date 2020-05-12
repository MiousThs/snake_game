// array of changes direction on every key press
// get config from localstorage
// reset scores and fullscreen buttons

import { IDirection, IPosition, GameState, GameCharacters, IDOMElementsList, MoveDirections, IImageMap, IScore } from "./models/intefaces";
import { DEFAULT_SNAKE_SIZE, DEFAULT_GAME_SPEED, CELL_SIZE, DEFAULT_GRID_LENGTH, DEFAULT_CANVAS_SIZE } from "./models/constants";
import { AppleService } from "./services/Apple.service";
import { DataStorageService } from "./services/DataStorage.service";

declare var $:any;

window.onload = () => {
 
    class SnakeGame {
        private gameSpeed: number;
        private direction: IDirection;
        private moveDirection: MoveDirections;
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
        private gameCharacter: GameCharacters;
        private appleCharacter: GameCharacters;
        private domElements: IDOMElementsList;
        private imgMap: IImageMap;

        constructor(
            private appleService: AppleService,
            private storageService: DataStorageService
        ) {
            this._setupPlayingField();
        }

        private gameTick(): void {
            this.updatePlayersPosition();
            this.checkOnCollision();
            this.drawPlayField();
            this.isNewDirection = false;
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
            const playerHead = [...this.snakeTrail][this.snakeTrail.length - 1];
            const playerTail = [...this.snakeTrail].slice(0, this.snakeTrail.length - 1);
            this._drawPlayerPart(playerHead, this.gameCharacter, this.moveDirection);
            playerTail.forEach((snakeBody: IPosition) => this._drawPlayerPart(snakeBody, this.appleCharacter, this.moveDirection));
            this._drawPlayerPart(this.applePosition, this.appleCharacter, MoveDirections.up);
        }

        private pauseGame(): void {
            (document.activeElement as HTMLElement)?.blur()
            if (this.gameState === GameState.inProgress) {
                clearInterval(this.gameInterval);
                this.gameState = GameState.paused;
            }
        }
        
        private resumeGame(): void {
            (document.activeElement as HTMLElement)?.blur()
            if (this.gameState === GameState.paused) {
                this.gameInterval = setInterval(()=> this.gameTick(), 1000/this.gameSpeed);
                this.gameState = GameState.inProgress;
            }
        }

        private handleAppleEat(): void {
            this.snakeTrail.unshift({...this.previousTailPosition});
            this.applePosition = this.appleService.getApplePosition([...this.snakeTrail], this.gridLength);
            this.gameScore += 1;
            this._showScore(this.gameScore);
        }

        private handleGameLoose(): void {
            clearInterval(this.gameInterval);
            this.storageService.setNewRecord({
                date: new Date(),
                score: this.gameScore,
                difficulty: this._getGameDifficulty(this.gameSpeed)
            });
            this._setScores(this.storageService.getScores());
            this._showMessage(this.gameScore);
            this.restartGame();
        }

        private restartGame(): void {
            (document.activeElement as HTMLElement)?.blur()
            clearInterval(this.gameInterval);
            this.gameScore = 0;
            this._showScore(this.gameScore);
            this.snakeTrail = this._getSnakeTrail(this.startSnakeSize, {x: 10, y: 10}, this.direction);
            this.applePosition = this.appleService.getApplePosition([...this.snakeTrail], this.gridLength);
            this.gameState = GameState.inProgress;
            this.isNewDirection = false;
            this.gameInterval = setInterval(()=> this.gameTick(), 1000/this.gameSpeed!);
        }

        private handleKeyDown(e: KeyboardEvent): void {
            if (this.isNewDirection) return;
            switch (e.keyCode) {
                case 37:
                    if (this.direction.xDirection === 1) break;
                    this.direction.xDirection = -1;
                    this.direction.yDirection = 0;
                    this.moveDirection = MoveDirections.left;
                    this.isNewDirection = true;
                    break;
                case 38:
                    if (this.direction.yDirection === 1) break;
                    this.direction.xDirection = 0;
                    this.direction.yDirection = -1;
                    this.moveDirection = MoveDirections.up;
                    this.isNewDirection = true;
                    break;
                case 39:
                    if (this.direction.xDirection === -1) break;
                    this.direction.xDirection = 1;
                    this.direction.yDirection = 0;
                    this.moveDirection = MoveDirections.right;
                    this.isNewDirection = true;
                    break;
                case 40:
                    if (this.direction.yDirection === -1) break;
                    this.direction.xDirection = 0;
                    this.direction.yDirection = 1;
                    this.moveDirection = MoveDirections.down;
                    this.isNewDirection = true;
                    break;
                default:
                    break;
            }
        }

        private handleChooseCharacter(character: GameCharacters): void {
            (document.activeElement as HTMLElement)?.blur()
            switch (character) {
                case GameCharacters.dasha:
                    this.gameCharacter = GameCharacters.dasha;
                    this.appleCharacter = GameCharacters.andrii;
                    break;
                case GameCharacters.andrii:
                    this.gameCharacter = GameCharacters.andrii;
                    this.appleCharacter = GameCharacters.dasha;
                    break;
                case GameCharacters.aang:
                    this.gameCharacter = GameCharacters.aang;
                    this.appleCharacter = GameCharacters.katara;
                    break;
                case GameCharacters.katara:
                    this.gameCharacter = GameCharacters.katara;
                    this.appleCharacter = GameCharacters.aang;
                    break;
                default:
                    this.gameCharacter = GameCharacters.dasha;
                    this.appleCharacter = GameCharacters.andrii;
            }
            this.drawPlayField();
        }

        private handleGameDifficulty(frequency: number = 8): void {
            (document.activeElement as HTMLElement)?.blur()
            clearInterval(this.gameInterval);
            this.gameSpeed = frequency;
            this.gameInterval = setInterval(()=> this.gameTick(), 1000/this.gameSpeed!);
        }

        private enterFullScreenMode(): void {
            const elem = document.documentElement as any;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
              } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
              } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
              } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
              }
        }



        private _setScores(scores: IScore[]): void {
            const {scoreList} = this.domElements;
            while (scoreList?.firstChild) {
                scoreList.removeChild(scoreList.firstChild);
            }
            if (scores.length) {
                scores.forEach((score: IScore, i: number) => {
                    const node = document.createElement('li');
                    const innerTxt = `${i + 1}. ${new Date(score.date).toDateString()} - ${score.score} points${score.difficulty? ' - ' + score.difficulty : ' - Unknown Difficulty'}`;
                    const txt = document.createTextNode(innerTxt);
                    node.appendChild(txt);
                    node.classList.add('list-group-item');
                    node.classList.add('bg-dark');
                    scoreList?.appendChild(node);
                });
            } else {
                const node = document.createElement('div');
                const txt = document.createTextNode('Hey, you haven\'t played yet!');
                node.appendChild(txt);
                scoreList?.appendChild(node);
            }
        }

        private _showMessage(score: number): void {
            let message = '';
            if (score < 11) {
                message = `Well, ${score} points is not much, but it's Ok.`;
            } else if (score < 25) {
                message = `Hey, bro. You got ${score} points. Nicely played!`;
            } else if (score < 40) {
                message = `Wow! ${score} points! You are a pro!`
            } else if (score < 45) {
                message = `Do not believe. Send me link on cheats you've used.`;
            } else if (score < 60) {
                message = `C'mon, let your asian, who got for ${score} points, go home.`;
            } else if (score < 75) {
                message = `${score} points and the fastest fingers on the Wild West.`;
            } else if (score < 100) {
                message = `While you were achieving ${score} points, guys from South Korea were calling. They want you to train their Starcraft teams.`;
            } else {
                message = `"${score} points..." - the story tell your children...`
            }
            const txt = document.createTextNode(message);
            $('#scoreModal').modal('show');
            this.domElements.modalText?.removeChild(this.domElements.modalText.firstChild!);
            this.domElements.modalText?.appendChild(txt);
        }

        private _getPlayerSrc(player: GameCharacters, direction: MoveDirections): string {
            return 'assets/' + player + '_' + direction + '.png';
        }

        private _showScore(newScore: number): void {
            const txt = document.createTextNode(String(newScore));
            this.domElements.score?.removeChild(this.domElements.score.firstChild!);
            this.domElements.score?.appendChild(txt);
        }

        private _drawPlayerPart(part: IPosition, character: GameCharacters, direction: MoveDirections): void {
            const path = this._getImgPath(direction, character);
            if (!this.imgMap[path]) {
                const src = this._getPlayerSrc(character, direction);
                const player = new Image();
                player.src = src;
                this.imgMap[path] = player;
            }
            this.ctx.drawImage(this.imgMap[path], part.x * this.cellSize, part.y * this.cellSize);
        }

        private _drawFieldBackground(): void {
            this.ctx.clearRect(0, 0, DEFAULT_CANVAS_SIZE, DEFAULT_CANVAS_SIZE);
            this.ctx.strokeStyle = 'white';
            this.ctx.strokeRect(0, 0, DEFAULT_CANVAS_SIZE, DEFAULT_CANVAS_SIZE);
        }

        private _getImgPath(direction: MoveDirections, character: GameCharacters): string {
            return character + '_' + direction;
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
            document.getElementById('restartBtn')?.addEventListener('click', () => this.restartGame());
            document.getElementById('dasha')?.addEventListener('click', () => this.handleChooseCharacter(GameCharacters.dasha));
            document.getElementById('andrii')?.addEventListener('click', () => this.handleChooseCharacter(GameCharacters.andrii));
            document.getElementById('aang')?.addEventListener('click', () => this.handleChooseCharacter(GameCharacters.aang));
            document.getElementById('katara')?.addEventListener('click', () => this.handleChooseCharacter(GameCharacters.katara));
            document.getElementById('gameDifficulty')?.addEventListener('change', (e: any) => this.handleGameDifficulty(e.target?.value as number));
            document.getElementById('fsBtn')?.addEventListener('click', ()=> this.enterFullScreenMode())
        }

        private _setupGameSettings(): void {
            this.domElements = {};
            this.imgMap = {};
            this.domElements.score = document.getElementById('score')!;
            this.domElements.modalText = document.getElementById('modalText')!;
            this.domElements.scoreList = document.getElementById('scoreList')!;
            $('#scoreModal').modal({show: false});
            this.cellSize = CELL_SIZE;
            this.gameSpeed = DEFAULT_GAME_SPEED;
            this.gridLength = DEFAULT_GRID_LENGTH;
            this.startSnakeSize = DEFAULT_SNAKE_SIZE;
            this.gameState = GameState.inProgress;
            this.isNewDirection = false;
            this.direction = {xDirection: 1, yDirection: 0};
            this.moveDirection = MoveDirections.right;
            this.gameScore = 0;
            this._showScore(this.gameScore);
            this.snakeTrail = this._getSnakeTrail(this.startSnakeSize, {x: 10, y: 10}, this.direction);
            this.applePosition = this.appleService.getApplePosition([...this.snakeTrail], this.gridLength);
            this.handleChooseCharacter(GameCharacters.dasha);
            this._setScores(this.storageService.getScores());
            this.gameInterval = setInterval(()=> this.gameTick(), 1000/this.gameSpeed!);
        }

        private _getSnakeTrail(size: number, startPosition: IPosition, direction: IDirection): IPosition[] {
            const snakeTrail: IPosition[] = [];
            for (let i = 0; i < size; i++) {
                const item: IPosition = {
                    x: this._getNextCoordinate(
                        direction.xDirection !== 0 ? startPosition.x - direction.xDirection * (size - 1 - i) : startPosition.x,
                        direction.xDirection,
                        this.gridLength
                    ),
                    y: this._getNextCoordinate(
                        direction.yDirection !== 0 ? startPosition.y - direction.yDirection * (size - 1 - i) : startPosition.y,
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

        private _getGameDifficulty(frequency: number): string {
            switch (Number(frequency)) {
                case 5: return 'Easy';
                case 8: return 'Medium';
                case 11: return 'Hard';
                case 15: return 'Very hard';
                case 20: return 'Impossible';
                case 27: return 'Divine';
                case 33: return 'Good luck!';
                case 55: return 'Keep all deadlines';
                default: return 'Unknown difficulty';
            }
        }

    };
    
    const game = new SnakeGame(
        new AppleService(),
        new DataStorageService()
    );
}
