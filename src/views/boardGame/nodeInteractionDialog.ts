import { Container, Text } from "pixi.js";
import { Node as NodeModel } from "../../model/node";
import { Interaction } from "../../model/player";
import { BoardGameView } from "../boardGameView";
import { Entity } from "../entity";

export class NodeInteractionDialog implements Entity {
    private _view: BoardGameView;
    private _model: NodeModel;
    private _layer = new Container();
    private _interactions = new Array<Interaction>();

    public constructor(view: BoardGameView,  model: NodeModel) {
        this._view = view;
        this._model = model;

        if (!this._view.viewLayer) {
            throw new Error("No layer available");
        }

        this._view.viewLayer.addChild(this._layer);
        this._layer.x = model.x;
        this._layer.y = model.y;

        this._interactions = this._view.player.interactions(model);
        for(let i = 0; i < this._interactions.length; ++i) {
            const interaction = this._interactions[i];
            const sprite = new Text(interaction.id);
            sprite.interactive = true;
            sprite.anchor.set(0.5,0.5);
            const qi = i * Math.PI / (this._interactions.length / 2);
            sprite.position.set(
                Math.cos(qi) * 100,
                Math.sin(qi) * 100
            );
            if (interaction.can()) {
                sprite.on('click', ()=> interaction.do());
            }
            else {
                sprite.alpha = .5;
            }
            this._layer.addChild(sprite);
        }
    }

    public update(timeElapsed: number): void {
        
    }

    public destroy(): void {
        this._layer?.parent?.removeChild(this._layer);
    }
}