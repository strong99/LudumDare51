import { NodeConstructionDataTypes } from "../io/dto";
import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { TreeConstruct } from "./treeConstruct";

export function TryCreate(node: Node, data: NodeConstructionDataTypes): NodeConstruction {
    let created: NodeConstruction;
    if (data.type == "tree") {
        created = new TreeConstruct(node, data);
    }
    else {
        throw new Error("Node construction not supported");
    }
    return created;
}