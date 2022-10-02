import { DigestivePodData } from "../io/dto";
import { Entity } from "./entity";
import { Node } from "./node";
import { World } from "./world";

export class DigestivePod implements Entity {
    public get id() { return this._id; }
    private _id: number;

    public get x() { return this._x; }
    private _x: number = 0;

    public get y() { return this._y; }
    private _y: number = 0;

    public get age() { return this._age; }
    private _age: number = 0;

    public get world() { return this._world; }
    private _world: World;

    public constructor(world: World, data: DigestivePodData) {
        this._world = world;

        this._id = data.id;
        this._x = data.x;
        this._y = data.y;
        this._age = data.age;

        this._world.addEntity(this);
    }

    public update(elapsedTime: number): void {
        this._age += elapsedTime;
    }

    public serialize(): DigestivePodData {
        return {
            type: "digestivePod",
            id: this.id,
            age: this.age,
            x: this.x,
            y: this.y
        };
    }

    public destroy() {
        if (this._world.entities.includes(this)) {
            this._world.removeEntity(this);
        }
    }
}