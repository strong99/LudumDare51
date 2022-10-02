import { Container, Sprite, Text, Texture } from "pixi.js";
import { Player as PlayerModel } from "../../model/player";
import { Interaction } from "../../model/player";
import { BoardGameView } from "../boardGameView";
import { Entity } from "../entity";

export class GameOverDialog implements Entity {
    private _view: BoardGameView;
    private _model: PlayerModel;
    private _layer = new Container();
    private _fallingPaper = new Sprite();
    private _txt = new Sprite();
    private _interactions = new Array<Interaction>();

    public constructor(view: BoardGameView,  model: PlayerModel) {
        this._view = view;
        this._model = model;

        if (!this._view.uiLayer) {
            throw new Error("No layer available");
        }

        this._view.uiLayer.addChild(this._layer);

        this._txt = new Sprite(Texture.from('gameOver.png'));
        this._txt.anchor.set(0.5, 0.5);
        this._txt.visible = false;
        this._layer.addChild(this._txt);

        this._fallingPaper = new Sprite(Texture.from('fallingPaper.png'));
        this._fallingPaper.position.y = -window.innerHeight / 2;
        this._fallingPaper.anchor.set(0.5,0.5);
        this._layer.addChild(this._fallingPaper);
    }

    public update(timeElapsed: number): void {
        this._fallingPaper.position.y += timeElapsed / 20;
        this._fallingPaper.position.x += Math.cos(this._fallingPaper.position.y / 40) * 5;
        this._fallingPaper.rotation = -Math.sin(this._fallingPaper.position.y / 40);

        this._txt.visible = this._fallingPaper.position.y > 0;

        this._layer.position.set(window.innerWidth / 2, window.innerHeight / 2);
    }

    public destroy(): void {
        this._layer?.parent?.removeChild(this._layer);
    }
}