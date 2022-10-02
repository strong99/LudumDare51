import { Node } from "./node";

export interface UnitSpawn {
    readonly node: Node;
    resetAlertness(): void;
}
