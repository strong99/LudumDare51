import { EntityData, EntityDataTypes } from "../io/dto";
import { Entity } from "./entity";
import { Hero } from "./hero";
import { Node } from "./node";
import { Peasant } from "./peasant";
import { Warrior } from "./warrior";
import { World } from "./world";

/**
 * Creates an Entity and adds it to the World.
 * @param world The world to add the entity to
 * @param data The data used to created an entity
 * @returns A created and attached entity
 */
export function Create(world: World, data: EntityData): Entity {
    const typedData = data as EntityDataTypes;
    let createdEntity: Entity|null = null;

    if (typedData.type == "peasant") {
        createdEntity = new Peasant(world, typedData);
    }
    else if (typedData.type == "warrior") {
        createdEntity = new Warrior(world, typedData);
    }
    else if (typedData.type == "hero") {
        createdEntity = new Hero(world, typedData);
    }
    else if (typedData.type == "node") {
        createdEntity = new Node(world, typedData);
    }
    else {
        throw new Error(`Unsupported entity type: ${data.type}`);
    }

    return createdEntity;
}