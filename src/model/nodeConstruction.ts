import { NodeConstructionDataTypes } from "../io/dto";
import { DigestivePod } from "./digestivePod";
import { Player } from "./player";

export abstract class NodeConstruction {
    public get level() { return this._level; }
    protected _level = 1;

    public get player() { return this._player; } 
    protected _player!: Player;

    public get pods() { return this._pods; }
    protected _pods = new Array<DigestivePod>();

    public abstract canUpgrade(type: string): boolean;
    public abstract tryUpgrade(type: string): boolean;
    public abstract upgradeRequirement(type: string): []|null;

    public abstract update(timeElapsed: number): void;

    readonly abstract id: number;
    public abstract serialize(): NodeConstructionDataTypes;
    public abstract destroy(): void;
}