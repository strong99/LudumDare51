import { CityConstruction } from "./cityConstruction";
import { Human } from "./human";
import { Node } from "./node";
import { NodePathfinder } from "./nodePathfinder";
import { TownConstruction } from "./townConstruction";
import { TreeConstruct } from "./treeConstruct";
import { TreePlayer } from "./treePlayer";
import { WarriorData } from "../io/dto";
import { World } from "./world";

enum WarriorTask {
    None,
    Find,
    Attack,
    Retreat
}

function calcDistance(a: { x: number, y: number }, b: { x: number, y: number }) {
    const dx = a.x - b.x;
    const dy = (a.y - b.y) * 1.8;
    return Math.sqrt(dx * dx + dy * dy);
}

export class Warrior extends Human {
    private _path?: Array<Node>;
    private _task: WarriorTask = WarriorTask.None;
    private _pathfinder = new NodePathfinder();

    public constructor(world: World, data: WarriorData) {
        super(world, data);
    }

    private _attackTimer = 7500;
    public update(elapsedTime: number): void {
        if (!this._path || this._path.length === 0) {
            delete this._path;

            const nearestNode = this._world.getNearestNode(this.x, this.y);

            if (this._task === WarriorTask.None) {
                this._task = WarriorTask.Find;
            }
            else if (this._task === WarriorTask.Find) {
                if (nearestNode.construct?.player instanceof TreePlayer) {
                    this._task = WarriorTask.Attack;
                }
            }
            else if (this._task === WarriorTask.Attack) {
                if (!nearestNode.construct?.player || nearestNode.construct?.player instanceof TreePlayer === false) {
                    this._task = WarriorTask.Find;
                }
                else {
                    this._attackTimer -= elapsedTime;

                    if (this._attackTimer < 0) {
                        if (nearestNode.construct instanceof TreeConstruct && nearestNode.construct.fruits > 0) {
                            nearestNode.construct.tryPick();
                        }
                        else if (nearestNode.construct) {
                            nearestNode.construct = undefined;
                        }
                        this._attackTimer += 7500;
                    }
                }
            }
            else if (this._task === WarriorTask.Retreat) {

            }

            let task: ((n: Node) => boolean)|null = null;
            if (this._task === WarriorTask.Find) {
                task = (n) => nearestNode !== n && (n.construct?.player instanceof TreePlayer);
            }
            else if (this._task === WarriorTask.Retreat) {
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

            const attackInterest = (
                next.construct?.player instanceof TreePlayer ||
                next.world.digistivePods.some(p => calcDistance(p, next) < 64));
            if (attackInterest) {
                this._task = WarriorTask.Attack;
                this._path.length = 1;
            }

            const dx = next.x - this.x;
            const dy = (next.y - this.y) * 2;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If peasant comes close to a sub-node continue to the next
            if ((this._path.length > 1 && distance < 64) ||
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

    public serialize(): WarriorData {
        return {
            type: "warrior",
            id: this.id,
            x: this._x,
            y: this._y
        };
    }
}