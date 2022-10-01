import { NodeConstruction } from "./nodeConstruction";
import { BoardGameView } from "../boardGameView";
import { Node as NodeModel } from "../../model/node";
import { Entity } from "../entity";
import { Entity as EntityModel } from "../../model/entity";
import { NodeInteractionDialog } from "./nodeInteractionDialog";

export function TryCreate(boardGameView: BoardGameView, model: EntityModel): Entity {
    if (model instanceof NodeModel) {
        return new NodeInteractionDialog(boardGameView, model);
    }
    throw new Error("Not yet implemented");
}