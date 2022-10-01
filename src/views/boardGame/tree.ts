import { Sprite, Texture } from 'pixi.js';
import { TreeConstruct as TreeModel } from '../../model/treeConstruct';
import { Node } from './node';
import { NodeConstruction } from './nodeConstruction';

export class Tree implements NodeConstruction {
    private _node: Node;
    private _model: TreeModel;
    private _sprite: Sprite;

    public constructor(node: Node, model: TreeModel) {
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