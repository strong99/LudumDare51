export interface WorldData {
    lastGeneratdId: number;
    playTime: number;
    entities: Array<EntityDataTypes>;
}

export interface EntityData {
    id: number;
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
    pods: Array<number>;
    timeSincePodConsumed: number;
    withering: number|false;
    buildPoints: number;
}

export interface NodeData extends EntityData {
    type: "node";
    neighbours: Array<number>;
    construction?: NodeConstructionData;
}

export interface DigestivePodData extends EntityData {
    type: "digestivePod";
}

export interface NodeConstructionData {
    id: number;
    type: string;
}