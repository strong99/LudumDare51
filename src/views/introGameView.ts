import { Sound } from "@pixi/sound";
import { Application, Container, Loader, Text, utils } from "pixi.js";
import { World } from "../model/world";
import { Entity } from "./entity";
import { GameView } from "./gameView";
import { GameViewService } from "./gameViewService";
import { LoadState } from "./loadState";
import { MenuBackgroundEntity } from "./menuBackgroundEntity";

const intro = [
    'Something has been taking your fruits,',
    'and that something tasted delicious.',
    'Humanity can’t stay away from your fruits.',
    'And you have developed a taste for blood.',
    'Lure unwittingly humans into your trap.',
    'And feast up on their riches!',
    'Muwahahaha',
];

const charIntervalMs = 100;

export class IntroGameView implements GameView {
    private _world: World;
    private _viewService: GameViewService;
    private _pixi: Application;
    
    private _backdrop?: MenuBackgroundEntity;

    private _parentResource?: Container;

    private _lineIdx: number = 0;
    private _charIdx: number = 0;
    private _charInterval: number = 0;

    private _keySounds = new Array<Sound>();

    private _text?: Text;
    
    private _prevMusic?: Sound;
    private _music?: Sound;
    private _musicId?: string;
    public playMusic(audio: string) {
        if (this._musicId === audio && this._music) {
            this._music.loop = false;
            return;
        }

        if (this._music) {
            this._music.loop = false;
            this._prevMusic = this._music;
        }
        this._musicId = audio;
        this._music = Sound.from({
            url: `${audio}.ogg`,
            preload: true
        });
        this._music.loop = true;
    }

    public stopMusic() {
        if (this._music) {
            delete this._musicId;
            this._music.loop = false;
            this._prevMusic = this._music;
            delete this._music;
        }
    }

    public constructor(viewService: GameViewService, pixi: Application, world: World) {
        this._pixi = pixi;
        this._viewService = viewService;
        this._world = world;
    }

    public prepare(): LoadState {

        this._parentResource = new Container();
        this._parentResource.visible = false;
        this._pixi.stage.addChild(this._parentResource);
        
        const toLoad = new Array<string>();

        this._keySounds.push(Sound.from({
            preload: true,
            url: 'keyPress001.ogg',
            volume: 0.5
        }));
        this._keySounds.push(Sound.from({
            preload: true,
            url: 'keyPress002.ogg',
            volume: 0.5
        }));

        const loadState = new LoadState();
        let i = 0;
        const onLoad: Loader.OnCompleteSignal = (r) => {
            if (!this._parentResource) {
                throw new Error("Layer not loaded");
            }

            this.playMusic('happytune');
    
            this._backdrop = new MenuBackgroundEntity(this._parentResource);
            
            this._text = new Text("", {
                align: 'center',
                fontSize: 30,
                fill: 'white',
                stroke: 'grey',
                strokeThickness: 2
            });
            this._text.anchor.set(0.5, 0.5);
            this._parentResource.addChild(this._text);
            this._parentResource.visible = true;
            
            loadState.onFinished();
        };
        
        const notLoadedYet = toLoad.filter(p => p in utils.TextureCache === false);
        if (notLoadedYet.length > 0) {
            const loader = new Loader();
            loader.add(notLoadedYet);
            loader.onProgress.add((l, r) => loadState.onProgress(++i, Object.keys(loader.resources).length, r.name))
            loader.onComplete.add(onLoad);
            loader.load();
        }
        else {
            onLoad(this._pixi.loader, this._pixi.loader.resources);
        }
        return loadState;
    }

    public update(timeElapsed: number): void {
        if (this._prevMusic?.isPlaying === false) delete this._prevMusic;
        if (!this._prevMusic && this._music?.isPlaying === false && this._music?.isPlayable !== false) this._music.play();
        
        if (!this._parentResource || !this._text) {
            return;
        }

        this._parentResource.position.set(window.innerWidth / 2, window.innerHeight / 2);
        this._text.position.y = window.innerHeight / 2 - 50;
        this._backdrop?.update(timeElapsed);
        
        this._charInterval -= timeElapsed;
        if (this._charInterval < 0 && this._text) {
            this._charInterval += charIntervalMs;

            const fullLine = intro[this._lineIdx];
            if (this._charIdx === fullLine.length) { 
                this._charInterval += charIntervalMs * 5;
            }

            const idx = Math.floor(Math.random() * this._keySounds.length);
            this._keySounds[idx].play();
            
            if (this._charIdx === fullLine.length + 1) {
                ++this._lineIdx;
                this._charIdx = 0;

                if (this._lineIdx == intro.length) {
                    this._viewService.swapViewToBoard(this._world);
                    return;
                }
            }
            else {
                while(fullLine.substring(0, this._charIdx).endsWith(' ')) {
                    ++this._charIdx;
                }
                this._text.text = fullLine.substring(0, this._charIdx);

                ++this._charIdx;
            }
        }
    }

    public destroy(): void {
        this._prevMusic?.stop();
        this._music?.stop();
        delete this._prevMusic;
        delete this._music;

        this._backdrop?.destroy();
        this._parentResource?.destroy();
        delete this._parentResource;
    }
}