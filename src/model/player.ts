import { PlayerDataTypes } from "../io/dto";
import { Entity } from "./entity";
import { World } from "./world";

export interface Interaction {
    id: string;
    can(): boolean;
    requirements(): [];
    do(): boolean;
}

export interface Player {
    readonly id: number;
    readonly world: World;
    
    readonly isDead: boolean;
    
    update(elapsedTime: number): void;
    destroy(): void;
    serialize(): PlayerDataTypes;

    interactions(entity: Entity): Array<Interaction>;
}
