import { EntityDataTypes, PlayerDataTypes, WorldData } from "../io/dto";
import { Entity } from "./entity";
import { Human } from "./human";
import { Node } from "./node";
import { Player } from "./player";
import * as EntityFactory from "./entityFactory";
import * as PlayerFactory from "./playerFactory";
import { PlayerControlled } from "./playerControlled";

export type OnAddEntityCallback = (e: Entity) => void;
export type OnRemoveEntityCallback = (e: Entity) => void;

export class World {
    private _players = new Array<Player>();
    private _entities = new Array<Entity>();
    private _playTime: number = 0;
    private _lastGeneratdId: number = 0;

    private _onAddEntityCallbacks = new Array<OnAddEntityCallback>();
    private _onRemoveEntityCallbacks = new Array<OnRemoveEntityCallback>();

    public get playTime() { return this._playTime; }

    public get entities() { return this._entities; }
    public get players() { return this._players; }
    public get digistivePods() { return this._entities.find(e => e instanceof Node && e.construct instanceof PlayerControlled && e.construct.pods.length > 0); }
    public get node() { return this._entities.find(e => e instanceof Node); }
    public get human() { return this._entities.find(e => e instanceof Human); }

    public constructor(data?: WorldData) {
        if (data) {
            this._lastGeneratdId = data.lastGeneratdId;
            this._playTime = data.playTime;
            for (const p of data.players) {
                PlayerFactory.Create(this, p);
            }
            for (const e of data.entities) {
                EntityFactory.Create(this, e);
            }
        }
    }

    public update(elapsedTime: number): void {
        const players = [...this._players];
        for (const p of players) {
            p.update(elapsedTime);
        }

        const entities = [...this._entities];
        for (const e of entities) {
            e.update(elapsedTime);
        }
    }

    public serialize(): WorldData {
        const entities = new Array<EntityDataTypes>();
        for (const e of this._entities) {
            entities.push(e.serialize());
        }

        const players = new Array<PlayerDataTypes>();
        for (const p of this._players) {
            players.push(p.serialize());
        }

        return {
            lastGeneratdId: this._lastGeneratdId,
            playTime: this._playTime,
            entities,
            players
        };
    }

    public generateId() {
        return ++this._lastGeneratdId;
    }

    public addEntity(entity: Entity): void {
        const idx = this._entities.indexOf(entity);
        if (idx >= 0) {
            throw new Error("Entity alrady exists in this world");
        }

        this._entities.push(entity);

        const callbacks = [...this._onAddEntityCallbacks];
        for (const c of callbacks) {
            c(entity);
        }
    }

    public removeEntity(entity: Entity): void {
        const idx = this._entities.indexOf(entity);
        if (idx < 0) {
            throw new Error("Entity does not exist in this world");
        }

        this._entities.splice(idx, 1);

        const callbacks = [...this._onRemoveEntityCallbacks];
        for (const c of callbacks) {
            c(entity);
        }
    }


    public addPlayer(player: Player): void {
        const idx = this._players.indexOf(player);
        if (idx >= 0) {
            throw new Error("Entity alrady exists in this world");
        }

        this._players.push(player);
    }

    public removePlayer(player: Player): void {
        const idx = this._players.indexOf(player);
        if (idx < 0) {
            throw new Error("Entity does not exist in this world");
        }

        this._players.splice(idx, 1);
    }

    public onAddEntity(onAddEntityCallback: OnAddEntityCallback) {
        this._onAddEntityCallbacks.push(onAddEntityCallback);

        for (const e of this._entities) {
            if (!this._onAddEntityCallbacks.includes(onAddEntityCallback)) {
                break;
            }
            onAddEntityCallback(e);
        }
    }

    public offAddEntity(onAddEntityCallback: OnAddEntityCallback) {
        const idx = this._onAddEntityCallbacks.indexOf(onAddEntityCallback);
        if (idx == -1) {
            throw new Error("Callback is not bound");
        }
        this._onAddEntityCallbacks.splice(idx, 1);
    }

    public onRemoveEntity(onRemoveEntityCallback: OnRemoveEntityCallback) {
        this._onRemoveEntityCallbacks.push(onRemoveEntityCallback);
    }
}