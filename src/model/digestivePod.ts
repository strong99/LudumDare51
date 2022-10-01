import { DigestivePodData } from "../io/dto";
import { Node } from "./node";

export class DigestivePod {
    public get id() { return this._id; }
    private _id: number;

    public get x() { return this._x; }
    private _x: number = 0;

    public get y() { return this._y; }
    private _y: number = 0;

    public get age() { return this._age; }
    private _age: number = 0;

    public constructor(node: Node, data?: DigestivePodData) {
        if (data) {
            this._id = data.id;
            this._x = data.x;
            this._y = data.y;
            this._age = data.age;
        }
        else {
            this._id = node.world.generateId();
        }
        throw new Error();
    }

    public update(elapsedTime: number): void {
        throw new Error("Method not implemented.");
    }

    public serialize(): DigestivePodData {
        return {
            id: this.id,
            age: this.age,
            x: this.x,
            y: this.y
        };
    }
}