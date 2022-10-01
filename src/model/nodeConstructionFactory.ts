import { NodeConstructionDataTypes } from "../io/dto";
import { CityConstruction } from "./cityConstruction";
import { DefensiveConstruction } from "./defensiveConstruction";
import { LureConstruction } from "./lureConstruction";
import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { OffensiveConstruction } from "./offensiveConstruction";
import { TownConstruction } from "./townConstruction";
import { TreeConstruct } from "./treeConstruct";

export function TryCreate(node: Node, data: NodeConstructionDataTypes): NodeConstruction {
    let created: NodeConstruction;
    if (data.type == "tree") {
        created = new TreeConstruct(node, data);
    }
    else if (data.type == "lure") {
        created = new LureConstruction(node, data);
    }
    else if (data.type == "offensive") {
        created = new OffensiveConstruction(node, data);
    }
    else if (data.type == "defensive") {
        created = new DefensiveConstruction(node, data);
    }
    else if (data.type == "city") {
        created = new CityConstruction(node, data);
    }
    else if (data.type == "town") {
        created = new TownConstruction(node, data);
    }
    else {
        throw new Error("Node construction not supported");
    }
    return created;
}