import { Container } from "pixi.js";
import { Node as NodeModel } from "../../model/node";
import { BoardGameView } from "../boardGameView";
import { Entity } from "../entity";

export class NodeInteractionDialog implements Entity {
    private _view: BoardGameView;
    private _model: NodeModel;
    private _layer = new Container();

    public constructor(view: BoardGameView, model: NodeModel) {
        this._view = view;
        this._model = model;
        this._view.gameLayer?.addChild(this._layer);
    }

    public update(timeElapsed: number): void {
        
    }

    public destroy(): void {
        this._layer?.parent.removeChild(this._layer);
    }
}