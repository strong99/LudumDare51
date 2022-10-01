import { PeasantData } from "../io/dto";
import { Human } from "./human";
import { World } from "./world";

export class Peasant extends Human {
    public constructor(world: World, data: PeasantData) {
        super(world, data);
    }

    public update(elapsedTime: number): void {
        
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