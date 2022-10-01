import { Node } from "./node";
import { NodeConstruction as NodeConstructionModel } from "../../model/nodeConstruction";
import { NodeConstruction } from "./nodeConstruction";
import { TreeConstruct as TreeModel } from "../../model/treeConstruct";
import { Tree } from "./tree";
import { DefensiveConstruction as DefensiveConstructionModel } from "../../model/defensiveConstruction";
import { OffensiveConstruction as OffensiveConstructionModel } from "../../model/offensiveConstruction";
import { LureConstruction as LureConstructionModel } from "../../model/lureConstruction";
import { OffensiveConstruction } from "./offensiveConstruction";
import { DefensiveConstruction } from "./defensiveConstruction";
import { LureConstruction } from "./lureConstruction";

export function TryCreate(node: Node, nodeConstruction: NodeConstructionModel): NodeConstruction {
    if (nodeConstruction instanceof TreeModel) {
        return new Tree(node, nodeConstruction);
    }
    else if (nodeConstruction instanceof LureConstructionModel) {
        return new LureConstruction(node, nodeConstruction);
    }
    else if (nodeConstruction instanceof OffensiveConstructionModel) {
        return new OffensiveConstruction(node, nodeConstruction);
    }
    else if (nodeConstruction instanceof DefensiveConstructionModel) {
        return new DefensiveConstruction(node, nodeConstruction);
    }
    else {
        throw new Error("Not yet implemented");
    }
}
