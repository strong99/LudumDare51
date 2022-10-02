import { AnimatedSprite, Sprite, Text, Texture } from 'pixi.js';
import { TreeConstruct as TreeModel } from '../../model/treeConstruct';
import { Node } from './node';
import { NodeConstruction } from './nodeConstruction';

export class Tree implements NodeConstruction {
    private _node: Node;
    private _model: TreeModel;
    private _sprite: AnimatedSprite;
    //private _txt: Text;
    private _fruits = new Array<Sprite>();

    public constructor(node: Node, model: TreeModel) {
        this._node = node;
        this._model = model;
        
        const textures = new Array<Texture>();
        for (let i = 0; i < 9; i++) {
            textures.push(Texture.from(`treeConstruct/frame000${i}.png`));
        }

        this._sprite = new AnimatedSprite(textures);
        this._sprite.play();
        this._sprite.onFrameChange = (idx) => idx === 6 && this._sprite.stop();
        this._sprite.animationSpeed = 0.05;
        this._sprite.loop = false;
        this._sprite.position.set(model.node.x, model.node.y);
        this._sprite.anchor.set(0.5, 0.9);
        this._sprite.zIndex = this._sprite.position.y + 1000;

        //this._txt = new Text(this.getFruitCountString(), { fontSize: 20 });
        //this._txt.anchor.set(0.5, 0.5);
        //this._sprite.addChild(this._txt);

        if (!this._node.gameLayer) throw new Error();

        this._node.gameLayer.addChild(this._sprite);
    }

    //private getFruitCountString() {
    //    return `${this._model.fruits}/20 fruit`;
    //}

    public is(model: any): boolean {
        return this === model || this._model === model;
    }

    private _withering = false;
    public update(timeElapsed: number): void {
        if (!this._withering && this._model.hasDied) {
            this._withering = true;
            delete this._sprite.onFrameChange;
            this._sprite.gotoAndPlay(6);
        }

        //this._txt.text = this.getFruitCountString();

        if (this._model.fruits > this._fruits.length) {
            for(let i = this._fruits.length; i < this._model.fruits; i++) {
                const f = new Sprite(Texture.from('fruit.png'));
                this._sprite.addChild(f);
                f.y = -120;
                this._fruits.push(f);
            }
            for(let i = 0; i < this._fruits.length; i++) {
                this._fruits[i].x = ((i / 10) - 0.5) * 200;
            }
        }
        else if (this._fruits.length > this._model.fruits) {
            for(let i = this._fruits.length; i > this._model.fruits; i--) {
                this._fruits[i - 1].destroy();
            }
            this._fruits.length = this._model.fruits;
        }
    }

    public destroy(): void {
        this._sprite?.parent.removeChild(this._sprite);
    }
}