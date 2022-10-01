import { NodeConstructionData } from "../io/dto";
import { DigestivePod } from "./digestivePod";
import { NodeConstruction } from "./nodeConstruction";

export abstract class PlayerControlled extends NodeConstruction {
    public get pods() { return this._pods; }
    private _pods = new Array<DigestivePod>();
}