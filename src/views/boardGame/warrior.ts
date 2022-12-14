import { Sprite, Texture } from 'pixi.js';
import { Warrior as WarriorModel, WarriorTask } from '../../model/warrior';
import { BoardGameView } from '../boardGameView';
import { Entity } from '../entity';

export class Warrior implements Entity {
    private _view: BoardGameView;
    private _model: WarriorModel;

    public get gameLayer() { return this._sprite; }
    private _sprite: Sprite;

    public constructor(view: BoardGameView, model: WarriorModel) {
        this._view = view;
        this._model = model;

        this._sprite = new Sprite(Texture.from("warrior.png"));
        this._sprite.position.set(this._model.x, this._model.y);
        this._sprite.anchor.set(0.5, 0.5);

        if (!this._view.gameLayer)throw new Error();

        this._view.gameLayer.addChild(this._sprite);
    }

    private _fighting = false;
    public update(timeElapsed: number): void {
        const fightState = this._model.task === WarriorTask.Attack;
        if (this._fighting !== fightState) {
            if (fightState) this._view.startPlaying('fighting');
            else this._view.stopPlaying('fighting');
        }

        this._sprite.position.set(this._model.x, this._model.y);
        this._sprite.zIndex = this._sprite.position.y + 1000;
        this._view.queMusic("depressedTune");
    }
    
    public destroy(): void {
        this._sprite?.parent?.removeChild(this._sprite);
        if (this._fighting) this._view.stopPlaying('fighting');
    }
}