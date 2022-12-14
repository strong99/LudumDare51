import { NodeConstructionDataTypes } from "../io/dto";
import { DigestivePod } from "./digestivePod";
import { Node } from "./node";
import { Player } from "./player";

export abstract class NodeConstruction {
    public get node(): Node { return this._node; }
    protected _node!: Node;

    public get level() { return this._level; }
    protected _level = 1;

    public get player() { return this._player; } 
    protected _player!: Player;

    public abstract hasUpgrade(type?: string): boolean;
    public abstract canUpgrade(type?: string): boolean;
    public abstract tryUpgrade(type?: string): boolean;
    public abstract upgradeRequirement(type?: string): []|null;

    public abstract update(timeElapsed: number): void;

    readonly abstract id: number;
    public abstract serialize(): NodeConstructionDataTypes;
    public abstract destroy(): void;
}