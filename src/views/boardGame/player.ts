import { Sprite, Texture } from 'pixi.js';
import { Player as PlayerModel } from '../../model/player';
import { Node } from './node';
import { NodeConstruction } from './nodeConstruction';

export class Player implements NodeConstruction {
    private _node: Node;
    private _model: PlayerModel;
    private _sprite: Sprite;

    public constructor(node: Node, model: PlayerModel) {
        this._node = node;
        this._model = model;

        this._sprite = new Sprite(Texture.from('player.png'));
        this._sprite.y = 0;
        this._sprite.anchor.set(0.5, 0.9);

        if (!this._node.gameLayer)throw new Error();

        this._node.gameLayer.addChild(this._sprite);
    }

    public is(model: any): boolean {
        return this === model || this._model === model;
    }
    
    public update(timeElapsed: number): void {
        
    }

    public destroy(): void {
        this._sprite?.parent.removeChild(this._sprite);
    }
}