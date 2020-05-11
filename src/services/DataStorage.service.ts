import { IScore } from "../models/intefaces";

export class DataStorageService {
    public setNewRecord(newScore: IScore) {
        const scores: IScore[] = this.getScores();
        scores.push(newScore);
        scores.sort((a: IScore, b: IScore) => Number(b.score) - Number(a.score));
        if (scores.length > 5) {
            scores.pop();
        }
        this._setScores(scores);
    }

    public getScores(): IScore[] {
        if (!localStorage.getItem('scores')) {
            localStorage.setItem('scores', JSON.stringify([]));
        }
        return JSON.parse(localStorage.getItem('scores')!);
    }

    private _setScores(scores: IScore[]): void {
        localStorage.setItem('scores', JSON.stringify(scores));
    }
}