import { NodeData } from "../io/dto";
import { Entity } from "./entity";
import { NodeConstruction } from "./nodeConstruction";
import * as NodeConstructionFactory from "./nodeConstructionFactory";
import { OnAddEntityCallback, World } from "./world";

export class Node implements Entity {
    public get id() { return this._id; } 
    private _id: number = 0;

    public get world() { return this._world; }
    private _world: World;

    public get neighbours(): ReadonlyArray<Node> { return this._neighbours; }
    private _neighbours = Array<Node>();

    public get x() { return this._x; }
    private _x: number;

    public get y() { return this._y; }
    private _y: number;

    public get construct() { return this._construct; }
    public set construct(value) { this._construct?.destroy(); this._construct = value; }
    private _construct?: NodeConstruction;

    public constructor(world: World, data: NodeData);
    public constructor(world: World, x: number, b: number);
    public constructor(world: World, a: NodeData|number, b?: number) {
        this._world = world;

        if (a && typeof a == 'object') {
            const data = a;
            this._id = data.id;
            this._x = data.x;
            this._y = data.y;
            if (data.construction) {
                NodeConstructionFactory.TryCreate(this, data.construction);
            }

            const waitingOnNeighbours = [...data.neighbours];
            const listenForNeighbours: OnAddEntityCallback = (e) => {
                // Find neighbouring nodes
                if (waitingOnNeighbours.includes(e.id) && e instanceof Node) {
                    waitingOnNeighbours.splice(waitingOnNeighbours.indexOf(e.id), 1);
                    this._neighbours.push(e);
                }

                if (waitingOnNeighbours.length == 0) {
                    this._world.onRemoveEntity(listenForNeighbours);
                }
            };
            this._world.onAddEntity(listenForNeighbours);
        }
        else {
            if (typeof b !== 'number') {
                throw new Error("X and Y coordinates are both required");
            }
            this._id = world.generateId();
            this._x = a;
            this._y = b;
        }
        this._world.add(this);
    }

    public update(elapsedTime: number): void {
        throw new Error("Method not implemented.");
    }
    
    public serialize(): NodeData {
        return {
            id: this.id,
            type: "node",
            neighbours: this._neighbours.map(n=>n.id),
            construction: this.construct?.serialize(),
            x: this.x,
            y: this.y
        };
    }
}