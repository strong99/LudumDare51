import { PlayerDataTypes } from "../io/dto";
import { Entity } from "./entity";

export interface Interaction {
    id: string;
    can(): void;
    requirements(): void;
    do(): void;
}

export interface Player {
    readonly id: number;
    
    readonly isDead: boolean;
    
    update(elapsedTime: number): void;
    destroy(): void;
    serialize(): PlayerDataTypes;

    interactions(entity: Entity): Array<Interaction>;
}
