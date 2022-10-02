import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { TownConstruction as TownConstructionModel } from "../../model/townConstruction";
import { Sprite, Texture } from "pixi.js";


export class TownConstruction implements NodeConstruction {
    private _node: Node;
    private _model: TownConstructionModel;
    private _sprite: Sprite;

    public constructor(node: Node, model: TownConstructionModel) {
        this._node = node;
        this._model = model;

        if (!this._node.gameLayer) throw new Error();

        this._sprite = new Sprite(Texture.from('townBuilding001.png'));
        this._sprite.position.set(model.node.x, model.node.y + 40);
        this._sprite.anchor.set(0.5, 0.9);
        this._sprite.zIndex = this._sprite.position.y + 1000;
        this._node.gameLayer.addChild(this._sprite);

        this._sprite = new Sprite(Texture.from('townBuilding002.png'));
        this._sprite.position.set(model.node.x - 70, model.node.y - 10);
        this._sprite.anchor.set(0.5, 0.9);
        this._sprite.zIndex = this._sprite.position.y + 1000;
        this._node.gameLayer.addChild(this._sprite);

        this._sprite = new Sprite(Texture.from('townBuilding003.png'));
        this._sprite.position.set(model.node.x + 70, model.node.y - 10);
        this._sprite.anchor.set(0.5, 0.9);
        this._sprite.zIndex = this._sprite.position.y + 1000;
        this._node.gameLayer.addChild(this._sprite);

        this._sprite = new Sprite(Texture.from('townBuilding004.png'));
        this._sprite.position.set(model.node.x - 20, model.node.y - 30);
        this._sprite.anchor.set(0.5, 0.9);
        this._sprite.zIndex = this._sprite.position.y + 1000;
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
