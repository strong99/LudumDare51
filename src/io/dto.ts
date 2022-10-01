export interface WorldData {
    playTime: number;
    entities: Array<EntityData>;
}

export interface EntityData {
    type: string;
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
}

export interface DigestivePodData extends EntityData {
    type: "digestivePod";
}
