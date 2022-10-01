import { NodeData } from "../io/dto";
import { Entity } from "./entity";
import { JSONTypes } from "./json";
import { World } from "./world";

export class Node implements Entity {
    public constructor(world: World, data: NodeData) {

    }

    public update(elapsedTime: number): void {
        throw new Error("Method not implemented.");
    }
    
    public serialize(): NodeData {
        throw new Error("Method not implemented.");
    }
}