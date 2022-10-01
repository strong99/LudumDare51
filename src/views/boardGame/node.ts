import { Sprite, Texture } from 'pixi.js';
import { Node as NodeModel } from '../../model/node';
import { NodeConstruction } from './nodeConstruction';
import * as NodeConstructionFactory from './nodeConstructionFactory';
import { BoardGameView } from '../boardGameView';
import { Entity } from '../entity';

export class Node implements Entity {
    private _view: BoardGameView;
    private _model: NodeModel;

    public get gameLayer() { return this._sprite; }
    private _sprite: Sprite;

    private _nodeConstruction?: NodeConstruction;

    public constructor(view: BoardGameView, model: NodeModel) {
        this._view = view;
        this._model = model;

        this._sprite = new Sprite(Texture.from("node.png"));
        this._sprite.position.set(this._model.x, this._model.y);
        this._sprite.anchor.set(0.5, 0.5);
        if (!this._view.gameLayer)throw new Error();

        this._view.gameLayer.addChild(this._sprite);

        if (this._model.construct) {
            NodeConstructionFactory.TryCreate(this, this._model.construct);
        }
    }
    
    public update(timeElapsed: number): void {
        if (!this._model.construct && this._nodeConstruction) {
            this._nodeConstruction.destroy();
            delete this._nodeConstruction;
        }
        else if (this._model.construct && (!this._nodeConstruction || !this._nodeConstruction.is(this._model.construct))) {
            this._nodeConstruction?.destroy();
            NodeConstructionFactory.TryCreate(this, this._model.construct);
        }
    }
    
    public destroy(): void {
        this._sprite?.parent.removeChild(this._sprite);
    }
}