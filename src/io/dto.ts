export type HumanDataTypes = PeasantData | WarriorData | HeroData;
export type EntityDataTypes = HumanDataTypes | NodeData | DigestivePodData | ProjectileData;
export type NodeConstructionDataTypes = TreeConstructionData | LureConstructionData | DefensiveConstructionData | OffensiveConstructionData | TownConstructionData | CityConstructionData;
export type PlayerDataTypes = TreePlayerData | KingdomPlayerData;
export type AgentDataTypes = HumanComputerAgentData;

export interface WorldData {
    lastGeneratdId: number;
    playTime: number;
    entities: Array<EntityDataTypes>;
    players: Array<PlayerDataTypes>;
    agents: Array<AgentDataTypes>;
}

export interface EntityData {
    id: number;
    type: string;
    x: number;
    y: number;
}

export interface HumanData extends EntityData {
    player: number;
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

export interface TreeConstructionData extends NodeConstructionData {
    type: "tree";
    timeSincePodConsumed: number;
    withering: number | false;
}

export interface NodeData extends EntityData {
    type: "node";
    neighbours: Array<number>;
    road?: "paved"|"dirt",
    construction?: NodeConstructionDataTypes;
}

export interface ProjectileData extends EntityData {
    type: "projectile";
    toX: number;
    toY: number;
}

export interface DigestivePodData extends EntityData {
    type: "digestivePod";
    x: number;
    y: number;
    age: number;
}

export interface NodeConstructionData {
    id: number;
    type: string;
    player: number;
    level: number;
}

export interface LureConstructionData extends NodeConstructionData {
    type: "lure";
}

export interface DefensiveConstructionData extends NodeConstructionData {
    type: "defensive";
}

export interface OffensiveConstructionData extends NodeConstructionData {
    type: "offensive";
}

export interface CityConstructionData extends NodeConstructionData {
    type: "city";
    alertDecreaseSpeed?: number;
}

export interface TownConstructionData extends NodeConstructionData {
    type: "town";
    alertDecreaseSpeed?: number;
}

export interface AgentData {
    type: string;
    player: number;
}

export interface HumanComputerAgentData extends AgentData {
    type: "humanComputer";
}
