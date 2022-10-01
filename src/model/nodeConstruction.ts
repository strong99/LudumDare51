import { NodeConstructionDataTypes } from "../io/dto";

export abstract class NodeConstruction {
    readonly abstract id: number;
    public abstract serialize(): NodeConstructionDataTypes;
    public abstract destroy(): void;
}