import { Container, Sprite, Text, Texture } from "pixi.js";
import { SaveManager } from "../../io/saveManager";
import { World } from "../../model/world";
import { BoardGameView } from "../boardGameView";
import { Entity } from "../entity";

export class GameMenuSidePanel implements Entity {
    private _view: BoardGameView;
    private _anchor: Container;
    private _subAnchor: Container;
    private _model: World;

    private _quickLoad: Container;

    public constructor(view: BoardGameView, model: World) {
        this._view = view;
        this._model = model;

        this._anchor = new Container();
        this._anchor.position.set(10, 10);
        this._view.uiLayer?.addChild(this._anchor);

        this.createButton(
            'menu',
            'game menu',
            () => this._subAnchor.visible = !this._subAnchor.visible,
            this._anchor
        );

        this._subAnchor = new Container();
        this._subAnchor.position.set(0, 74);
        this._subAnchor.visible = false;
        this._anchor.addChild(this._subAnchor);

        this.createButton(
            'fullscreen',
            'toggle fullscreen',
            () => this._view.service.toggleFullscreen(),
            this._subAnchor
        );

        this.createButton(
            'restart',
            'restart',
            () => this._view.service.swapViewToBoard(),
            this._subAnchor
        );

        this.createButton(
            'save',
            'quick save',
            () => {
                this._view.service.saveManager.storeQuickSave(this._model);
                this._quickLoad.alpha = 1;
            },
            this._subAnchor
        );

        this._quickLoad = this.createButton(
            'load',
            'quick load',
            () => {
                const world = this._view.service.saveManager.loadQuickSave();
                this._view.service.swapViewToBoard(world);
            },
            this._subAnchor
        );
        this._quickLoad.alpha = this._view.service.saveManager.hasQuickSave() ? 1 : 0.5;

        this.createButton(
            'LDJam',
            'go to Ludum Dare 51',
            () => window.open('https://ldjam.com/events/ludum-dare/51/the-blood-tree'),
            this._subAnchor
        );
    }

    private createButton(id: string, text: string, click: () => void, anchor: Container): Container {
        const idUpper = id[0].toUpperCase() + id.substring(1);
        const btn = new Sprite(Texture.from(`icon${idUpper}.png`));
        btn.position.set(btn.width / 2, btn.height / 2 + anchor.children.length * 72);
        btn.anchor.set(0.5, 0.5);
        btn.interactive = true;

        const lbl = new Text(text, {
            fontSize: 40,
            fontWeight: 'bolder',
            fill: 'white'
        });
        lbl.position.set(btn.width + 10, 0);
        lbl.anchor.set(0, 0.5);
        lbl.visible = false;
        btn.addChild(lbl);

        btn.on('pointerover', () => { btn.scale.set(1.1, 1.1); lbl.visible = true; });
        btn.on('pointerout', () => { btn.scale.set(1, 1); lbl.visible = false; });
        btn.on('click', click);

        anchor.addChild(btn);
        return btn;
    }

    public update(timeElapsed: number): void {

    }

    public destroy(): void {
        this._anchor.destroy();
    }
}