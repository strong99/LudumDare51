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

            const titleTxt = new Text("The Blood Tree", { fontSize: 40 });
            titleTxt.x = 0;
            titleTxt.y = -100;
            titleTxt.anchor.set(0.5);
            this._parentResource.addChild(titleTxt);

            const startBtn = new Text("start new game");
            startBtn.x = 0;
            startBtn.y = -50;
            startBtn.anchor.set(0.5);
            startBtn.interactive = true;
            startBtn.on('click', () => this.onNew());
            this._parentResource.addChild(startBtn);

            // To do: Or when there's a save game available to load
            if (this._activeWorld) {
                const continueBtn = new Text("continue");
                continueBtn.x = 0;
                continueBtn.y = 50;
                continueBtn.anchor.set(0.5);
                continueBtn.interactive = true;
                continueBtn.on('click', () => this.onContinue());
                this._parentResource.addChild(continueBtn);
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
        const s = sx > sy ? sx : sy
        this._backdrop?.scale.set(s);
    }

    public destroy(): void {
        this._parentResource?.parent?.removeChild(this._parentResource);
    }
}
