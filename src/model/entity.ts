import { EntityDataTypes } from "../io/dto";

export interface Entity {
    readonly id: number;
    update(elapsedTime: number): void;
    serialize(): EntityDataTypes;
}
