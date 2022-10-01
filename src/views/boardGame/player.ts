import { Player as PlayerModel } from '../../model/player';
import { BoardGameView } from '../boardGameView';
import { Entity } from '../entity';

export class Player implements Entity {
    private _view: BoardGameView;
    private _model: PlayerModel;

    public constructor(view: BoardGameView, model: PlayerModel) {
        this._view = view;
        this._model = model;
    }
    
    public update(timeElapsed: number): void {
        throw new Error('Method not implemented.');
    }

    public destroy(): void {
        throw new Error('Method not implemented.');
    }
}