import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { LureConstruction as LureConstructionModel } from "../../model/lureConstruction";
import { AnimatedSprite, Sprite, Text, Texture } from "pixi.js";
import { FruitMoveTo } from "./fruitMoveTo";


export class LureConstruction implements NodeConstruction {
    private _node: Node;
    private _model: LureConstructionModel;
    private _sprite: AnimatedSprite;
    private _txt: Text;

    public constructor(node: Node, model: LureConstructionModel) {
        this._node = node;
        this._model = model;

        const textures = new Array<Texture>();
        for (let i = 0; i < 5; i++) {
            textures.push(Texture.from(`lureConstruct/frame000${i}.png`));
        }

        this._sprite = new AnimatedSprite(textures);
        this._sprite.play();
        this._sprite.onFrameChange = idx => (this._model.level + 1 === idx) && this._sprite.stop();
        this._sprite.animationSpeed = 0.05;
        this._sprite.loop = false;
        this._sprite.position.set(model.node.x, model.node.y);
        this._sprite.anchor.set(0.5, 0.9);
        this._sprite.zIndex = this._sprite.position.y + 1000;

        this._txt = new Text(this.getFruitCountString(), { fontSize: 20 });
        this._txt.anchor.set(0.5, 0.5);
        this._sprite.addChild(this._txt);

        if (!this._node.gameLayer) throw new Error();

        this._node.gameLayer.addChild(this._sprite);

        new FruitMoveTo(node, model);
    }

    private getFruitCountString() {
        return `${this._model.fruits}/10 fruit`;
    }

    public is(model: any): boolean {
        return this._model === model || model === this;
    }

    public update(timeElapsed: number): void {
        if (!this._sprite.playing && this._model.level + 1 !== this._sprite.currentFrame) {
            this._sprite.gotoAndStop(this._model.level + 1);
            new FruitMoveTo(this._node, this._model);
        }
        this._txt.text = this.getFruitCountString();
    }

    public destroy(): void {
        this._sprite.destroy();
    }
}
