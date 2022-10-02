import { CityConstructionData } from "../io/dto";
import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { UnitSpawn } from "./unitSpawn";

export class CityConstruction extends NodeConstruction implements UnitSpawn {
    public get node() { return this._node; }
    private _node: Node;

    public get id() { return this._id; }
    private _id: number;

    public get alertness() { return this._alertness / 10; }
    private _alertness: number = 0;

    public constructor(node: Node, data: CityConstructionData) {
        super();

        this._node = node;
        this._node.construct = this;
        this._id = data.id;

        const player = this._node.world.players.find(p=>p.id === data.player);
        if (!player) throw new Error(`Player ${data.player} not found for construct`);
        this._player = player;
    }

    public alert() {
        this._alertness++;
    }

    public canUpgrade(type: string): boolean {
        return false;
    }

    public tryUpgrade(type: string): boolean {
        return false;
    }

    public upgradeRequirement(type: string): [] | null {
        throw new Error("Method not implemented.");
    }
    
    public update(timeElapsed: number): void {
        this._alertness = Math.max(0, Math.min(10, this._alertness -= timeElapsed / 1000));
    }

    public serialize(): CityConstructionData {
        return {
            id: this._id,
            type: "city",
            level: this.level,
            player: this._player.id
        };
    }

    public destroy(): void {
        
    }
}
