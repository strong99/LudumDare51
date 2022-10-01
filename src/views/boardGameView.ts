import { Application, Container, Loader, Sprite } from "pixi.js";
import { OnAddEntityCallback, World } from "../model/world";
import { GameViewService } from "./gameViewService";
import { LoadState, LoadStateListener } from "./loadState";
import { PlayGameView } from "./playGameView";
import * as BoardGameComponentFactory from "./boardGame/boardGameComponentFactory";
import * as DialogCreatorFactory from "./boardGame/dialogCreatorFactory";
import { Entity } from "./entity";
import { Node as NodeModel } from "../model/node";
import { NodeConnection } from "./boardGame/nodeConnection";
import { Player as PlayerModel } from "../model/player";
import { TreePlayer } from "../model/treePlayer";

export class BoardGameView implements PlayGameView {
    private _service: GameViewService;
    private _pixi: Application;
    private _world: World;

    public get gameLayer() { return this._gameLayer; }
    private _gameLayer?: Container;
    
    public get viewLayer() { return this._viewLayer; }
    private _viewLayer?: Container;

    public get player(): PlayerModel { return this._player; }
    private _player: PlayerModel;

    private _dialog?: Entity;
    private _surface?: Sprite;
    private _entities = new Array<Entity>();
    private _minX = -786
    private _maxX = 786;
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
        this._player = this._world.players.find(p=>p instanceof TreePlayer)!;
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

        const loader = new Loader()
            .add('tree.png')
            .add('node.png')
            .add('lure.png')
            .add('defensive.png')
            .add('offensive.png')
            .add('surface.png');

        // Scroll viewport
        window.addEventListener('pointermove', this._onPointerMove);

        const loadState = new LoadState();
        let i = 0;
        loader.onProgress.add((l, r)=>loadState.onProgress(++i, Object.keys(loader.resources).length, r.name))
        loader.onComplete.add((r)=> {
            this._surface = new Sprite(r.resources['surface.png'].texture);
            this._surface.anchor.set(0.5, 0.5);
            this._surface.zIndex = this._surface.position.y - this._surface.anchor.y * this._surface.texture.height;
            this._gameLayer?.addChild(this._surface);

            loadState.onFinished()
        });
        loader.load();
        return loadState;
    }

    public update(elapsedTime: number): void {
        if (!this._gameLayer) return;

        this._world?.update(elapsedTime);

        // Scroll viewport
        const scrollSpeed = 2;
        if (this._scrollViewport == -1 && -this._gameLayer.x > this._minX) {
            this._gameLayer.x = Math.max(this._minX, this._gameLayer.x + elapsedTime * scrollSpeed);
        }
        else if (this._scrollViewport == 1 && -this._gameLayer.x < this._maxX) {
            this._gameLayer.x = Math.min(this._maxX, this._gameLayer.x - elapsedTime * scrollSpeed);
        }

        const entities = [...this._entities];
        for(const e of entities) {
            e.update(elapsedTime);
        }

        this._gameLayer.children.sort((a,b)=>a.zIndex-b.zIndex);
    }

    public destroy(): void {
        window.removeEventListener('pointermove', this._onPointerMove);
        this._gameLayer?.parent?.removeChild(this._gameLayer);
        this._world.offAddEntity(this._onAddEntity);
    }
}