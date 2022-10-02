import { HumanComputerAgentData } from "../io/dto";
import { Agent } from "./agent";
import { CityConstruction } from "./cityConstruction";
import { Hero } from "./hero";
import { KingdomPlayer } from "./kingdomPlayer";
import { Node } from "./node";
import { Peasant } from "./peasant";
import { TownConstruction } from "./townConstruction";
import { Warrior } from "./warrior";
import { OnAddEntityCallback, OnRemoveEntityCallback, World } from "./world";

function randomItemFromArray<T>(array: Array<T>): T {
    return array[Math.floor(Math.random() * array.length)];
}

function remove<T>(array: Array<T>, target: T){
    const idx = array.indexOf(target);
    if (idx != -1) {
        array.splice(idx, 1);
    }
}

export class HumanComputerAgent implements Agent {
    private _player: KingdomPlayer;

    private _nextSpawn: number = 0;

    private _communities = new Array<CityConstruction|TownConstruction>();
    private _cities = new Array<CityConstruction>();
    private _towns = new Array<TownConstruction>();

    private _peasants = new Array<Peasant>();
    private _warriors = new Array<Warrior>();
    private _heros = new Array<Hero>();

    private _onAddEntity: OnAddEntityCallback = e => {
        if (e instanceof Peasant) this._peasants.push(e);
        else if (e instanceof Warrior) this._warriors.push(e);
        else if (e instanceof Hero) this._heros.push(e);
        else if (e instanceof Node) {
            if (e.construct instanceof TownConstruction) this._towns.push(e.construct);
            else if (e.construct instanceof CityConstruction) this._cities.push(e.construct);
            else return;
            
            this._communities.push(e.construct);
        }
    };
    private _onRemoveEntity: OnRemoveEntityCallback = e => {
        if (e instanceof Peasant) remove(this._peasants, e);
        else if (e instanceof Warrior) remove(this._warriors, e);
        else if (e instanceof Hero) remove(this._heros, e);
        else if (e instanceof Node) {
            if (e.construct instanceof TownConstruction) remove(this._towns, e.construct);
            else if (e.construct instanceof CityConstruction) remove(this._cities, e.construct);
            else return;
            
            remove(this._communities, e.construct);
        }
    }

    public constructor(world: World, data: HumanComputerAgentData) {
        this._player = world.players.find(p=>p.id === data.player && p instanceof KingdomPlayer)! as KingdomPlayer;
        world.addAgent(this);

        this._player.world.onAddEntity(this._onAddEntity);
        this._player.world.onRemoveEntity(this._onRemoveEntity);
    }

    public update(elapsedTime: number): void {
        this._nextSpawn += elapsedTime;
        if (this._nextSpawn > 2500) {
            this._nextSpawn -= 2500;

            if (this._communities.some(c=>c.alertness > 7)) {
                const start = this._cities[0] ?? this._towns[0];
                
                this._player.buyHero(start);

                const buyCount = 3;
                for(let i = 0; i < buyCount; i++) {
                    this._player.buyWarrior(start);
                }
            }
            else if (this._communities.some(c=>c.alertness > 3)) {
                const start = this._towns[0] ?? this._cities[0];
                
                const buyCount = 3;
                for(let i = 0; i < buyCount; i++) {
                    this._player.buyWarrior(start);
                }
            }
            else if (this._peasants.length < 15) {
                const towns = this._player.world.entities.filter(e => e instanceof Node && e.construct instanceof TownConstruction) as Array<Node>;
                const town = randomItemFromArray(towns);
                this._player.buyPeasant(town.construct as TownConstruction);
            }
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
        this._player.world.offAddEntity(this._onAddEntity);
        this._player.world.offRemoveEntity(this._onRemoveEntity);
    }
}