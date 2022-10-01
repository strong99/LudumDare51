import { PlayerData } from "../io/dto";
import { Entity } from "./entity";
import { World } from "./world";

export class Player implements Entity {
    public constructor(world: World, data: PlayerData) {

    }

    public update(elapsedTime: number): void {
        throw new Error("Method not implemented.");
    }

    public serialize(): PlayerData {
        throw new Error("Method not implemented.");
    }
}