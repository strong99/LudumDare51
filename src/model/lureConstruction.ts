import { LureConstructionData, TreeConstructionData } from "../io/dto";
import { DefensiveConstruction } from "./defensiveConstruction";
import { Node } from "./node";
import { OffensiveConstruction } from "./offensiveConstruction";
import { Player } from "./player";
import { PlayerControlled } from "./playerControlled";

export class LureConstruction extends PlayerControlled {
    private _node: Node;

    public get id() { return this._id; }
    private _id: number;

    public constructor(node: Node, data: LureConstructionData) {
        super();

        this._node = node;
        this._id = data.id;

        const player = this._node.world.players.find(p=>p.id === data.player);
        if (!player) throw new Error(`Player ${data.player} not found for construct`);
        this._player = player;
    }

    public canUpgrade(type: string): boolean {
        return (this.level < 3) || type === "defensive" || type === "offensive";
    }

    public tryUpgrade(type: string): boolean {
        if (!this.canUpgrade(type))
            return false;

        if (this.level < 3) {
            this._level++;
        }
        else if (type === "defensive" || type === "offensive") {
            this._node.construct = (type === "defensive" ?
                new DefensiveConstruction(this._node, {
                    type: "defensive",
                    id: this._node.world.generateId(),
                    level: 1,
                    pods: [],
                    player: this.player.id
                }) :
                new OffensiveConstruction(this._node, {
                    type: "offensive",
                    id: this._node.world.generateId(),
                    level: 1,
                    pods: [],
                    player: this.player.id
                })
            );
        }
        else throw new Error("Unable to upgrade even though canUpgrade was positive");

        return true;
    }

    public upgradeRequirement(type: string): [] | null {
        throw new Error("Method not implemented.");
    }

    public serialize(): LureConstructionData {
        return {
            id: this._id,
            type: "lure",
            level: this.level,
            pods: [],
            player: this._player.id
        };
    }

    public destroy(): void {
        
    }
}