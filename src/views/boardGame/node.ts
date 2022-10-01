import { Node as NodeModel } from '../../model/node';
import { BoardGameView } from '../boardGameView';
import { Entity } from '../entity';

export class Node implements Entity {
    private _view: BoardGameView;
    private _model: NodeModel;

    public constructor(view: BoardGameView, model: NodeModel) {
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