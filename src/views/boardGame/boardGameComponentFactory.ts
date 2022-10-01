import { Entity as EntityModel } from "../../model/entity";
import { Node as NodeModel } from "../../model/node";
import { Node } from "./node";
import { BoardGameView } from "../boardGameView";
import { Entity } from "../entity";

export function TryCreate(v: BoardGameView, m: EntityModel): Entity|null {
    let e: Entity|null = null;
    if (m instanceof NodeModel) {
        e = new Node(v, m);
    }
    return e;
}