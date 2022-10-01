import { NodeConstructionData } from "../io/dto";
import { NodeConstruction } from "./nodeConstruction";

export class PlayerControlled extends NodeConstruction {
    public serialize(): NodeConstructionData {
        throw new Error("Method not implemented.");
    }
}