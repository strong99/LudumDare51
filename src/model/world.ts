import { EntityDataTypes, WorldData } from "../io/dto";
import { DigestivePod } from "./digestivePod";
import { Entity } from "./entity";
import { Human } from "./human";
import { Node } from "./node";
import { Player } from "./player";
import * as EntityFactory from "./entityFactory";

export class World {
    private _entities = new Array<Entity>();
    private _playTime: number = 0;

    public get playTime() { return this._playTime; }

    public get entities() { return this._entities; }
    public get player() { return this._entities.find(e => e instanceof Player); }
    public get digistivePods() { return this._entities.find(e => e instanceof DigestivePod); }
    public get node() { return this._entities.find(e => e instanceof Node); }
    public get human() { return this._entities.find(e => e instanceof Human); }

    public constructor(data?: WorldData) {
        if (data) {
            this._playTime = data.playTime;
            for (const e of data.entities) {
                EntityFactory.Create(this, e);
            }
        }
    }

    public update(elapsedTime: number): void {
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

        return {
            playTime: this._playTime,
            entities
        };
    }

    public add(entity: Entity): void {
        const idx = this._entities.indexOf(entity);
        if (idx >= 0) {
            throw new Error("Entity alrady exists in this world");
        }

        this._entities.push(entity);
    }

    public remove(entity: Entity): void {
        const idx = this._entities.indexOf(entity);
        if (idx < 0) {
            throw new Error("Entity does not exist in this world");
        }

        this._entities.splice(idx, 1);
    }
}