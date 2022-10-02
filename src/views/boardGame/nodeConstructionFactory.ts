import { Node } from "./node";
import { NodeConstruction as NodeConstructionModel } from "../../model/nodeConstruction";
import { NodeConstruction } from "./nodeConstruction";
import { TreeConstruct as TreeModel } from "../../model/treeConstruct";
import { Tree } from "./tree";
import { DefensiveConstruction as DefensiveConstructionModel } from "../../model/defensiveConstruction";
import { OffensiveConstruction as OffensiveConstructionModel } from "../../model/offensiveConstruction";
import { CityConstruction as CityConstructionModel } from "../../model/cityConstruction";
import { TownConstruction as TownConstructionModel } from "../../model/townConstruction";
import { LureConstruction as LureConstructionModel } from "../../model/lureConstruction";
import { OffensiveConstruction } from "./offensiveConstruction";
import { DefensiveConstruction } from "./defensiveConstruction";
import { LureConstruction } from "./lureConstruction";
import { TownConstruction } from "./townConstruction";
import { CityConstruction } from "./cityConstruction";
import { FruitMoveTo } from "./fruitMoveTo";

export function TryCreate(node: Node, nodeConstruction: NodeConstructionModel): NodeConstruction {
    if (nodeConstruction instanceof TreeModel) {
        return new Tree(node, nodeConstruction);
    }
    else if (nodeConstruction instanceof LureConstructionModel) {
        new FruitMoveTo(node, nodeConstruction);
        return new LureConstruction(node, nodeConstruction);
    }
    else if (nodeConstruction instanceof OffensiveConstructionModel) {
        new FruitMoveTo(node, nodeConstruction);
        return new OffensiveConstruction(node, nodeConstruction);
    }
    else if (nodeConstruction instanceof DefensiveConstructionModel) {
        new FruitMoveTo(node, nodeConstruction);
        return new DefensiveConstruction(node, nodeConstruction);
    }
    else if (nodeConstruction instanceof CityConstructionModel) {
        return new CityConstruction(node, nodeConstruction);
    }
    else if (nodeConstruction instanceof TownConstructionModel) {
        return new TownConstruction(node, nodeConstruction);
    }
    else {
        throw new Error("Not yet implemented");
    }
}
