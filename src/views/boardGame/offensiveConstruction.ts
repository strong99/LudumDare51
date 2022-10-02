import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { OffensiveConstruction as OffensiveConstructionModel } from "../../model/offensiveConstruction";
import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { FruitMoveTo } from "./fruitMoveTo";


export class OffensiveConstruction implements NodeConstruction {
    private _node: Node;
    private _model: OffensiveConstructionModel;
    private _sprite: AnimatedSprite;

    public constructor(node: Node, model: OffensiveConstructionModel) {
        this._node = node;
        this._model = model;

        const textures = new Array<Texture>();
        for (let i = 0; i < 6; i++) {
            textures.push(Texture.from(`offensiveConstruct/frame000${i}.png`));
        }

        this._node.view.playOnce('grow');
        this._sprite = new AnimatedSprite(textures);
        this._sprite.play();
        this._sprite.onFrameChange = idx => (this._model.level + 2 === idx) && this._sprite.stop();
        this._sprite.animationSpeed = 0.05;
        this._sprite.loop = false;
        this._sprite.position.set(model.node.x, model.node.y);
        this._sprite.anchor.set(0.5, 0.9);
        this._sprite.scale.set(0.75);
        this._sprite.zIndex = this._sprite.position.y + 1000;

        if (!this._node.gameLayer)throw new Error();

        this._node.gameLayer.addChild(this._sprite);
        
        new FruitMoveTo(node, model);
    }

    public is(model: any): boolean {
        return this._model === model || model === this;
    }

    public update(timeElapsed: number): void {
        if (!this._sprite.playing && this._model.level + 2 !== this._sprite.currentFrame) {
            this._sprite.gotoAndStop(this._model.level + 2);
            this._node.view.playOnce('grow');
            new FruitMoveTo(this._node, this._model);
        }
    }

    public destroy(): void {
        this._sprite.destroy();
    }
}
