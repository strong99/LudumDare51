import { NodeConstructionData } from "../io/dto";

export abstract class NodeConstruction {
    public abstract serialize(): NodeConstructionData;
}