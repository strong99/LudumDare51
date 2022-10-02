import { Sprite, Texture } from 'pixi.js';
import { DigestivePod as DigestivePodModel } from '../../model/digestivePod';
import { BoardGameView } from '../boardGameView';
import { Entity } from '../entity';
import { OnRemoveEntityCallback } from '../../model/world';

export class DigestivePod implements Entity {
    private _view: BoardGameView;
    private _model: DigestivePodModel;

    public get gameLayer() { return this._view.gameLayer; }
    private _sprite: Sprite;

    private _onRemoveEntity: OnRemoveEntityCallback = e => {
        if (e === this._model) this.destroy();
    }

    public constructor(view: BoardGameView, model: DigestivePodModel) {
        this._view = view;
        this._model = model;

        this._sprite = new Sprite(Texture.from("pod.png"));
        this._sprite.position.set(this._model.x, this._model.y);
        this._sprite.anchor.set(0.5, 0.9)
        this._sprite.interactive = true;
        this._sprite.interactiveChildren = true;
        this._sprite.zIndex = this._sprite.position.y + 1000;

        if (!this._view.gameLayer) throw new Error();

        model.world.onRemoveEntity(this._onRemoveEntity);

        this._view.gameLayer.addChild(this._sprite);
    }

    public update(timeElapsed: number): void {

    }

    private _destroyed = false
    public destroy(): void {
        if (this._destroyed) return;

        this._destroyed = true;
        this._model.world.offRemoveEntity(this._onRemoveEntity);
        this._sprite?.parent.removeChild(this._sprite);
    }
}