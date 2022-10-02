export type HumanDataTypes = PeasantData | WarriorData | HeroData;
export type EntityDataTypes = HumanDataTypes | NodeData;
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
    pods: Array<number>;
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
}

export interface TownConstructionData extends NodeConstructionData {
    type: "town";
}

export interface AgentData {
    type: string;
    player: number;
}

export interface HumanComputerAgentData extends AgentData {
    type: "humanComputer";
}
