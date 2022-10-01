import { EntityData } from "../io/dto";

export interface Entity {
    update(elapsedTime: number): void;
    serialize(): EntityData;
}
