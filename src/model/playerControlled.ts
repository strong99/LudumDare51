import { DigestivePod } from "./digestivePod";
import { NodeConstruction } from "./nodeConstruction";
import { Player } from "./player";

export abstract class PlayerControlled extends NodeConstruction {
    public get level() { return this._level; }
    protected _level = 1;

    public get player() { return this._player; } 
    protected _player!: Player;

    public get pods() { return this._pods; }
    protected _pods = new Array<DigestivePod>();

    public abstract canUpgrade(type: string): boolean;
    public abstract tryUpgrade(type: string): boolean;
    public abstract upgradeRequirement(type: string): []|null;
}