import { TreeConstructionData } from "../io/dto";
import { DigestivePod } from "./digestivePod";
import { Node } from "./node";
import { Player } from "./player";
import { PlayerControlled } from "./playerControlled";
import { OnAddEntityCallback } from "./world";

/**
 * LD51 theme value: 10 seconds
 */
const maxTimeSincePodConsumed = 10 * 1000;
const witheringTime = 10 * 1000;

export class TreeConstruct extends PlayerControlled {
    public get id() { return this._id; }
    private _id: number;

    public get world() { return this._node.world; }
    private _node: Node;

    private _withering: number | false = false;

    public get hasDied() { return this._withering !== false; }
    public get willDie() { return this.timeToConsumePod < 0 && this._pods.length == 0; }
    public get shouldConsume() { return this.timeToConsumePod < 0; }
    public get shouldConsumePercentage() { return this.timeToConsumePod / maxTimeSincePodConsumed; }
    public get timeToConsumePod() { return maxTimeSincePodConsumed - this._timeSincePodConsumed; }
    public get timeSincePodConsumed() { return this._timeSincePodConsumed; }
    private _timeSincePodConsumed = 0;

    public constructor(node: Node, data: TreeConstructionData) {
        super();
        
        this._node = node;
        this._node.construct = this;

        this._id = data.id;
        this._timeSincePodConsumed = data.timeSincePodConsumed;
        this._withering = data.withering;

        const waitingOnPods = [...data.pods];
        const listenForPods: OnAddEntityCallback = (e) => {
            // Find pods
            if (waitingOnPods.includes(e.id) && e instanceof DigestivePod) {
                waitingOnPods.splice(waitingOnPods.indexOf(e.id), 1);
                this._pods.push(e);
            }

            if (waitingOnPods.length == 0) {
                this._node.world.onRemoveEntity(listenForPods);
            }
        };
        this._node.world.onAddEntity(listenForPods);

        const player = this._node.world.players.find(p=>p.id === data.player);
        if (!player) throw new Error(`Player ${data.player} not found for construct`);
        this._player = player;
    }

    public update(elapsedTime: number): void {
        this._timeSincePodConsumed += elapsedTime;
        if (this.hasDied) {
            (this._withering as number) += elapsedTime;
        }
        else if (this.shouldConsume) {
            this.tryConsume();
        }
    }

    public serialize(): TreeConstructionData {
        return {
            id: this.id,
            type: "tree",
            player: this._player.id,
            pods: this._pods.map(p=>p.id),
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
        }
        else {
            this._withering = 0;
        }
    }

    public destroy(): void {
        
    }
}