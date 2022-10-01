import { WarriorData } from "../io/dto";
import { Human } from "./human";
import { World } from "./world";

export class Warrior extends Human {
    public constructor(world: World, data: WarriorData) {
        super(world, data);
    }

    public update(elapsedTime: number): void {
        
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