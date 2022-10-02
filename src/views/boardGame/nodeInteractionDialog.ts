import { Container, Sprite, Text, Texture } from "pixi.js";
import { Node as NodeModel } from "../../model/node";
import { Interaction } from "../../model/player";
import { BoardGameView } from "../boardGameView";
import { Entity } from "../entity";

export class NodeInteractionDialog implements Entity {
    private _view: BoardGameView;
    private _model: NodeModel;
    private _layer: Container;
    private _interactions = new Array<{ model: Interaction, visual: Sprite }>();

    public constructor(view: BoardGameView,  model: NodeModel) {
        this._view = view;
        this._model = model;

        if (!this._view.gameLayer) {
            throw new Error("No layer available");
        }

        if (!this._view.gameLayer)
            throw new Error();

        this._layer = new Container();
        this._layer.x = this._model.x;
        this._layer.y = this._model.y;
        this._layer.zIndex = 9999999;

        this._view.gameLayer.addChild(this._layer);

        const interactions = this._view.player.interactions(this._model);
        for(let i = 0; i < interactions.length; ++i) {
            const interaction = interactions[i];
            const id = interaction.id[0].toUpperCase() + interaction.id.substring(1);
            const sprite = new Sprite(Texture.from(`icon${id}.png`));
            sprite.interactive = true;
            sprite.anchor.set(0.5,0.5);
            sprite.position.set(
                -80 * (-interactions.length / 2 + i),
                50
            );
            sprite.on('click', ()=> { 
                if (interaction.can()) {
                    interaction.do();
                    this._view.select();
                }
            });
            sprite.on('pointerover', ()=> { 
                sprite.tint = 0xccccff;
                sprite.scale.set(1.25);
            });
            sprite.on('pointerout', ()=> { 
                sprite.tint = 0xffffff;
                sprite.scale.set(1);
            });
            
            if (!interaction.can()) {
                sprite.alpha = .5;
            }
            this._layer.addChild(sprite);
            this._interactions.push({ model: interaction, visual: sprite });
        }
    }

    public update(timeElapsed: number): void {
        for(const i of this._interactions) {
            i.visual.alpha = i.model.can() ? 1: 0.5;
        }
    }

    public destroy(): void {
        this._layer?.parent?.removeChild(this._layer);
    }
}