export interface IDirection {
    xDirection: number;
    yDirection: number;
};

export interface IPosition {
    x: number;
    y: number;
};

export interface ISnakeBody extends IPosition {
    isHead?: boolean;
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

export enum GameState {
    terminated = 0,
    paused = 1,
    inProgress = 2
}

export enum GameCharacters {
    dasha = 'dasha',
    andrii = 'andrii',
    aang = 'aang',
    katara = 'katara'
}

export interface IDOMElementsList {
    score?: HTMLElement;
    modalText?: HTMLElement;
    scoreList?: HTMLElement;
}

export interface IScore {
    date: Date,
    score: number
    difficulty?: string;
}

export enum MoveDirections {
    right = 'right',
    left = 'left',
    up = 'up',
    down = 'bot'
}

export interface IImageMap {
    [key: string]: CanvasImageSource;
}
