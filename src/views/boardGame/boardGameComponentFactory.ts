import { Entity as EntityModel } from "../../model/entity";
import { Node as NodeModel } from "../../model/node";
import { DigestivePod as DigestivePodModel } from "../../model/digestivePod";
import { Peasant as PeasantModel } from "../../model/peasant";
import { Warrior as WarriorModel } from "../../model/warrior";
import { Hero as HeroModel } from "../../model/hero";
import { Node } from "./node";
import { BoardGameView } from "../boardGameView";
import { Entity } from "../entity";
import { Peasant } from "./peasant";
import { Warrior } from "./warrior";
import { Hero } from "./hero";
import { DigestivePod } from "./digestivePod";

export function TryCreate(v: BoardGameView, m: EntityModel): Entity|null {
    let e: Entity|null = null;
    if (m instanceof NodeModel) {
        e = new Node(v, m);
    }
    else if (m instanceof DigestivePodModel) {
        e = new DigestivePod(v, m);
    }
    else if (m instanceof PeasantModel) {
        e = new Peasant(v, m);
    }
    else  if (m instanceof WarriorModel) {
        e = new Warrior(v, m);
    }
    else  if (m instanceof HeroModel) {
        e = new Hero(v, m);
    }
    return e;
}