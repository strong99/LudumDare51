import { AnimatedSprite, Container, Ellipse, Sprite, Text, Texture } from 'pixi.js';
import { Node as NodeModel } from '../../model/node';
import { NodeConstruction } from './nodeConstruction';
import * as NodeConstructionFactory from './nodeConstructionFactory';
import { BoardGameView } from '../boardGameView';
import { Entity } from '../entity';

export class Node implements Entity {
    private _view: BoardGameView;
    private _model: NodeModel;

    public get gameLayer() { return this._view.gameLayer; }
    private _sprite: AnimatedSprite;

    private _nodeConstruction?: NodeConstruction;

    public constructor(view: BoardGameView, model: NodeModel) {
        this._view = view;
        this._model = model;

        const textures = [];
        for(let i = 0; i < 3; i++) {
            textures.push(Texture.from(`nodeHighlighting/frame000${i}.png`));
        }

        this._sprite = new AnimatedSprite(textures);
        this._sprite.position.set(this._model.x, this._model.y);
        this._sprite.anchor.set(0.5, 0.5);
        this._sprite.interactive = true;
        this._sprite.interactiveChildren = true;
        this._sprite.animationSpeed = 0.3;
        const hitAreaContainer = new Container();
        hitAreaContainer.interactive = true;
        hitAreaContainer.hitArea = new Ellipse(0, 0, 64, 32);
        this._sprite.addChild(hitAreaContainer);
        this._sprite.on('pointerover', ()=>this.startHover());
        this._sprite.on('pointerout', ()=>this.endHover());
        this._sprite.on('click', ()=>this._view.select(model));
        this._sprite.zIndex = this._sprite.position.y;

        /*const idtxt = new Text(this._model.id);
        idtxt.anchor.set(.5);
        this._sprite.addChild(idtxt);*/

        if (!this._view.gameLayer)throw new Error();

        this._view.gameLayer.addChild(this._sprite);

        if (this._model.construct) {
            this._nodeConstruction = NodeConstructionFactory.TryCreate(this, this._model.construct);
        }
    }
    
    private _hoverCount = 0;
    private get isHovered() { return this._hoverCount > 0; }
    public startHover() {
        this._hoverCount++;
        if (this._hoverCount === 1) {
            this._sprite.play();
        }
    }

    public endHover() {
        this._hoverCount--;
        if (this._hoverCount === 0) {
            this._sprite.stop();
        }
    }

    public update(timeElapsed: number): void {
        const isSelected = this._view.selected === this._model;

        let colour = 0xffffff;
        let alpha = 0.0;
        if (isSelected) {
            alpha = 1;
            colour = 0xff66ff;
        }
        else if (this.isHovered) {
            alpha = 0.75;
            colour = 0xffccff;
        }

        if (this._sprite.tint !== colour) {
            this._sprite.tint = colour;
        }
        this._sprite.alpha = alpha;

        if (!this._model.construct && this._nodeConstruction) {
            this._nodeConstruction.destroy();
            delete this._nodeConstruction;
        }
        else if (this._model.construct && (!this._nodeConstruction || !this._nodeConstruction.is(this._model.construct))) {
            this._nodeConstruction?.destroy();
            this._nodeConstruction = NodeConstructionFactory.TryCreate(this, this._model.construct);
        }

        this._nodeConstruction?.update(timeElapsed);
    }
    
    public destroy(): void {
        this._sprite?.parent.removeChild(this._sprite);
    }
}