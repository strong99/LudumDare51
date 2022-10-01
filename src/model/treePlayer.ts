import { World } from "./world";
import { Interaction, Player } from "./player";
import { PlayerDataTypes, TreePlayerData } from "../io/dto";
import { Entity } from "./entity";
import { Node } from "./node";
import { PlayerControlled } from "./playerControlled";
import { TreeConstruct } from "./treeConstruct";
import { NodePathfinder } from "./nodePathfinder";

export class TreePlayer implements Player {
    public get id(): number { return this._id; }
    private _id: number;

    public get isDead(): boolean { return false; }

    private _buildpoints = 3;
    private _world: World;
    private _pathfinder = new NodePathfinder();

    public constructor(world: World, data: TreePlayerData) {
        this._world = world;
        this._id = data.id;
        this._world.addPlayer(this);
    }

    public canUpgradeNode(node: Node, type: "lure"|"defensive"|"offensive"): boolean {
        if (node.construct == null || 
            node.construct instanceof PlayerControlled == false ||
            (node.construct as PlayerControlled).player !== this) {
            return false;
        }

        const isConnected = this._pathfinder.can(
            node,
            p => p.construct instanceof PlayerControlled && p.construct.player === this ? 1 : null,
            p => p.construct instanceof TreeConstruct && p.construct.player === this
        );

        if (!isConnected) {
            return false;
        }

        throw new Error("Not yet implemented");
    }
    
    public tryUpgradeNode(node: Node, type: "lure"|"defensive"|"offensive"): boolean {
        if (!this.canUpgradeNode(node, type)) {
            return false;
        }

        throw new Error("Not yet implemented");
    }
    
    public upgradeNodeRequirements(node: Node, type: "lure"|"defensive"|"offensive"): boolean {
        throw new Error("Not yet implemented");
    }

    public canActiveTrap(node: Node) {
        return false;
    }

    public tryActiveTrap(node: Node) {
        return false;
    }

    public activateTrapRequirements(node: Node) {
        return [];
    }
    
    public interactions(entity: Entity): Array<Interaction> {
        if (entity instanceof Node) {
            return [
                {
                    id: "activateTrap",
                    can: () => this.canActiveTrap(entity),
                    do: () => this.tryActiveTrap(entity),
                    requirements: () => this.activateTrapRequirements(entity),
                },
                {
                    id: "upgradeLure",
                    can: () => this.canUpgradeNode(entity, "lure"),
                    do: () => this.tryUpgradeNode(entity, "lure"),
                    requirements: () => this.upgradeNodeRequirements(entity, "lure"),
                },
                {
                    id: "upgradeDefensive",
                    can: () => this.canUpgradeNode(entity, "defensive"),
                    do: () => this.tryUpgradeNode(entity, "defensive"),
                    requirements: () => this.upgradeNodeRequirements(entity, "defensive"),
                },
                {
                    id: "upgradeOffensive",
                    can: () => this.canUpgradeNode(entity, "offensive"),
                    do: () => this.tryUpgradeNode(entity, "offensive"),
                    requirements: () => this.upgradeNodeRequirements(entity, "offensive"),
                }
            ];
        }
        throw new Error("Not implemented yet");
    }
    
    public serialize(): PlayerDataTypes {
        return {
            id: this._id,
            type: "tree",
            buildPoints: this._buildpoints,
        };
    }

    public update(elapsedTime: number): void {

    }

    public destroy(): void {
        if (this._world.players.includes(this)) {
            this._world.removePlayer(this);
        }
    }
}
