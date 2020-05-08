"use strict";
// TODO: fill background with gradient or repeated img of ground
// Pause - Restart BUttons 
// add bootstrap?
// Score for the game
window.onload = function () {
    var CELL_SIZE = 30;
    ;
    ;
    ;
    ;
    var SnakeGame = /** @class */ (function () {
        function SnakeGame() {
            this.trigger = 8;
            this.direction = {
                xDirection: 0,
                yDirection: 0
            };
            this.snakeSize = 3;
            this.snakePosition = {
                x: 15,
                y: 15
            };
            this.grid = {
                horizontalSize: 30,
                verticalSize: 30
            };
        }
        // private apple: IPosition;
        // private snakeTrail: ISnakeBody[];
        // private canvas: HTMLCanvasElement;
        // private ctx: CanvasRenderingContext2D;
        SnakeGame.prototype.handleKeyDown = function (direction, e) {
            switch (e.keyCode) {
                case 37:
                    if (direction.xDirection === 1)
                        break;
                    direction.xDirection = -1;
                    direction.yDirection = 0;
                    break;
                case 38:
                    if (direction.yDirection === 1)
                        break;
                    direction.xDirection = 0;
                    direction.yDirection = -1;
                    break;
                case 39:
                    if (direction.xDirection === -1)
                        break;
                    direction.xDirection = 1;
                    direction.yDirection = 0;
                    break;
                case 40:
                    if (direction.yDirection === -1)
                        break;
                    direction.xDirection = 0;
                    direction.yDirection = 1;
                    break;
                default:
                    break;
            }
            return direction;
        };
        SnakeGame.prototype.updatePlayersPosition = function () { };
        SnakeGame.prototype.draw = function () {
        };
        SnakeGame.prototype._drawShapes = function () {
            /** Snake border */
            // this.snakeTrail.forEach(snakeCell => {
            // })
        };
        SnakeGame.prototype._setupPlayingFiedl = function () {
            /** Draw border and background */
        };
        return SnakeGame;
    }());
    ;
    var AppleService = /** @class */ (function () {
        function AppleService() {
        }
        AppleService.prototype.handleCollect = function () { };
        AppleService.prototype.swapThePhotos = function () { };
        return AppleService;
    }());
    var DataStorageService = /** @class */ (function () {
        function DataStorageService() {
        }
        DataStorageService.prototype.setRecord = function () { };
        return DataStorageService;
    }());
    var game = new SnakeGame();
};
//# sourceMappingURL=app.js.map