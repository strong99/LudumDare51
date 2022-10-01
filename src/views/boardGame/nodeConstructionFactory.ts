import { Node } from "./node";
import { NodeConstruction as NodeConstructionModel } from "../../model/nodeConstruction";
import { NodeConstruction } from "./nodeConstruction";
import { Player as PlayerModel } from "../../model/player";
import { Player } from "./player";

export function TryCreate(node: Node, nodeConstruction: NodeConstructionModel): NodeConstruction {
    if (nodeConstruction instanceof PlayerModel) {
        return new Player(node, nodeConstruction);
    }
    else {
        throw new Error("Not yet implemented");
    }
}