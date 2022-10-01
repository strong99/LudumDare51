export interface WorldData {
    playTime: number;
    entities: Array<EntityDataTypes>;
}

export interface EntityData {
    type: string;
    x: number;
    y: number;
}

export type EntityDataTypes = HumanData | PlayerData | NodeData | DigestivePodData;

export interface HumanData extends EntityData {
    type: "human";
}

export interface PlayerData extends EntityData {
    type: "player";
}

export interface NodeData extends EntityData {
    type: "node";
    neighbours: Array<string>;
}

export interface DigestivePodData extends EntityData {
    type: "digestivePod";
}
