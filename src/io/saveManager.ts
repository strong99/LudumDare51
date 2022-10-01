import { Application, Container } from "pixi.js";
import { World } from "../model/world";
import { PlayGameView } from "../views/boardGameView";

const saveKey = 'ld51:save';

export class SaveManager {
    public hasQuickSave(): boolean {
        return saveKey in localStorage;
    }

    public loadQuickSave(view: PlayGameView, layer: Container, pixi: Application): World {
        if (!this.hasQuickSave()) {
            throw new Error("Save does not exist");
        }

        const jsonStr = localStorage[saveKey];
        const jsonObj = JSON.parse(jsonStr);
        return new World(jsonObj);
    }

    public storeQuickSave(world: World) {
        const jsonObj = world.serialize();
        const jsonStr = JSON.stringify(jsonObj);
        localStorage[saveKey] = jsonStr;
    }
}