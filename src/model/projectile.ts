import { EntityDataTypes, ProjectileData } from "../io/dto";
import { Entity } from "./entity";
import { Human } from "./human";
import { World } from "./world";

export class Projectile implements Entity {
    public get id() { return this._id; }
    private _id: number = 0;

    public get world() { return this._world; }
    private _world: World;

    public get x() { return this._x; }
    private _x: number;

    public get y() { return this._y; }
    private _y: number;

    private _toX: number;
    private _toY: number;

    public constructor(world: World, data: ProjectileData) {
        this._world = world;

        this._id = data.id;
        this._x = data.x;
        this._y = data.y;
        this._toX = data.toX;
        this._toY = data.toY;
        this._world.addEntity(this);
    }

    public update(elapsedTime: number): void {
        const dx = this._toX - this._x;
        const dy = this._toY - this._y;
        const l = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / l;
        const ny = dy / l;
        const speed = 0.5;
        this._x += nx * elapsedTime * speed;
        this._y += ny * elapsedTime * speed;
        if (l < 10) {
            
            for(const e of this.world.entities) {
                if (e instanceof Human) {
                    const dx = this.x - e.x;
                    const dy = this.y - e.y * 1.6;
                    const l = Math.sqrt(dx * dx + dy * dy);
                    if (l < 64) {
                        e.destroy();
                    }
                }
            }

            this.destroy();
        }
    }

    public serialize(): EntityDataTypes {
        return {
            id: this._id,
            type: "projectile",
            x: this._x,
            y: this._y,
            toX: this._toX,
            toY: this._toY
        };
    }

    public get destroyed(){ return this._destroyed; }
    private _destroyed = false;

    public destroy() {
        this._destroyed = true;
        if (this._world.entities.includes(this)) {
            this._world.removeEntity(this);
        }
    }
}