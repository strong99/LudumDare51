import { HeroData } from "../io/dto";
import { Human } from "./human";
import { World } from "./world";

export class Hero extends Human {
    public constructor(world: World, data: HeroData) {
        super(world, data);
    }

    public update(elapsedTime: number): void {
        
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