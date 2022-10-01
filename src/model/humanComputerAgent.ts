import { HumanComputerAgentData } from "../io/dto";
import { Agent } from "./agent";
import { KingdomPlayer } from "./kingdomPlayer";
import { Node } from "./node";
import { TownConstruction } from "./townConstruction";
import { World } from "./world";

export class HumanComputerAgent implements Agent {
    private _player: KingdomPlayer;

    private _nextSpawn: number = 0;

    public constructor(world: World, data: HumanComputerAgentData) {
        this._player = world.players.find(p=>p.id === data.player && p instanceof KingdomPlayer)! as KingdomPlayer;
        world.addAgent(this);
    }

    public update(elapsedTime: number): void {
        this._nextSpawn += elapsedTime;
        if (this._nextSpawn > 2500) {
            this._nextSpawn -= 2500;

            const towns = this._player.world.entities.filter(e => e instanceof Node && e.construct instanceof TownConstruction);
            const town = towns[0] as Node;
            this._player.buyPeasant(town.construct as TownConstruction);
        }
    }

    public serialize(): HumanComputerAgentData {
        return {
            type: "humanComputer",
            player: this._player.id
        };
    }

    public destroy(): void {
        if (this._player.world.agents.includes(this)) {
            this._player.world.removeAgent(this);
        }
    }
}