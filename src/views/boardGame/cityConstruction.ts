import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { CityConstruction as CityConstructionModel } from "../../model/cityConstruction";
import { Sprite, Texture } from "pixi.js";


export class CityConstruction implements NodeConstruction {
    private _node: Node;
    private _model: CityConstructionModel;
    private _sprite: Sprite;

    public constructor(node: Node, model: CityConstructionModel) {
        this._node = node;
        this._model = model;

        this._sprite = new Sprite(Texture.from('city.png'));
        this._sprite.position.set(model.node.x, model.node.y + 40);
        this._sprite.anchor.set(0.5, 0.8);
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
