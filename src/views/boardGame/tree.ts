import { Sprite, Text, Texture } from 'pixi.js';
import { TreeConstruct as TreeModel } from '../../model/treeConstruct';
import { Node } from './node';
import { NodeConstruction } from './nodeConstruction';

export class Tree implements NodeConstruction {
    private _node: Node;
    private _model: TreeModel;
    private _sprite: Sprite;
    private _txt: Text;

    public constructor(node: Node, model: TreeModel) {
        this._node = node;
        this._model = model;

        this._sprite = new Sprite(Texture.from('player.png'));
        this._sprite.position.set(model.node.x, model.node.y);
        this._sprite.anchor.set(0.5, 0.9);
        this._sprite.zIndex = this._sprite.position.y + 1000;

        this._txt = new Text(this.getFruitCountString(), { fontSize: 20 });
        this._txt.anchor.set(0.5, 0.5);
        this._sprite.addChild(this._txt);

        if (!this._node.gameLayer) throw new Error();

        this._node.gameLayer.addChild(this._sprite);
    }

    private getFruitCountString() {
        return `${this._model.fruits}/20 fruit`;
    }

    public is(model: any): boolean {
        return this === model || this._model === model;
    }

    public update(timeElapsed: number): void {
        this._txt.text = this.getFruitCountString();
    }

    public destroy(): void {
        this._sprite?.parent.removeChild(this._sprite);
    }
}