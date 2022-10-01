import { HumanData } from "../io/dto";
import { Entity } from "./entity";
import { World } from "./world";

export class Human implements Entity {
    public get id() { return this._id; }
    private _id: number;

    public constructor(world: World, data: HumanData) {
        throw new Error();
    }

    public update(elapsedTime: number): void {
        throw new Error("Method not implemented.");
    }

    public serialize(): HumanData {
        throw new Error("Method not implemented.");
    }
}