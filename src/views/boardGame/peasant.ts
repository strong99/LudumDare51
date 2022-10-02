import { AnimatedSprite, Sprite, Texture, ViewableBuffer } from 'pixi.js';
import { Peasant as PeasantModel, PeasantTask } from '../../model/peasant';
import { OnRemoveEntityCallback } from '../../model/world';
import { BoardGameView } from '../boardGameView';
import { Entity } from '../entity';

export class Peasant implements Entity {
    private _view: BoardGameView;
    private _model: PeasantModel;

    public get gameLayer() { return this._sprite; }
    private _sprite: Sprite;
    private _icon?: AnimatedSprite;

    private _onRemoveEntity: OnRemoveEntityCallback = e => {
        if (e === this._model) this.destroy();
    }

    public constructor(view: BoardGameView, model: PeasantModel) {
        this._view = view;
        this._model = model;

        this._sprite = new Sprite(Texture.from("peasant.png"));
        this._sprite.position.set(this._model.x, this._model.y);
        this._sprite.anchor.set(0.5, 0.5);

        if (!this._view.gameLayer) throw new Error();

        model.world.onRemoveEntity(this._onRemoveEntity);

        this._view.gameLayer.addChild(this._sprite);
    }

    private _state?: PeasantTask;
    public update(timeElapsed: number): void {
        this._sprite.position.set(this._model.x, this._model.y);
        this._sprite.zIndex = this._sprite.position.y + (1 - this._sprite.anchor.y) * this._sprite.texture.height + 1000;

        if (this._model.isAlerted && this._state !== PeasantTask.Alert) {
            this._state = PeasantTask.Alert;
            const textures = new Array<Texture>();
            for(let i = 0; i < 4; i++) {
                textures.push(Texture.from(`iconAlert/frame000${i}.png`));
            }
            this._view.startPlaying('alarm');
            this._icon?.destroy();
            this._icon = new AnimatedSprite(textures);
            this._icon.play();
            this._icon.loop = true;
            this._icon.animationSpeed = 0.2;
            this._icon.anchor.set(0.5);
            this._icon.y -= 34;
            this._sprite.addChild(this._icon);
        }
        else if (!this._model.isAlerted && this._state === PeasantTask.Alert) {
            this._view.stopPlaying('alarm');
            this._icon?.stop();
            this._icon?.destroy();
            delete this._state;
            delete this._icon;
        }
    }

    private _destroyed = false
    public destroy(): void {
        if (this._destroyed) return;

        this._destroyed = true;
        this._model.world.offRemoveEntity(this._onRemoveEntity);
        this._sprite?.parent.removeChild(this._sprite);
    }
}