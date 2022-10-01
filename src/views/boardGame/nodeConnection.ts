import { Graphics, Point, Sprite, Texture } from 'pixi.js';
import { Node as NodeModel } from '../../model/node';
import { BoardGameView } from '../boardGameView';
import { Entity } from '../entity';

export class NodeConnection implements Entity {
    private _view: BoardGameView;
    private _model1: NodeModel;
    private _model2: NodeModel;
    private _sprite: Graphics;

    public constructor(view: BoardGameView, sourceA: NodeModel, sourceB: NodeModel) {
        this._view = view;
        this._model1 = sourceA;
        this._model2 = sourceB;

        const center = new Point((this._model1.x + this._model2.x) / 2, (this._model1.y + this._model2.y) / 2);

        this._sprite = new Graphics();
        this._sprite.position.set(center.x, center.y);
        this._sprite.lineStyle({ width: 4, color: 0x440000 });
        this._sprite.drawPolygon([
            new Point(this._model1.x - center.x, this._model1.y - center.y),
            new Point(this._model2.x - center.x, this._model2.y - center.y),
        ]);
        this._sprite.zIndex = Math.min(this._model1.y, this._model2.y);
        
        if (!this._view.gameLayer) throw new Error();

        this._view.gameLayer.addChild(this._sprite);
    }

    public connectsTo(sourceA: NodeModel, sourceB: NodeModel) {
        return (
            (sourceA.id === this._model1.id && sourceB.id === this._model2.id) ||
            (sourceA.id === this._model2.id && sourceB.id === this._model1.id)
        );
    }

    public update(timeElapsed: number): void {

    }

    public destroy(): void {
        this._sprite?.parent.removeChild(this._sprite);
    }
}