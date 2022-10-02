import { Sprite, Texture, ViewableBuffer } from "pixi.js";
import { NodeConstruction as NodeConstructionModel } from "../../model/nodeConstruction";
import { TreeConstruct } from "../../model/treeConstruct";
import { BoardGameView } from "../boardGameView";
import { Entity } from "../entity";
import { Node } from "./node";

const flySpeed = 750;

export class FruitMoveTo implements Entity {
    private _view: BoardGameView;
    private _model: NodeConstructionModel;
    private _sprite: Sprite;

    private _sx: number;
    private _sy: number;

    private _ex: number;
    private _ey: number;

    private _flyTime: number = flySpeed;
    
    public constructor(node: Node, model: NodeConstructionModel) {
        this._view = node.view;
        this._model = model;

        this._sprite = new Sprite(Texture.from('fruit.png'));
        this._sprite.anchor.set(0.5,0.5);
        const tree = this._model.player.world.nodes.find(p=>p.construct instanceof TreeConstruct)?.construct as TreeConstruct;
        
        if (!tree) {
            throw new Error();
        }

        this._sx = this._sprite.position.x = tree.node.x;
        this._sy =this._sprite.position.y = tree.node.y - 110;
        this._ex = model.node.x;
        this._ey = model.node.y;

        node.view.entities.push(this);
        node.view.gameLayer?.addChild(this._sprite);
    }

    public update(timeElapsed: number): void {
        if (this._destroyed) return;
        
        const dx = this._sx - this._ex;
        const dy = this._sy - this._ey;
        const l = Math.sqrt(dx*dx+dy*dy);
        const nx = dx / l;
        const ny = dy / l;

        this._flyTime -= timeElapsed;
        const left = this._flyTime / flySpeed;
        this._sprite.x = this._ex + dx * left;
        this._sprite.y = this._ey + dy * left;
        this._sprite.zIndex = this._sprite.y + 2000;

        if (this._flyTime < 0) {
            this.destroy();
        }
    }

    private _destroyed = false
    public destroy(): void {
        if (this._destroyed) return;

        this._destroyed = true;
        this._sprite.destroy();
        this._view.entities.splice(this._view.entities.indexOf( this));
    }
}