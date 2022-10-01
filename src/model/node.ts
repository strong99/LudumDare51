import { NodeData } from "../io/dto";
import { Entity } from "./entity";
import { JSONTypes } from "./json";
import { World } from "./world";

export class Node implements Entity {
    private _world: World;

    public constructor(world: World, data: NodeData) {
        this._world = world;

        this._world.add(this);
    }

    public update(elapsedTime: number): void {
        throw new Error("Method not implemented.");
    }
    
    public serialize(): NodeData {
        throw new Error("Method not implemented.");
    }
}