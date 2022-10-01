import { Application, Container } from "pixi.js";
import { OnAddEntityCallback, World } from "../model/world";
import { GameViewService } from "./gameViewService";
import { LoadState, LoadStateListener } from "./loadState";
import { PlayGameView } from "./playGameView";
import * as BoardGameComponentFactory from "./boardGame/boardGameComponentFactory";
import * as DialogCreatorFactory from "./boardGame/dialogCreatorFactory";
import { Entity } from "./entity";
import { Entity as Model } from "../model/entity";
import { Node as NodeModel } from "../model/node";
import { NodeConnection } from "./boardGame/nodeConnection";

export class BoardGameView implements PlayGameView {
    private _service: GameViewService;
    private _pixi: Application;
    private _world: World;

    public get gameLayer() { return this._gameLayer; }
    private _gameLayer?: Container;
    private _viewLayer?: Container;

    private _dialog?: Entity;
    private _entities = new Array<Entity>();
    private _minX = -512;
    private _maxX = 512;
    private _scrollViewport = 0;

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

    private _onPointerMove: (this: Window, ev: PointerEvent) => any = e => {
        if (e.x < 100) this._scrollViewport = -1;
        else if (e.x > window.innerWidth - 100) this._scrollViewport = 1;
        else this._scrollViewport = 0;
    };

    public get selected() { return this._selected; }
    private _selected?: NodeModel;
    public select(node: NodeModel) {
        if (node === this._selected) {
            delete this._selected;
        }
        else {
            this._selected = node;
        }

        this._dialog?.destroy();
        if (this._selected) {
            this._dialog = DialogCreatorFactory.TryCreate(this, node);
        }
        else delete this._dialog;
    }

    public prepare(): LoadStateListener {
        this._gameLayer = new Container();
        this._viewLayer = new Container();
        this._viewLayer.position.set(window.innerWidth / 2, window.innerHeight - 256);
        this._service.viewLayer.addChild(this._viewLayer);
        this._viewLayer.addChild(this._gameLayer);

        this._world.onAddEntity(this._onAddEntity);

        // Scroll viewport
        window.addEventListener('pointermove', this._onPointerMove);

        var loadState = new LoadState();
        loadState.onFinished();
        return loadState;
    }

    public update(elapsedTime: number): void {
        if (!this._gameLayer) return;

        // Scroll viewport
        const scrollSpeed = 3;
        if (this._scrollViewport == -1 && -this._gameLayer.x > this._minX) {
            this._gameLayer.x = Math.max(this._minX, this._gameLayer.x + elapsedTime * scrollSpeed);
        }
        else if (this._scrollViewport == 1 && -this._gameLayer.x < this._maxX) {
            this._gameLayer.x = Math.min(this._maxX, this._gameLayer.x - elapsedTime * scrollSpeed);
        }

        const entities = [...this._entities];
        for(const e of entities)
            e.update(elapsedTime);
    }

    public destroy(): void {
        window.removeEventListener('pointermove', this._onPointerMove);
        this._gameLayer?.parent?.removeChild(this._gameLayer);
        this._world.offAddEntity(this._onAddEntity);
    }
}