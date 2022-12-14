import { Application, Container, Loader, Text, utils } from "pixi.js";
import { DemoWorld } from "../demo/DemoWorld";
import { SaveManager } from "../io/saveManager";
import { World } from "../model/world";
import { BoardGameView } from "./boardGameView";
import { GameView } from "./gameView";
import { IntroGameView } from "./introGameView";
import { LoadStateListener } from "./loadState";
import { MenuBackgroundEntity } from "./menuBackgroundEntity";
import { MenuGameView } from "./menuGameView";

/**
 * Intermediate game view that shows when other game views are 
 * preparing, only useable by the GameViewService.
 */
class LoadingGameView {
    private _pixi: Application;
    private _service: GameViewService;

    private _backdrop?: MenuBackgroundEntity;

    private _listener: LoadStateListener;

    private _container = new Container();

    public constructor(pixi: Application, service: GameViewService, listener: LoadStateListener) {
        this._pixi = pixi;
        this._service = service;
        this._listener = listener;

        const onLoad: Loader.OnCompleteSignal = ()=>{
            this._backdrop = new MenuBackgroundEntity(this._container);
        };
        const toLoadForLoader = new Array<string>();
        for(let i =1; i < 6; ++i ){
            toLoadForLoader.push(`menuBack00${i}.png`);
        }
        const notYetLoaded = toLoadForLoader.filter(p=>p in utils.TextureCache === false);
        if (notYetLoaded.length > 0) {
            const loader = new Loader();
            loader.onComplete.add(onLoad);
            loader.load();
        }
        else {
            const r = this._pixi.loader;
            onLoad(r, r.resources);
        }

        // implementation
        const loadingText = new Text("Loading", {
            align: 'center'
        });
        loadingText.anchor.set(0.5);
        this._container.addChild(loadingText);
        this._container.position.set(window.innerWidth /  2, window.innerHeight / 2);

        this._listener.registerOnProgress((idx, total, stage) => {
            //loadingText.text = `${Math.round(idx/total*100)}%\n${stage}`;
            loadingText.text = `${Math.round(idx/total*100)}%\nLoading`;
        });

        this._pixi.stage.addChild(this._container);
    }

    public update(timeElapsed: number) {
        // To do: implement load graphics
        this._backdrop?.update(timeElapsed);
        this._container.position.set(window.innerWidth /  2, window.innerHeight / 2);
    }

    public destroy(): void {
        this._backdrop?.destroy();
        this._container.destroy();
    }
}

export class GameViewService {

    private _pixi: Application;
    private _view?: GameView;
    private _viewLayer: Container = new Container();
    private _loadingView?: LoadingGameView;
    private _saveManager = new SaveManager();

    public get viewLayer() { return this._viewLayer; }
    public get saveManager() { return this._saveManager; }

    public constructor(pixiApp: Application) {
        this._pixi = pixiApp;
        this._pixi.stage.addChild(this._viewLayer);
        this.swapViewToMenu();
        //this.swapViewToBoard(new World(DemoWorld));
        //this.swapViewToIntro(new World(DemoWorld));
    }

    /**
     * Swaps a view and show a loader until the new view is finished preparing
     * @param gameView the new view to use
     */
    public swapView(gameView: GameView) {
        if (this._loadingView) {
            throw new Error("Previous view is still loading");
        }

        this._view?.destroy();

        const loader = gameView.prepare();

        this._loadingView = new LoadingGameView(this._pixi, this, loader);
        loader.registerOnFinished(() => {
            this._loadingView?.destroy();
            delete this._loadingView;

            this._view = gameView;
        });
    }

    public update(elapsedTime: number): void {
        this._loadingView?.update(elapsedTime);
        this._view?.update(elapsedTime);
    }

    public toggleFullscreen(newState?: boolean): boolean {
        newState ??= !!!document.fullscreenElement;
        if (newState) {
            this._pixi.view.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
        return !!document.fullscreenElement;
    }

    public swapViewToMenu(world?: World): void {
        this.swapView(new MenuGameView(this, this._pixi, world));
    }

    public swapViewToBoard(world?: World): void {
        world ??= new World(DemoWorld);
        this.swapView(new BoardGameView(this, this._pixi, world));
    }

    public swapViewToIntro(world?: World): void {
        world ??= new World(DemoWorld);
        this.swapView(new IntroGameView(this, this._pixi, world));
    }
}