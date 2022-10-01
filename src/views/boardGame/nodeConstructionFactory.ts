import { Node } from "./node";
import { NodeConstruction as NodeConstructionModel } from "../../model/nodeConstruction";
import { NodeConstruction } from "./nodeConstruction";
import { TreeConstruct as TreeModel } from "../../model/treeConstruct";
import { Tree } from "./tree";

export function TryCreate(node: Node, nodeConstruction: NodeConstructionModel): NodeConstruction {
    if (nodeConstruction instanceof TreeModel) {
        return new Tree(node, nodeConstruction);
    }
    else {
        throw new Error("Not yet implemented");
    }
}