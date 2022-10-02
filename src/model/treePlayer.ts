import { World } from "./world";
import { Interaction, Player } from "./player";
import { PlayerDataTypes, TreePlayerData } from "../io/dto";
import { Entity } from "./entity";
import { Node } from "./node";
import { TreeConstruct } from "./treeConstruct";
import { NodePathfinder } from "./nodePathfinder";
import { LureConstruction } from "./lureConstruction";
import { DefensiveConstruction } from "./defensiveConstruction";
import { OffensiveConstruction } from "./offensiveConstruction";
import { Peasant } from "./peasant";
import { DigestivePod } from "./digestivePod";

export class TreePlayer implements Player {
    public get id(): number { return this._id; }
    private _id: number;

    public get isDead(): boolean { return false; }

    private _buildpoints = 3;

    public get world(): World { return this._world; }
    private _world: World;

    private _pathfinder = new NodePathfinder();

    public constructor(world: World, data: TreePlayerData) {
        this._world = world;
        this._id = data.id;
        this._world.addPlayer(this);
    }

    public canUpgradeNode(node: Node, type: "lure" | "defensive" | "offensive"): boolean {
        const notExists = (
            !node.construct ||
            node.construct.canUpgrade(type)
        );

        const isConnected = this._pathfinder.can(
            node,
            (c, n, v) => n.construct?.player === this ? 1 : null,
            p => p.construct instanceof TreeConstruct && p.construct.player === this
        );

        if (!isConnected && notExists) {
            return false;
        }

        return true;
    }

    public tryUpgradeNode(node: Node, type: "lure" | "defensive" | "offensive"): boolean {
        if (!this.canUpgradeNode(node, type)) {
            return false;
        }

        if (!node.construct && type === 'lure') {
            node.construct = new LureConstruction(node, {
                type: "lure",
                id: node.world.generateId(),
                level: 1,
                player: this.id
            });
        }
        else if (node.construct) {
            node.construct.tryUpgrade(type);
        }
        else {
            node.construct = (type === "defensive" ?
                new DefensiveConstruction(node, {
                    type: "defensive",
                    id: node.world.generateId(),
                    level: 1,
                    player: this.id
                }) :
                new OffensiveConstruction(node, {
                    type: "offensive",
                    id: node.world.generateId(),
                    level: 1,
                    player: this.id
                })
            );
        }
        return true;
    }

    public upgradeNodeRequirements(node: Node, type: "lure" | "defensive" | "offensive"): [] {
        throw new Error("Not yet implemented");
    }

    public canActiveTrap(node: Node) {
        const peasants = this._world.entities.filter(e => e instanceof Peasant) as Peasant[];
        const trapRange = 64;

        if (node.construct instanceof LureConstruction === false) {
            return false;
        }

        for (const p of peasants) {
            const dx = p.x - node.x;
            const dy = (p.y - node.y) * 2;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < trapRange) return true;
        }

        return false;
    }

    public tryActiveTrap(node: Node) {
        const peasants = this._world.entities.filter(e => e instanceof Peasant) as Peasant[];
        // near
        const withinTrapRange = new Array<Peasant>();
        const withinAlertRange = new Array<Peasant>();

        if (node.construct instanceof LureConstruction === false) {
            return false;
        }

        const trapRange = 64;
        const alertRange = 128;

        for (const p of peasants) {
            const dx = p.x - node.x;
            const dy = (p.y - node.y) * 2;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < alertRange) withinAlertRange.push(p);
            if (distance < trapRange) withinTrapRange.push(p);
        }

        const toBeTrapped = withinAlertRange[Math.floor(withinTrapRange.length * Math.random())];
        for (const t of withinAlertRange) {
            if (t === toBeTrapped) {
                continue;
            }
            t.alert();
        }
        toBeTrapped.destroy();

        if (node.construct instanceof LureConstruction) {
            new DigestivePod(node.world, {
                type: "digestivePod",
                age: 0,
                id: this._world.generateId(),
                x: Math.random() * 128 + node.x,
                y: Math.random() * 64 + 25 + node.y,
            });
        }
        return true;
    }

    public activateTrapRequirements(node: Node): [] {
        return [];
    }

    public interactions(entity: Entity): Array<Interaction> {
        const items = new Array<Interaction>();
        if (entity instanceof Node) {
            if (entity.construct instanceof LureConstruction) {
                items.push({
                    id: "activateTrap",
                    can: () => this.canActiveTrap(entity),
                    do: () => this.tryActiveTrap(entity),
                    requirements: () => this.activateTrapRequirements(entity),
                });
            }
            if (!entity.construct) {
                items.push(...[
                    {
                        id: "constructLure",
                        can: () => this.canUpgradeNode(entity, "lure"),
                        do: () => this.tryUpgradeNode(entity, "lure"),
                        requirements: () => this.upgradeNodeRequirements(entity, "lure"),
                    },
                    {
                        id: "constructDefensive",
                        can: () => this.canUpgradeNode(entity, "defensive"),
                        do: () => this.tryUpgradeNode(entity, "defensive"),
                        requirements: () => this.upgradeNodeRequirements(entity, "defensive"),
                    },
                    {
                        id: "constructOffensive",
                        can: () => this.canUpgradeNode(entity, "offensive"),
                        do: () => this.tryUpgradeNode(entity, "offensive"),
                        requirements: () => this.upgradeNodeRequirements(entity, "offensive"),
                    }
                ]);
            }
            else if (entity.construct instanceof TreeConstruct === false) {
                items.push(...[
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
                ]);
            }
            return items;
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
