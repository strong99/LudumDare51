import { Application } from "pixi.js";
import { World } from "../logic/world";
import { GameView } from "./gameview";
import { GameViewService } from "./gameViewService";
import { LoadStateListener } from "./loadState";

export interface PlayGameView extends GameView {
    
}

export class BoardGameView implements PlayGameView {
    public constructor(service: GameViewService, pixi: Application, world: World) {
        
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