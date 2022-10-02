import { Sprite, Texture } from "pixi.js";
import { Human } from "../../model/human";
import { Projectile as ProjectileModel } from "../../model/projectile";
import { OnRemoveEntityCallback } from "../../model/world";
import { BoardGameView } from "../boardGameView";
import { Entity } from "../entity";

export class Projectile implements Entity {
    private _view: BoardGameView;
    private _model: ProjectileModel;
    private _sprite: Sprite;

    private _onRemoveEntity: OnRemoveEntityCallback = e => {
        if (e === this._model) this.destroy();
    }
    
    public constructor(view: BoardGameView, model: ProjectileModel) {
        this._view = view;
        this._model = model;

        this._sprite = new Sprite(Texture.from('projectile.png'));
        this._sprite.anchor.set(0.5,0.5);

        this._view.entities.push(this);
        this._view.gameLayer?.addChild(this._sprite);

        model.world.onRemoveEntity(this._onRemoveEntity);
    }

    public update(timeElapsed: number): void {
        if (this._destroyed) return;
        
        this._sprite.position.set(
            this._model.x,
            this._model.y
        );
        this._sprite.zIndex = this._model.y + 2000;
    }

    private _destroyed = false
    public destroy(): void {
        if (this._destroyed) return;

        this._destroyed = true;
        this._model.world.offRemoveEntity(this._onRemoveEntity);
        this._sprite.destroy();
    }
}