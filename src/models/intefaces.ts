export interface IDirection {
    xDirection: number;
    yDirection: number;
};

export interface IPosition {
    x: number;
    y: number;
};

export interface ISnakeBody extends IPosition {
    isHead: boolean;
}

export interface IGrid {
    horizontalSize: number;
    verticalSize: number;
};

export interface IFieldCell {
    xCoordinate: number;
    yCoordinate: number;
    isApple: boolean;
    isSnake: boolean;
};