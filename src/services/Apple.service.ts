import { IPosition } from "../models/intefaces";

export class AppleService {
    public getApplePosition(snakePositions: IPosition[], gridSize: number): IPosition {
        const availablePozitions = this._getAvailablePositions(snakePositions, gridSize);
        return availablePozitions[Math.round(Math.random() * (availablePozitions.length - 1))];
    }

    private _getAvailablePositions(snakePositions: IPosition[], gridSize: number): IPosition[] {
        const availablePozitions: IPosition[] = [];
        for(let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const isPresent = !!(snakePositions.filter((snakePart: IPosition) => {
                    return snakePart.x === i && snakePart.y === j;
                }).length);
                if (isPresent) continue;
                availablePozitions.push({x: i, y: j});
            }
        }

        return availablePozitions;
    }
}