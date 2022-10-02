import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { DefensiveConstruction as DefensiveConstructionModel } from "../../model/defensiveConstruction";
import { AnimatedSprite, Sprite, Texture } from "pixi.js";


export class DefensiveConstruction implements NodeConstruction {
    private _node: Node;
    private _model: DefensiveConstructionModel;
    private _sprite: AnimatedSprite;

    public constructor(node: Node, model: DefensiveConstructionModel) {
        this._node = node;
        this._model = model;

        const textures = new Array<Texture>();
        for (let i = 0; i < 6; i++) {
            textures.push(Texture.from(`defensiveConstruct/frame000${i}.png`));
        }

        this._sprite = new AnimatedSprite(textures);
        this._sprite.play();
        this._sprite.onFrameChange = idx => (this._model.level + 2 === idx) && this._sprite.stop();
        this._sprite.animationSpeed = 0.05;
        this._sprite.loop = false;
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
        if (!this._sprite.playing && this._model.level + 2 !== this._sprite.currentFrame) {
            this._sprite.gotoAndStop(this._model.level + 2);
        }
    }

    public destroy(): void {
        this._sprite.destroy();
    }
}
