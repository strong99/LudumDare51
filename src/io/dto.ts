export type HumanDataTypes = PeasantData | WarriorData | HeroData;
export type EntityDataTypes = HumanDataTypes | NodeData;
export type NodeConstructionDataTypes = TreeConstructionData | LureConstructionData | DefensiveConstructionData | OffensiveConstructionData | TownConstructionData | CityConstructionData;
export type PlayerDataTypes = TreePlayerData | KingdomPlayerData;

export interface WorldData {
    lastGeneratdId: number;
    playTime: number;
    entities: Array<EntityDataTypes>;
    players: Array<PlayerDataTypes>;
}

export interface EntityData {
    id: number;
    type: string;
    x: number;
    y: number;
}

export interface HumanData extends EntityData {

}

export interface PeasantData extends HumanData {
    type: "peasant";
}

export interface WarriorData extends HumanData {
    type: "warrior";
}

export interface HeroData extends HumanData {
    type: "hero";
}

export interface PlayerData {
    id: number;
    type: string;
}

export interface TreePlayerData extends PlayerData {
    type: "tree";
    buildPoints: number;
}

export interface KingdomPlayerData extends PlayerData {
    type: "kingdom";
}

export interface PlayerControlledData extends NodeConstructionData {
    pods: Array<number>;
    player: number;
    level: number;
}

export interface TreeConstructionData extends PlayerControlledData {
    type: "tree";
    timeSincePodConsumed: number;
    withering: number | false;
}

export interface NodeData extends EntityData {
    type: "node";
    neighbours: Array<number>;
    construction?: NodeConstructionDataTypes;
}

export interface DigestivePodData {
    id: number;
    x: number;
    y: number;
    age: number;
}

export interface NodeConstructionData {
    id: number;
    type: string;
}

export interface LureConstructionData extends PlayerControlledData {
    type: "lure";
}

export interface DefensiveConstructionData extends PlayerControlledData {
    type: "defensive";
}

export interface OffensiveConstructionData extends PlayerControlledData {
    type: "offensive";
}

export interface CityConstructionData extends PlayerControlledData {
    type: "city";
}

export interface TownConstructionData extends PlayerControlledData {
    type: "town";
}