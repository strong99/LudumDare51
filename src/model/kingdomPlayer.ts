import { World } from "./world";
import { Interaction, Player } from "./player";
import { KingdomPlayerData, PlayerDataTypes } from "../io/dto";
import { Entity } from "./entity";

export class KingdomPlayer implements Player {
    public get id(): number { return this._id; }
    private _id: number;

    public get isDead(): boolean { return false; }

    private _world: World;

    public constructor(world: World, data?: KingdomPlayerData) {
        this._world = world;
        if (data) {
            this._id = data.id;
        }
        else {
            this._id = world.generateId();
        }
        this._world.addPlayer(this);
    }
    
    public interactions(entity: Entity): Array<Interaction> {
        throw new Error("Method not implemented.");
    }
    
    public serialize(): PlayerDataTypes {
        return {
            id: this._id,
            type: "kingdom"
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
