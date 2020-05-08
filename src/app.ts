// TODO: fill background with gradient or repeated img of ground
// Pause - Restart BUttons 
// add bootstrap?
// Score for the game


window.onload = () => {

    const CELL_SIZE = 30;

    interface IDirection {
        xDirection: number;
        yDirection: number;
    };

    interface IPosition {
        x: number;
        y: number;
    };

    interface ISnakeBody extends IPosition {
        isHead: boolean;
    }

    interface IGrid {
        horizontalSize: number;
        verticalSize: number;
    };

    interface IFieldCell {
        xCoordinate: number;
        yCoordinate: number;
        isApple: boolean;
        isSnake: boolean;
    };
 
    class SnakeGame {
        private trigger: number = 8;
        private direction: IDirection = {
            xDirection: 0,
            yDirection: 0
        };
        private snakeSize: number = 3;
        private snakePosition: IPosition = {
            x: 15,
            y: 15
        };
        private grid: IGrid = {
            horizontalSize: 30,
            verticalSize: 30
        };
        // private apple: IPosition;
        // private snakeTrail: ISnakeBody[];
        // private canvas: HTMLCanvasElement;
        // private ctx: CanvasRenderingContext2D;
        

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

        private _setupPlayingFiedl(): void {
            /** Draw border and background */
        }
        
    };

    class AppleService {
        public handleCollect() {}
        public swapThePhotos() {}
    }

    class DataStorageService {
        public setRecord() {}
    }
    
    const game = new SnakeGame();
}