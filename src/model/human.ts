import { HumanData, HumanDataTypes } from "../io/dto";
import { Entity } from "./entity";
import { World } from "./world";

export abstract class Human implements Entity {
    public get id() { return this._id; }
    private _id: number;

    public get x() { return this._x; }
    protected _x: number;

    public get y() { return this._y; }
    protected _y: number;

    public get world(): World { return this._world; }
    protected _world: World;

    public constructor(world: World, data: HumanData) {
        this._world = world;

        this._id = data.id;
        this._x = data.x;
        this._y = data.y;
        
        this._world.addEntity(this);
    }

    public abstract update(elapsedTime: number): void;

    public abstract serialize(): HumanDataTypes;

    public destroy() {
        if (this._world.entities.includes(this)) {
            this._world?.removeEntity(this);
        }
    }
}