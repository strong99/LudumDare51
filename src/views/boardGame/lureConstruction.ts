import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { LureConstruction as LureConstructionModel } from "../../model/lureConstruction";
import { Sprite, Texture } from "pixi.js";


export class LureConstruction implements NodeConstruction {
    private _node: Node;
    private _model: LureConstructionModel;
    private _sprite: Sprite;

    public constructor(node: Node, model: LureConstructionModel) {
        this._node = node;
        this._model = model;

        this._sprite = new Sprite(Texture.from('lure.png'));
        this._sprite.y = 0;
        this._sprite.anchor.set(0.5, 0.9);

        if (!this._node.gameLayer) throw new Error();

        this._node.gameLayer.addChild(this._sprite);
    }

    public is(model: any): boolean {
        return this._model === model || model === this;
    }

    public update(timeElapsed: number): void {

    }

    public destroy(): void {
        this._sprite.destroy();
    }
}
