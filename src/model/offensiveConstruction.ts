import { TreeConstructionData } from "../io/dto";
import { Node } from "./node";
import { Player } from "./player";
import { PlayerControlled } from "./playerControlled";

export class OffensiveConstruction extends PlayerControlled {
    public constructor(node: Node, player: Player) {
        super();
    }

    public canUpgrade(type: string): boolean {
        throw new Error("Method not implemented.");
    }

    public tryUpgrade(type: string): boolean {
        throw new Error("Method not implemented.");
    }

    public upgradeRequirement(type: string): [] | null {
        throw new Error("Method not implemented.");
    }

    public serialize(): TreeConstructionData {
        throw new Error("Method not implemented.");
    }

    public destroy(): void {
        throw new Error("Method not implemented.");
    }   
}
