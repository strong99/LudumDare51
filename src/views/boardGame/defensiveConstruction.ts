import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { DefensiveConstruction as DefensiveConstructionModel } from "../../model/defensiveConstruction";
import { Sprite, Texture } from "pixi.js";


export class DefensiveConstruction implements NodeConstruction {
    private _node: Node;
    private _model: DefensiveConstructionModel;
    private _sprite: Sprite;

    public constructor(node: Node, model: DefensiveConstructionModel) {
        this._node = node;
        this._model = model;

        this._sprite = new Sprite(Texture.from('defensive.png'));
        this._sprite.position.set(model.node.x, model.node.y);
        this._sprite.anchor.set(0.5, 0.9);
        this._sprite.zIndex = this._sprite.position.y + 1000;

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
