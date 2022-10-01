import { Application, Container } from "pixi.js";
import { OnAddEntityCallback, World } from "../model/world";
import { GameViewService } from "./gameViewService";
import { LoadState, LoadStateListener } from "./loadState";
import { PlayGameView } from "./playGameView";
import * as BoardGameComponentFactory from "./boardGame/boardGameComponentFactory";
import { Entity } from "./entity";
import { Node as NodeModel } from "../model/node";
import { NodeConnection } from "./boardGame/nodeConnection";

export class BoardGameView implements PlayGameView {
    private _service: GameViewService;
    private _pixi: Application;
    private _world: World;

    public get gameLayer() { return this._gameLayer; }
    private _gameLayer?: Container;
    private _viewLayer?: Container;

    private _entities = new Array<Entity>();
    private _minX = -512;
    private _maxX = 512;
    private _moveViewport = 0;

    private _onAddEntity: OnAddEntityCallback = e => {
        if (e instanceof NodeModel) {
            // try draw connection
            for (const c of e.neighbours) {
                if (!this._entities.some(en => en instanceof NodeConnection && en.connectsTo(e, c))) {
                    this._entities.push(new NodeConnection(this, e, c));
                }
            }
        }

        const result = BoardGameComponentFactory.TryCreate(this, e);
        if (!result) {
            console.warn("The given entity did not have view entity", e);
        }
        else {
            this._entities.push(result);
        }
    };

    public constructor(service: GameViewService, pixi: Application, world: World) {
        this._service = service;
        this._pixi = pixi;
        this._world = world;
    }

    public prepare(): LoadStateListener {
        this._gameLayer = new Container();
        this._viewLayer = new Container();
        this._viewLayer.position.set(window.innerWidth / 2, window.innerHeight - 256);
        this._service.viewLayer.addChild(this._viewLayer);
        this._viewLayer.addChild(this._gameLayer);

        this._world.onAddEntity(this._onAddEntity);

        window.addEventListener('mousemove', e=>{
            if (e.x < 100) this._moveViewport = -1;
            else if (e.x > window.innerWidth - 100) this._moveViewport = 1;
            else this._moveViewport = 0;
        });

        var loadState = new LoadState();
        loadState.onFinished();
        return loadState;
    }

    public update(elapsedTime: number): void {
        if (!this._gameLayer) return;

        const scrollSpeed = 3;
        if (this._moveViewport == -1 && -this._gameLayer.x > this._minX) {
            this._gameLayer.x = Math.max(this._minX, this._gameLayer.x +elapsedTime * scrollSpeed);
        }
        else if (this._moveViewport == 1 && -this._gameLayer.x < this._maxX) {
            this._gameLayer.x = Math.min(this._maxX, this._gameLayer.x - elapsedTime * scrollSpeed);
        }
    }

    public destroy(): void {
        this._gameLayer?.parent?.removeChild(this._gameLayer);
        this._world.offAddEntity(this._onAddEntity);
    }
}