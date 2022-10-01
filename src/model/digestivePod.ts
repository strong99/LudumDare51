import { DigestivePodData } from "../io/dto";
import { Entity } from "./entity";
import { World } from "./world";

export class DigestivePod implements Entity {
    public get id() { return this._id; }
    private _id: number;

    public constructor(world: World, data: DigestivePodData) {
        throw new Error();
    }

    public update(elapsedTime: number): void {
        throw new Error("Method not implemented.");
    }
    
    public serialize(): DigestivePodData {
        throw new Error("Method not implemented.");
    }
}