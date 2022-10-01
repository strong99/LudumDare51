import { Sprite, Texture } from 'pixi.js';
import { Peasant as PeasantModel } from '../../model/peasant';
import { BoardGameView } from '../boardGameView';
import { Entity } from '../entity';

export class Peasant implements Entity {
    private _view: BoardGameView;
    private _model: PeasantModel;

    public get gameLayer() { return this._sprite; }
    private _sprite: Sprite;

    public constructor(view: BoardGameView, model: PeasantModel) {
        this._view = view;
        this._model = model;

        this._sprite = new Sprite(Texture.from("peasant.png"));
        this._sprite.position.set(this._model.x, this._model.y);
        this._sprite.anchor.set(0.5, 0.5);

        if (!this._view.gameLayer)throw new Error();

        this._view.gameLayer.addChild(this._sprite);
    }

    public update(timeElapsed: number): void {
        this._sprite.position.set(this._model.x, this._model.y);
        this._sprite.zIndex = this._sprite.position.y + (1 - this._sprite.anchor.y) * this._sprite.texture.height + 1000;
    }
    
    public destroy(): void {
        this._sprite?.parent.removeChild(this._sprite);
    }
}