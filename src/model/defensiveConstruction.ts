import { DefensiveConstructionData } from "../io/dto";
import { Node } from "./node";
import { PlayerControlled } from "./playerControlled";

export class DefensiveConstruction extends PlayerControlled {
    
    private _node: Node;

    public get id() { return this._id; }
    private _id: number;

    public constructor(node: Node, data: DefensiveConstructionData) {
        super();

        this._node = node;
        this._id = data.id;
        
        const player = this._node.world.players.find(p=>p.id === data.player);
        if (!player) throw new Error(`Player ${data.player} not found for construct`);
        this._player = player;
    }

    public canUpgrade(type: string): boolean {
        return (this.level < 3);
    }

    public tryUpgrade(type: string): boolean {
        if (!this.canUpgrade(type))
            return false;

        if (this.level < 3) {
            this._level++;
        }
        else throw new Error("Unable to upgrade even though canUpgrade was positive");

        return true;
    }

    public upgradeRequirement(type: string): [] | null {
        throw new Error("Method not implemented.");
    }

    public serialize(): DefensiveConstructionData {
        return {
            id: this._id,
            type: "defensive",
            level: this.level,
            pods: [],
            player: this._player.id
        };
    }

    public destroy(): void {
        throw new Error("Method not implemented.");
    }   
}
