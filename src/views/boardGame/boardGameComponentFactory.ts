import { Entity as EntityModel } from "../../model/entity";
import { Player as PlayerModel } from "../../model/player";
import { Node as NodeModel } from "../../model/node";
import { Player } from "./player";
import { Node } from "./node";
import { BoardGameView } from "../boardGameView";
import { Entity } from "../entity";

export function TryCreate(v: BoardGameView, m: EntityModel): Entity|null {
    let e: Entity|null = null;
    if (m instanceof PlayerModel) {
        e = new Player(v, m);
    }
    else if (m instanceof NodeModel) {
        e = new Node(v, m);
    }
    return e;
}