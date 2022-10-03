import { ArgumentNullException } from "../exceptions/argumentNullException";
import { OffensiveConstructionData } from "../io/dto";
import { Hero } from "./hero";
import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { Peasant } from "./peasant";
import { Projectile } from "./projectile";
import { TreePlayer } from "./treePlayer";
import { Warrior } from "./warrior";

export class OffensiveConstruction extends NodeConstruction {

    public get id() { return this._id; }
    private _id: number;

    public constructor(node: Node, data: OffensiveConstructionData) {
        super();

        this._node = node;
        this._node.construct = this;
        this._id = data.id;

        const player = this._node.world.players.find(p=>p.id === data.player);
        if (!player) throw new ArgumentNullException(`Player ${data.player} not found for construct`);
        this._player = player;
    }

    public hasUpgrade(type?: string): boolean {
        return (this.level < 3);
    }

    public canUpgrade(type?: string): boolean {
        return this.hasUpgrade(type) && (this._player as TreePlayer).buildPoints > 0;
    }

    public tryUpgrade(type: string): boolean {
        if (!this.canUpgrade(type))
            return false;

        (this._player as TreePlayer).buildPoints--;

        if (this.level < 3) {
            this._level++;
        }
        else throw new Error("Unable to upgrade even though canUpgrade was positive");

        return true;
    }

    public upgradeRequirement(type: string): [] | null {
        throw new Error("Method not implemented.");
    }
    
    private _fireInterval = 2500;
    private _lvlRange = 200;
    private _baseRange = 500;
    public update(timeElapsed: number): void {
        // find threats
        this._fireInterval -= timeElapsed;
        if (this._fireInterval < 0) {
            let nearest: Warrior|Hero|Peasant|null = null;
            let nearestDistance = Number.MAX_SAFE_INTEGER;
            const range = this._lvlRange * this._level + this._baseRange;
            for(const e of this._node.world.entities) {
                if (e instanceof Warrior || e instanceof Hero || e instanceof Peasant) {
                    const dx = e.x - this.node.x;
                    const dy = e.y - this.node.y;
                    const l = Math.sqrt(dx*dx+dy*dy);
                    if (l < range &&(nearestDistance > l || !nearest)) {
                        nearest = e;
                        nearestDistance = l;
                    }
                }
            }
            if (nearest) {
                this._fireInterval = 2500;
                new Projectile(this.node.world, {
                    type: "projectile",
                    id: this.node.world.generateId(),
                    x: this.node.x,
                    y: this.node.y - 100,
                    toX: nearest.x,
                    toY: nearest.y
                });
            }
            else {
                this._fireInterval = 100;
            }
        }
    }

    public serialize(): OffensiveConstructionData {
        return {
            id: this._id,
            type: "offensive",
            level: this.level,
            player: this._player.id
        };
    }

    public destroy(): void {
        
    }  
}
