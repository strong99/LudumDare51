import { NodeConstructionDataTypes } from "../io/dto";
import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { Player } from "./player";

export function TryCreate(node: Node, data: NodeConstructionDataTypes): NodeConstruction {
    let created: NodeConstruction;
    if (data.type == "player") {
        created = new Player(node, data);
    }
    else {
        throw new Error("Node construction not supported");
    }
    return created;
}