import { AgentDataTypes } from "../io/dto";
import { Agent } from "./agent";
import { HumanComputerAgent } from "./humanComputerAgent";
import { World } from "./world";

export function Create(world: World, data: AgentDataTypes): Agent {
    let created: Agent;
    if (data.type == "humanComputer") {
        created = new HumanComputerAgent(world, data);
    }
    else {
        throw new Error("Agent construction not supported");
    }
    return created;
}