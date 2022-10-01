import { PlayerConstructionData } from "../io/dto";
import { DigestivePod } from "./digestivePod";
import { Entity } from "./entity";
import { Node } from "./node";
import { NodeConstruction } from "./nodeConstruction";
import { PlayerControlled } from "./playerControlled";
import { OnAddEntityCallback, World } from "./world";

/**
 * LD51 theme value: 10 seconds
 */
const maxTimeSincePodConsumed = 10 * 1000;
const witheringTime = 10 * 1000;

export class Player implements NodeConstruction {
    public get id() { return this._id; }
    private _id: number;

    public get world() { return this._node.world; }
    private _node: Node;

    public get pods(): ReadonlyArray<DigestivePod> { return this._pods; }
    private _pods = new Array<DigestivePod>();

    private _withering: number | false = false;

    public get hasDied() { return this._withering !== false; }
    public get willDie() { return this.timeToConsumePod < 0 && this._pods.length == 0; }
    public get shouldConsume() { return this.timeToConsumePod < 0; }
    public get shouldConsumePercentage() { return this.timeToConsumePod / maxTimeSincePodConsumed; }
    public get timeToConsumePod() { return maxTimeSincePodConsumed - this._timeSincePodConsumed; }
    public get timeSincePodConsumed() { return this._timeSincePodConsumed; }
    private _timeSincePodConsumed = 0;

    public get buildPoints() { return this._buildpoints; }
    private _buildpoints = 3;

    public constructor(node: Node, data?: PlayerConstructionData) {
        this._node = node;
        this._node.construct = this;

        if (data) {
            this._id = data.id;
            this._timeSincePodConsumed = data.timeSincePodConsumed;
            this._withering = data.withering;
            this._buildpoints = data.buildPoints;

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
        }
        else {
            this._id = this._node.world.generateId();
        }
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

    public serialize(): PlayerConstructionData {
        return {
            id: this.id,
            type: "player",
            pods: this._pods.map(p=>p.id),
            timeSincePodConsumed: this.timeSincePodConsumed,
            withering: this._withering,
            buildPoints: this._buildpoints
        }
    }

    public canClaim(node: Node): boolean {
        return !node.construct && node.neighbours.some(n => n.construct instanceof PlayerControlled);
    }

    public tryClaim(node: Node): boolean {
        if (!this.canClaim(node)) {
            return false;
        }

        this._buildpoints--;
        return true;
    }

    private tryConsume() {
        const podToConsume = this._pods.shift();
        if (podToConsume) {
            ++this._buildpoints;
        }
        else {
            this._withering = 0;
        }
    }

    public destroy(): void {
        
    }
}