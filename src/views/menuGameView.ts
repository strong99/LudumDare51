import { Application, Container, Text } from "pixi.js";
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

    public constructor(viewService: GameViewService, pixi: Application, world?: World) {
        this._pixi = pixi;
        this._viewService = viewService;
        this._activeWorld = world;
    }

    public prepare(): LoadState {
        this._parentResource = new Container();
        this._parentResource.visible = false;

        const startBtn = new Text("start new game");
        startBtn.x = 100;
        startBtn.y = 100;
        startBtn.interactive = true;
        startBtn.on('click', () => this.onNew());
        this._parentResource.addChild(startBtn);

        // To do: Or when there's a save game available to load
        if (this._activeWorld) {
            const continueBtn = new Text("continue");
            continueBtn.x = 100;
            continueBtn.y = 200;
            continueBtn.interactive = true;
            continueBtn.on('click', () => this.onContinue());
            this._parentResource.addChild(continueBtn);
        }

        this._pixi.stage.addChild(this._parentResource);
        this._parentResource.visible = true;

        const loadState = new LoadState();
        loadState.onFinished();
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

    }

    public destroy(): void {
        this._parentResource?.parent?.removeChild(this._parentResource);
    }
}
