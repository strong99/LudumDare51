import { AgentDataTypes } from "../io/dto";

export interface Agent {
    update(elapsedTime: number): void;
    serialize(): AgentDataTypes;
    destroy(): void;
}