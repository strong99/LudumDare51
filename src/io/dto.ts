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

export type EntityDataTypes = HumanData | NodeData;
export type NodeConstructionDataTypes = PlayerConstructionData;

export interface HumanData extends EntityData {
    type: "human";
}

export interface PlayerConstructionData extends NodeConstructionData {
    type: "player";
    pods: Array<number>;
    timeSincePodConsumed: number;
    withering: number|false;
    buildPoints: number;
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