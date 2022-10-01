import { HumanData } from "../io/dto";
import { Entity } from "./entity";
import { World } from "./world";

export class Human implements Entity {
    public constructor(world: World, data: HumanData) {

    }

    public update(elapsedTime: number): void {
        throw new Error("Method not implemented.");
    }

    public serialize(): HumanData {
        throw new Error("Method not implemented.");
    }
}