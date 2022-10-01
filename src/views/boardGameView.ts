import { Application } from "pixi.js";
import { Player } from "./boardGame/player";
import { Node } from "./boardGame/node";
import { OnAddEntityCallback, World } from "../model/world";
import { GameView } from "./gameview";
import { GameViewService } from "./gameViewService";
import { LoadState, LoadStateListener } from "./loadState";
import { PlayGameView } from "./playGameView";
import * as BoardGameComponentFactory from "./boardGame/boardGameComponentFactory";

export class BoardGameView implements PlayGameView {
    private _service: GameViewService;
    private _pixi: Application;
    private _world: World;

    private _onAddEntity: OnAddEntityCallback = e => {
        const result = BoardGameComponentFactory.TryCreate(this, e);
        if (!result) {
            console.warn("The given entity did not have view entity", e);
        }
    };

    public constructor(service: GameViewService, pixi: Application, world: World) {
        this._service = service;
        this._pixi = pixi;
        this._world = world;
    }

    public prepare(): LoadStateListener {
        this._world.onAddEntity(this._onAddEntity);

        var loadState = new LoadState();
        loadState.onFinished();
        return loadState;
    }

    public update(elapsedTime: number): void {
        throw new Error("Method not implemented.");
    }

    public destroy(): void {
        throw new Error("Method not implemented.");
    }
}