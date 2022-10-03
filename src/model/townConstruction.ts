import { ArgumentNullException } from "../exceptions/argumentNullException";
import { TownConstructionData } from "../io/dto";
import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { UnitSpawn } from "./unitSpawn";

export class TownConstruction extends NodeConstruction implements UnitSpawn {

    public get id() { return this._id; }
    private _id: number;

    public get alertness() { return this._alertness; }
    private _alertness: number = 0;
    private _alertDecreaseSpeed: number;

    public constructor(node: Node, data: TownConstructionData) {
        super();

        this._node = node;
        this._node.construct = this;
        this._id = data.id;
        this._alertDecreaseSpeed = data.alertDecreaseSpeed ?? 10000;

        const player = this._node.world.players.find(p=>p.id === data.player);
        if (!player) throw new ArgumentNullException(`Player ${data.player} not found for construct`);
        this._player = player;
    }

    public resetAlertness() {
        this._alertness = 0;
        this._alertDecreaseSpeed = Math.max(90000, this._alertDecreaseSpeed * 1.25);
    }

    public alert() {
        this._alertness++;
    }

    public hasUpgrade(type?: string): boolean {
        return false;
    }

    public canUpgrade(type?: string): boolean {
        return false;
    }

    public tryUpgrade(type?: string): boolean {
        return false;
    }

    public upgradeRequirement(type: string): [] | null {
        throw new Error("Method not implemented.");
    }
    
    public update(timeElapsed: number): void {
        this._alertness = Math.max(0, Math.min(10, this._alertness -= timeElapsed / this._alertDecreaseSpeed));
    }

    public serialize(): TownConstructionData {
        return {
            id: this._id,
            type: "town",
            level: this.level,
            player: this._player.id,
            alertDecreaseSpeed: this._alertDecreaseSpeed
        };
    }

    public destroy(): void {
        
    }
}
