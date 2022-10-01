import { speed } from "jquery";
import { PeasantData } from "../io/dto";
import { CityConstruction } from "./cityConstruction";
import { DefensiveConstruction } from "./defensiveConstruction";
import { Human } from "./human";
import { LureConstruction } from "./lureConstruction";
import { Node } from "./node";
import { NodePathfinder } from "./nodePathfinder";
import { TownConstruction } from "./townConstruction";
import { TreeConstruct } from "./treeConstruct";
import { World } from "./world";

enum PeasantTask {
    Wander,
    Socialize,
    Forage,
    Alert
}

/**
 * Peasants like to wander of into the woods, in search of food and what not
 */
export class Peasant extends Human {
    private _path?: Array<Node>;
    private _task: PeasantTask = PeasantTask.Wander;
    private _pathfinder = new NodePathfinder();

    public constructor(world: World, data: PeasantData) {
        super(world, data);
    }

    public update(elapsedTime: number): void {
        if (!this._path || this._path.length === 0) {
            delete this._path;

            const nearestNode = this._world.getNearestNode(this.x, this.y);

            if (this._task === PeasantTask.Wander) {
                this._task = PeasantTask.Socialize;
            }
            else if (this._task === PeasantTask.Socialize) {
                this._task = PeasantTask.Forage;
            }
            else if (this._task === PeasantTask.Forage) {
                this._task = PeasantTask.Socialize;
            }

            let task: (n: Node) => boolean;
            if (this._task === PeasantTask.Forage) {
                task = (n) => nearestNode !== n && (n.construct instanceof LureConstruction || n.construct instanceof TreeConstruct);
            }
            else if (this._task === PeasantTask.Socialize ||
                     this._task === PeasantTask.Alert) {
                task = (n) => nearestNode !== n && (n.construct instanceof CityConstruction || n.construct instanceof TownConstruction);
            }
            else {
                // find node atleast x amount away
                const minDistance = 501;
                const maxDistance = 1250;
                task = (n) => {
                    const dx = nearestNode.x - n.x;
                    const dy = (nearestNode.y - n.y) * 2;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    return (distance > minDistance && distance < maxDistance);
                };
            }

            const path = this._pathfinder.find(nearestNode, (c, n, s) => 500 * Math.random(), task);

            if (path) {
                this._path = path;
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

                if (harvestable) {
                    (next.construct as LureConstruction).tryPick();
                }
                else if (this._task == PeasantTask.Alert && (next.construct instanceof CityConstruction || next.construct instanceof TownConstruction)) {
                    this._task = PeasantTask.Wander;
                }
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

    public alert() {
        this._task = PeasantTask.Alert;
        delete this._path;
    }

    public serialize(): PeasantData {
        return {
            type: "peasant",
            id: this.id,
            x: this._x,
            y: this._y
        };
    }
}