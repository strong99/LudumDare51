import { NodeConstructionDataTypes } from "../io/dto";

export abstract class NodeConstruction {
    public abstract serialize(): NodeConstructionDataTypes;
    public abstract destroy(): void;
}