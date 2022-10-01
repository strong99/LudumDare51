import { PlayerDataTypes, PlayerData } from "../io/dto";
import { Player } from "./player";
import { KingdomPlayer } from "./KingdomPlayer";
import { TreePlayer } from "./TreePlayer";
import { World } from "./world";

/**
 * Creates an Entity and adds it to the World.
 * @param world The world to add the entity to
 * @param data The data used to created an entity
 * @returns A created and attached entity
 */
export function Create(world: World, data: PlayerData): Player {
    const typedData = data as PlayerDataTypes;
    let createdEntity: Player|null = null;

    if (typedData.type == "kingdom") {
        createdEntity = new KingdomPlayer(world, typedData);
    }
    else if (typedData.type == "tree") {
        createdEntity = new TreePlayer(world, typedData);
    }
    else {
        throw new Error(`Unsupported entity type: ${data.type}`);
    }

    return createdEntity;
}