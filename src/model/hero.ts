import { HeroData } from "../io/dto";
import { CityConstruction } from "./cityConstruction";
import { Human } from "./human";
import { LureConstruction } from "./lureConstruction";
import { Node } from "./node";
import { NodePathfinder } from "./nodePathfinder";
import { TownConstruction } from "./townConstruction";
import { TreeConstruct } from "./treeConstruct";
import { TreePlayer } from "./treePlayer";
import { World } from "./world";

enum HeroTask {
    None,
    Find,
    Attack,
    Retreat
}

export class Hero extends Human {
    private _path?: Array<Node>;
    private _task: HeroTask = HeroTask.None;
    private _pathfinder = new NodePathfinder();

    public constructor(world: World, data: HeroData) {
        super(world, data);
    }

    public update(elapsedTime: number): void {
        if (!this._path || this._path.length === 0) {
            delete this._path;

            const nearestNode = this._world.getNearestNode(this.x, this.y);

            if (this._task === HeroTask.None) {
                this._task = HeroTask.Find;
            }
            else if (this._task === HeroTask.Find) {
                if (nearestNode.construct?.player instanceof TreePlayer) {
                    this._task = HeroTask.Attack;
                }
            }
            else if (this._task === HeroTask.Attack) {
                if (!nearestNode.construct?.player || nearestNode.construct?.player instanceof TreePlayer === false) {
                    this._task = HeroTask.Find;
                }
            }
            else if (this._task === HeroTask.Retreat) {

            }

            let task: ((n: Node) => boolean)|null = null;
            if (this._task === HeroTask.Find) {
                task = (n) => nearestNode !== n && (n.construct?.player instanceof TreePlayer);
            }
            else if (this._task === HeroTask.Retreat) {
                task = (n) => nearestNode !== n && (n.construct instanceof CityConstruction || n.construct instanceof TownConstruction);
            }

            if (task) {
                const path = this._pathfinder.find(nearestNode, (c, n, s) => 500 * Math.random(), task);
                if (path) {
                    this._path = path;
                }
            }
        }

        // move towards path
        if (this._path) {
            const next = this._path[0];

            const harvestable = (next.construct instanceof TreeConstruct || next.construct instanceof LureConstruction) && next.construct.fruits > 0;
            if (harvestable) {
                this._path.length = 1;
            }

            const dx = next.x - this.x;
            const dy = (next.y - this.y) * 2;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If peasant comes close to a sub-node continue to the next
            if ((this._path.length > 1 && distance < 128) ||
                distance < 32) {
                this._path.shift();
            }
            else {
                const speed = 0.1;
                const nx = dx / distance;
                const ny = dy / distance;
                this._x += nx * elapsedTime * speed;
                this._y += ny * elapsedTime * speed;
            }
        }
    }

    public serialize(): HeroData {
        return {
            type: "hero",
            id: this.id,
            x: this._x,
            y: this._y
        };
    }
}