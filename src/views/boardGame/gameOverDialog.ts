import { Container, Text } from "pixi.js";
import { Player as PlayerModel } from "../../model/player";
import { Interaction } from "../../model/player";
import { BoardGameView } from "../boardGameView";
import { Entity } from "../entity";

export class GameOverDialog implements Entity {
    private _view: BoardGameView;
    private _model: PlayerModel;
    private _layer = new Container();
    private _interactions = new Array<Interaction>();

    public constructor(view: BoardGameView,  model: PlayerModel) {
        this._view = view;
        this._model = model;

        if (!this._view.uiLayer) {
            throw new Error("No layer available");
        }

        this._view.uiLayer.addChild(this._layer);

        const txt = new Text("Game Over!");
        txt.anchor.set(0.5, 0.5);
        this._layer.addChild(txt);
    }

    public update(timeElapsed: number): void {
        this._layer.position.set(window.innerWidth / 2, window.innerHeight / 2);
    }

    public destroy(): void {
        this._layer?.parent?.removeChild(this._layer);
    }
}