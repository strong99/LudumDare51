import { AnimatedSprite, Sprite, Texture } from 'pixi.js';
import { DigestivePod as DigestivePodModel } from '../../model/digestivePod';
import { BoardGameView } from '../boardGameView';
import { Entity } from '../entity';
import { OnRemoveEntityCallback } from '../../model/world';

export class DigestivePod implements Entity {
    private _view: BoardGameView;
    private _model: DigestivePodModel;

    public get gameLayer() { return this._view.gameLayer; }
    private _sprite: AnimatedSprite;

    private _onRemoveEntity: OnRemoveEntityCallback = e => {
        if (e === this._model) this.destroy();
    }

    public constructor(view: BoardGameView, model: DigestivePodModel) {
        this._view = view;
        this._model = model;

        const textures = new Array<Texture>();
        for(let i = 0; i < 11; i++) {
            textures.push(Texture.from(`digestivePod/frame00${("00" + i).slice(-2)}.png`));
        }

        this._sprite = new AnimatedSprite(textures);
        this._sprite.play();
        this._sprite.onFrameChange = idx => idx === 8 && this._sprite.stop();
        this._sprite.animationSpeed = 0.05;
        this._sprite.loop = false;
        this._sprite.position.set(this._model.x, this._model.y);
        this._sprite.anchor.set(0.5, 0.9)
        this._sprite.interactive = true;
        this._sprite.interactiveChildren = true;
        this._sprite.zIndex = this._sprite.position.y + 1000;

        if (!this._view.gameLayer) throw new Error();

        model.world.onRemoveEntity(this._onRemoveEntity);

        this._view.gameLayer.addChild(this._sprite);
    }

    public update(timeElapsed: number): void {

    }

    private _destroyed = false
    public destroy(): void {
        if (this._destroyed) return;

        this._destroyed = true;
        this._model.world.offRemoveEntity(this._onRemoveEntity);
        this._sprite.onComplete = ()=>this._sprite.destroy();
        this._sprite.gotoAndPlay(8);
    }
}