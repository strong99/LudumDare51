import { Application } from "pixi.js";
import { World } from "../model/world";
import { GameView } from "./gameview";
import { GameViewService } from "./gameViewService";
import { LoadStateListener } from "./loadState";

export interface PlayGameView extends GameView {
    
}

export class BoardGameView implements PlayGameView {
    private _service: GameViewService;
    private _pixi: Application;
    private _world: World;

    public constructor(service: GameViewService, pixi: Application, world: World) {
        this._service = service;
        this._pixi = pixi;
        this._world = world;
    }

    public prepare(): LoadStateListener {
        throw new Error("Method not implemented.");
    }

    public update(elapsedTime: number): void {
        throw new Error("Method not implemented.");
    }
    
    public destroy(): void {
        throw new Error("Method not implemented.");
    }   
}