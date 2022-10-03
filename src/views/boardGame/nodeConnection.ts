import { Graphics, Point, Sprite, Texture } from 'pixi.js';
import { Node as NodeModel } from '../../model/node';
import { TreePlayer } from '../../model/treePlayer';
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

        let ax = this._model1.x;
        let ay = this._model1.y;

        let bx = this._model2.x;
        let by = this._model2.y;

        const dx = ax - bx;
        const dy = ay - by;
        const length = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / length;
        const ny = dy / length;

        const xradius = 128 / 2;
        const yradius = 128 / 2;

        ax -= nx * xradius;
        ay -= ny * yradius;

        bx += nx * xradius;
        by += ny * yradius;

        this._sprite = new Graphics();
        this._sprite.position.set(center.x, center.y);
        this._sprite.lineStyle({ width: 4, color: 0x6666bb });
        this._sprite.drawPolygon([
            new Point(ax - center.x, ay - center.y),
            new Point(bx - center.x, by - center.y),
        ]);
        this._sprite.alpha = 0.0;
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
        this._sprite.alpha = (
            (this._model1.construct?.player instanceof TreePlayer|| this._model2.construct?.player instanceof TreePlayer) 
        ) ? 0.125 : 0;
    }

    public destroy(): void {
        this._sprite?.parent.removeChild(this._sprite);
    }
}