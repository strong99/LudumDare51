import { Container, Sprite, Texture } from "pixi.js";
import { Entity } from "./entity";
import { GameView } from "./gameView";

export class MenuBackgroundEntity implements Entity {
    private _anchor = new Container();
    private _layers = new Array<Sprite>();
    private static _time = 0;

    public constructor(layer: Container) {
        for(let i =1; i < 6; ++i ){
            const layer = new Sprite(Texture.from(`menuBack00${i}.png`));
            layer.anchor.set(0.5);
            this._layers.push(layer);
            this._anchor.addChild(layer);
        }
        layer.addChild(this._anchor);
    }

    public update(timeElapsed: number): void {
        const sx = window.innerWidth / 1600;
        const sy = window.innerHeight / 1080;
        const maxS = sx > sy ? sx : sy;
        this._anchor.scale.set(maxS);

        MenuBackgroundEntity._time += timeElapsed;

        for(let i = 0; i < this._layers.length; i++) {
            const p = ((Math.sin(MenuBackgroundEntity._time / 5000) / 2) + .5) * i / 12.5 + 1;
            this._layers[i].scale.set(p);
        }
    }

    public destroy(): void {
        this._anchor.destroy();
    }
}
