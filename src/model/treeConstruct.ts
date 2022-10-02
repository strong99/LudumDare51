import { TreeConstructionData } from "../io/dto";
import { DigestivePod } from "./digestivePod";
import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { OnAddEntityCallback, OnRemoveEntityCallback } from "./world";

/**
 * LD51 theme value: 10 seconds
 */
const maxTimeSincePodConsumed = 10 * 1000;
const maxTimeFruitGrowth = 10 * 1000;
const witheringTime = 10 * 1000;

export class TreeConstruct extends NodeConstruction {
    public get id() { return this._id; }
    private _id: number;

    public get world() { return this._node.world; }
    
    public get node(): Node { return this._node; }
    private _node: Node;

    private _withering: number | false = false;

    public get fruits(): number { return this._fruits; }
    private _fruits: number = 4;

    private _fruitsSpawnInterval: number = 0;

    private _pods = new Array<DigestivePod>();

    public get hasDied() { return this._withering !== false; }
    public get willDie() { return this.timeToConsumePod < 0 && this._node.world.digistivePods.length == 0; }
    public get shouldConsume() { return this.timeToConsumePod < 0; }
    public get shouldConsumePercentage() { return this.timeToConsumePod / maxTimeSincePodConsumed; }
    public get timeToConsumePod() { return maxTimeSincePodConsumed - this._timeSincePodConsumed; }
    public get timeSincePodConsumed() { return this._timeSincePodConsumed; }
    private _timeSincePodConsumed = 0;
    
    private _onAddEntity: OnAddEntityCallback = e => {
        if (e instanceof DigestivePod) this._pods.push(e);
    };

    private _onRemoveEntity: OnRemoveEntityCallback = e => {
        if (e instanceof DigestivePod) { 
            const idx = this._pods.indexOf(e);
            if (idx != -1) this._pods.splice(idx);
        }
    };

    public constructor(node: Node, data: TreeConstructionData) {
        super();
        
        this._node = node;
        this._node.construct = this;

        this._id = data.id;
        this._timeSincePodConsumed = data.timeSincePodConsumed;
        this._withering = data.withering;

        this._node.world.onAddEntity(this._onAddEntity);
        this._node.world.onRemoveEntity(this._onRemoveEntity);

        const player = this._node.world.players.find(p=>p.id === data.player);
        if (!player) throw new Error(`Player ${data.player} not found for construct`);
        this._player = player;
    }

    public tryPick(): boolean {
        if (this._fruits < 0) {
            return false;
        }

        this._fruits--;
        return true;
    }

    public update(elapsedTime: number): void {
        this._timeSincePodConsumed += elapsedTime;
        if (this.hasDied) {
            (this._withering as number) += elapsedTime;
        }
        else if (this.shouldConsume) {
            this.tryConsume();
        }

        this._fruitsSpawnInterval -= elapsedTime;
        if (this._fruitsSpawnInterval < 0) {
            this._fruitsSpawnInterval += maxTimeFruitGrowth;
            if (this._fruits < 20) this._fruits++;
        }
    }

    public serialize(): TreeConstructionData {
        return {
            id: this.id,
            type: "tree",
            player: this._player.id,
            timeSincePodConsumed: this.timeSincePodConsumed,
            withering: this._withering,
            level: this._level
        }
    }
    
    public canUpgrade(type: string): boolean {
        return false;
    }
    
    public tryUpgrade(type: string): boolean {
        return false;
    }

    public upgradeRequirement(type: string): []|null {
        return null;
    }

    private tryConsume() {
        const podToConsume = this._pods.shift();
        if (podToConsume) {
            //++this._buildpoints;
            podToConsume.destroy();
        }
        else {
            this._withering = 0;
        }
    }

    public destroy(): void {
        this._node.world.offAddEntity(this._onAddEntity);
        this._node.world.offRemoveEntity(this._onRemoveEntity);        
    }
}