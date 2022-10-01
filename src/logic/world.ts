import { JSONTypes, JSONSaveable } from "./saveable";

export class World implements JSONSaveable {
    public constructor(data?: JSONTypes) {
        
    }

    public serialize(): JSONTypes {
        return null;
    }
}