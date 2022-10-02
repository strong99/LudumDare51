import { Application, Container, Loader, Sprite, Text } from "pixi.js";
import { DemoWorld } from "../demo/DemoWorld";
import { World } from "../model/world";
import { GameView } from "./gameView";
import { GameViewService } from "./gameViewService";
import { LoadState } from "./loadState";

export class MenuGameView implements GameView {

    private _viewService: GameViewService;
    private _pixi: Application;

    private _parentResource?: Container;
    private _activeWorld?: World;

    private _backdrop?: Container;
    private _sky?: Sprite;
    private _background?: Sprite;
    private _foreground?: Sprite;
    private _questBoard?: Sprite;
    
    private _startButton?: Sprite;
    private _continueButton?: Sprite;

    public constructor(viewService: GameViewService, pixi: Application, world?: World) {
        this._pixi = pixi;
        this._viewService = viewService;
        this._activeWorld = world;
    }

    public prepare(): LoadState {
        this._parentResource = new Container();
        this._parentResource.visible = false;

        this._pixi.stage.addChild(this._parentResource);
        this._parentResource.visible = true;

        const loader = new Loader()
            .add('continueButton.png')
            .add('questBoard.png')
            .add('startButton.png')
            .add('menu.png');

        const loadState = new LoadState();
        let i = 0;
        loader.onProgress.add((l, r) => loadState.onProgress(++i, Object.keys(loader.resources).length, r.name))
        loader.onComplete.add((r) => {
            if (!this._parentResource) {
                throw new Error("Layer not loaded");
            }

            this._backdrop = new Container();

            this._foreground = new Sprite(r.resources['menu.png'].texture);
            this._foreground.anchor.set(0.5, 0.5);
            this._backdrop.addChild(this._foreground);
            this._parentResource.addChild(this._backdrop);

            this._questBoard = new Sprite(r.resources['questBoard.png'].texture);
            this._questBoard.anchor.set(0, 1);
            this._questBoard.position.set(-window.innerWidth / 2, window.innerHeight / 2);
            this._parentResource.addChild(this._questBoard);

            this._startButton = new Sprite(r.resources['startButton.png'].texture);
            this._startButton.anchor.set(0.5, 0.5);
            this._startButton.position.set(153, -120);
            this._startButton.interactive = true;
            this._startButton.on('click', ()=>this.onNew());
            this._startButton.on('pointerover', ()=>this._startButton?.scale.set(1.2));
            this._startButton.on('pointerout', ()=>this._startButton?.scale.set(1));
            this._questBoard.addChild(this._startButton);

            if (true || this._activeWorld || this._viewService.saveManager.hasQuickSave()) {
                this._continueButton = new Sprite(r.resources['continueButton.png'].texture);
                this._continueButton.anchor.set(0.5, 0.5);
                this._continueButton.position.set(276, -116);
                this._continueButton.interactive = true;
                this._continueButton.on('click', ()=>this.onContinue());
                this._continueButton.on('pointerover', ()=>this._continueButton?.scale.set(1.2));
                this._continueButton.on('pointerout', ()=>this._continueButton?.scale.set(1));
                this._questBoard.addChild(this._continueButton);
            }

            loadState.onFinished()
        });
        loader.load();
        return loadState;
    }

    private onNew() {
        const world = new World(DemoWorld);
        this._viewService.swapViewToBoard(world);
    }

    private onContinue() {
        const world = this._activeWorld ?? this._viewService.saveManager.loadQuickSave();
        this._viewService.swapViewToBoard(world);
    }

    public update(elapsedTime: number): void {
        this._parentResource?.position.set(window.innerWidth / 2, window.innerHeight / 2);
        const sx = window.innerWidth / 1600;
        const sy = window.innerHeight / 1080;
        const maxS = sx > sy ? sx : sy
        const minS = sx < sy ? sx : sy
        this._backdrop?.scale.set(maxS);
        this._questBoard?.scale.set(minS);
    }

    public destroy(): void {
        this._parentResource?.parent?.removeChild(this._parentResource);
    }
}
