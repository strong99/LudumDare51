import { Application, Container, Loader, Sprite, Text, Texture } from "pixi.js";
import { OnAddEntityCallback, World } from "../model/world";
import { GameViewService } from "./gameViewService";
import { LoadState, LoadStateListener } from "./loadState";
import { PlayGameView } from "./playGameView";
import * as BoardGameComponentFactory from "./boardGame/boardGameComponentFactory";
import * as DialogCreatorFactory from "./boardGame/dialogCreatorFactory";
import { Entity } from "./entity";
import { Node as NodeModel } from "../model/node";
import { NodeConnection } from "./boardGame/nodeConnection";
import { Player as PlayerModel } from "../model/player";
import { TreePlayer } from "../model/treePlayer";
import { GameOverDialog } from "./boardGame/gameOverDialog";
import { worldTreeLocations } from "../demo/treeLocations";
import { Sound } from "@pixi/sound";
import { GameMenuSidePanel } from "./boardGame/gameMenuSidePanel";

export class BoardGameView implements PlayGameView {
    public get service() { return this._service; }
    private _service: GameViewService;

    private _pixi: Application;
    private _world: World;

    public get gameLayer() { return this._gameLayer; }
    private _gameLayer?: Container;

    public get viewLayer() { return this._viewLayer; }
    private _viewLayer?: Container;

    public get uiLayer() { return this._uiLayer; }
    private _uiLayer?: Container;

    public get player(): PlayerModel { return this._player; }
    private _player: PlayerModel;

    private _dialog?: Entity;
    private _surface?: Sprite;

    public get entities() { return this._entities; }
    private _entities = new Array<Entity>();
    private _minX = -1300
    private _maxX = 1300;
    private _scrollViewport = 0;

    private _parallax = new Array<Sprite>();
    private _topright?: Container;

    private _gameOverDialog?: Entity;

    private _onAddEntity: OnAddEntityCallback = e => {
        if (e instanceof NodeModel) {
            // try draw connection
            for (const c of e.neighbours) {
                if (!this._entities.some(en => en instanceof NodeConnection && en.connectsTo(e, c))) {
                    this._entities.push(new NodeConnection(this, e, c));
                }
            }
        }

        const result = BoardGameComponentFactory.TryCreate(this, e);
        if (!result) {
            console.warn("The given entity did not have view entity", e);
        }
        else {
            this._entities.push(result);
        }
    };

    public constructor(service: GameViewService, pixi: Application, world: World) {
        this._service = service;
        this._pixi = pixi;
        this._world = world;
        this._player = this._world.players.find(p => p instanceof TreePlayer)!;

        /*
        window.addEventListener('click', e=>{
            const x = e.pageX - this._gameLayer!.worldTransform.tx;
            const y = e.pageY - this._gameLayer!.worldTransform.ty;
            this._treeJson.push({ type: 'treeCluster', x, y });

            console.log(x, y);
            const t = new Sprite(Texture.from('treeCluster.png'));
            t.position.set(x, y);
            t.anchor.set(0.5, 0.8);
            this._gameLayer!.addChild(t);
        });
        window.addEventListener('keypress',e=>e.key === '.' && console.log(JSON.stringify(this._treeJson)));
        */
    }
    //private _treeJson = new Array<{type:string, x: number, y: number}>();

    public goToMenu() {
        this._service.swapViewToMenu();
    }

    private _activeSounds: Array<{ id: string, sound: Sound, count: number }> = [];
    public startPlaying(audio: string) {
        let activeSound = this._activeSounds.find(p=>p.id === audio);
        if (!activeSound) {
            const sound = Sound.from(`${audio}.ogg`);
            sound.play();
            activeSound = {
                id: audio,
                sound,
                count: 1
            };
            activeSound.sound.loop = true;
            this._activeSounds.push(activeSound);
        }
        else {
            activeSound.count++;
        }
    }

    public stopPlaying(audio: string) {
        let activeSound = this._activeSounds.find(p=>p.id === audio);
        if (activeSound) {
            activeSound.count--;
            if (activeSound.count === 0) {
                activeSound.sound.loop = false;
            }
            const idx = this._activeSounds.indexOf(activeSound);
            this._activeSounds.splice(idx, 1);
        }
    }

    private _musicId?: string;
    private _prevMusic?: Sound;
    private _music?: Sound;
    public playMusic(audio: string) {
        if (this._musicId === audio && this._music) {
            this._music.loop = true;
            return;
        }

        this._musicId = audio;
        if (this._music) {
            this._music.loop = false;
            this._prevMusic = this._music;
        }
        this._music = Sound.from(`${audio}.ogg`);
        this._music.loop = true;
    }

    public queMusic(audio: string) {
        if (this._musicId === audio && this._music) {
            this._music.loop = false;
            this._prevMusic = this._music;
            return;
        }

        this._musicId = audio;
        if (this._music) {
            this._music.loop = false;
            this._prevMusic = this._music;
        }
        this._music = Sound.from(`${audio}.ogg`);
        this._music.pause();
    }


    public stopMusic() {
        delete this._musicId;
        if (this._music) {
            this._music.loop = false;
            this._prevMusic = this._music;
            delete this._music;
        }
    }

    public playOnce(audio: string) {
        Sound.from(`${audio}.ogg`).play();
    }

    private _keydown: (this: Window, ev: KeyboardEvent) => any = e => {
        if (e.code === 'ArrowLeft') this._scrollViewport = -1;
        else if (e.code === 'ArrowRight') this._scrollViewport = 1;
    };

    private _keyup: (this: Window, ev: KeyboardEvent) => any = e => {
        if (e.code === 'ArrowLeft') this._scrollViewport = 0;
        else if (e.code === 'ArrowRight') this._scrollViewport = 0;
    };

    private _onPointerMove: (this: Window, ev: PointerEvent) => any = e => {
        if (e.x < 100) this._scrollViewport = -1;
        else if (e.x > window.innerWidth - 100) this._scrollViewport = 1;
        else this._scrollViewport = 0;
    };

    public get selected() { return this._selected; }
    private _selected?: NodeModel;
    public select(node?: NodeModel) {
        if (node === this._selected) {
            delete this._selected;
        }
        else {
            this._selected = node;
        }

        this._dialog?.destroy();
        if (this._selected) {
            this._dialog = DialogCreatorFactory.TryCreate(this, this._selected);
        }
        else delete this._dialog;
    }

    public prepare(): LoadStateListener {
        this._gameLayer = new Container();
        this._viewLayer = new Container();
        this._uiLayer = new Container();
        this._viewLayer.position.set(window.innerWidth / 2, window.innerHeight - 256);
        this._service.viewLayer.addChild(this._viewLayer);
        this._service.viewLayer.addChild(this._uiLayer);

        const loader = new Loader()
            .add('tree.png')
            .add('treeCluster.png')
            .add('node.png')
            .add('lure.png')
            .add('defensive.png')
            .add('offensive.png')
            .add('iconMenu.png')
            .add('iconRestart.png')
            .add('iconFullscreen.png')
            .add('iconSave.png')
            .add('iconLoad.png')
            .add('iconLDJam.png')
            .add('surface.png');

        for (let i = 0; i < 3; i++) {
            loader.add(`nodeHighlighting/frame000${i}.png`);
        }
        for (let i = 0; i < 9; i++) {
            loader.add(`treeConstruct/frame000${i}.png`);
        }
        for (let i = 0; i < 5; i++) {
            loader.add(`lureConstruct/frame000${i}.png`);
        }
        for (let i = 0; i < 6; i++) {
            loader.add(`defensiveConstruct/frame000${i}.png`);
        }
        for (let i = 0; i < 11; i++) {
            loader.add(`digestivePod/frame00${("00" + i).slice(-2)}.png`);
        }
        for (let i = 1; i < 6; i++) {
            loader.add(`faraway00${i}.png`);
        }

        // Scroll viewport
        window.addEventListener('pointermove', this._onPointerMove);
        window.addEventListener('keydown', this._keydown);
        window.addEventListener('keyup', this._keyup);

        const loadState = new LoadState();
        let i = 0;
        loader.onProgress.add((l, r) => loadState.onProgress(++i, Object.keys(loader.resources).length, r.name))
        loader.onComplete.add((r) => {
            if (!this._gameLayer) {
                throw new Error("Game layer not created");
            }

            this.playMusic('happytune');

            for (let i = 1; i < 6; i++) {
                const background = new Sprite(loader.resources[`faraway00${6 - i}.png`].texture);
                background.y = -100;
                background.anchor.set(0.5, 1);
                background.zIndex = i * -1000 + background.position.y;
                this._viewLayer!.addChild(background);
                this._parallax.push(background);
            }
            for(const treeLocation of worldTreeLocations) {
                const t = new Sprite(Texture.from('treeCluster.png'));
                t.position.set(treeLocation.x, treeLocation.y);
                t.anchor.set(0.5, 0.8);
                t.zIndex = treeLocation.y + 1000;
                this._gameLayer!.addChild(t);
            }

            this._entities.push(new GameMenuSidePanel(this, this._world));

            this._surface = new Sprite(r.resources['surface.png'].texture);
            this._surface.anchor.set(0.5, 1);
            this._surface.position.set(0, 256);
            this._surface.zIndex = this._surface.position.y - this._surface.anchor.y * this._surface.texture.height;
            this._gameLayer?.addChild(this._surface);

            this._viewLayer!.addChild(this._gameLayer);

            this._world.onAddEntity(this._onAddEntity);

            this._topright = new Container();
            this._topright.x = window.innerWidth - 10;
            this._topright.y = window.innerHeight - 10;
            const hdr = new Text("The Blood Tree", {
                fontSize: 30,
                align: 'right',
                fill: 'white',
                fontWeight: 'bolder'
            });
            hdr.anchor.set(1,1);
            hdr.y = -20 * 3;
            this._topright.addChild(hdr);
            const expl = new Text("Lure and trap humans to survive and thrive\nBeware not to disrupt men for the Hero will smite\nGrow your roots through magical ground nodes", {
                fontSize: 20,
                align: 'right',
                fill: 'white'
            });
            expl.anchor.set(1,1);
            this._topright.addChild(expl);
            this._uiLayer?.addChild(this._topright);

            loadState.onFinished()
        });
        loader.load();
        return loadState;
    }

    public update(elapsedTime: number): void {
        if (!this._gameLayer) return;
        if (!this._viewLayer) return;

        if (this._prevMusic?.isPlaying !== true) delete this._prevMusic;
        if (!this._prevMusic && this._music?.isPlaying === false) this._music.play();
        else if (!this._prevMusic && this._music?.isPlayable !== true) this.queMusic('happytune');

        this._world?.update(elapsedTime);

        this._viewLayer.position.set(window.innerWidth / 2, window.innerHeight - 256);

        // Scroll viewport
        const scrollSpeed = 2;
        const hw = window.innerWidth / 2;
        const maxX = this._maxX - hw;
        const minX = this._minX + hw;
        if (this._scrollViewport == -1 && -this._gameLayer.x > minX) {
            this._gameLayer.x = Math.min(-minX, this._gameLayer.x + elapsedTime * scrollSpeed);
        }
        else if (this._scrollViewport == 1 && -this._gameLayer.x < maxX) {
            this._gameLayer.x = Math.max(-maxX, this._gameLayer.x - elapsedTime * scrollSpeed);
        }

        for (let i = 0; i < this._parallax.length; ++i) {
            this._parallax[i].x = this._gameLayer.x / (5 * 5) * (i * i);
        }

        const entities = [...this._entities];
        for (const e of entities) {
            e.update(elapsedTime);
        }

        this._gameLayer.children.sort((a, b) => a.zIndex - b.zIndex);

        if (this._player.isDead && !this._gameOverDialog) {
            this._gameOverDialog = new GameOverDialog(this, this._player);
        }
        this._gameOverDialog?.update(elapsedTime);
        this._dialog?.update(elapsedTime);
        if (this._topright) {
            this._topright.x = window.innerWidth - 10;
            this._topright.y = window.innerHeight - 10;
        }
    }

    public destroy(): void {
        this._prevMusic?.stop();
        this._music?.stop();
        delete this._music;
        delete this._prevMusic;
        for(const a of this._activeSounds) {
            a.sound.stop();
        }
        for(const e of this._entities) {
            e.destroy();
        }

        window.removeEventListener('pointermove', this._onPointerMove);
        window.removeEventListener('keydown', this._keydown);
        window.removeEventListener('keyup', this._keyup);
        this._gameLayer?.parent?.removeChild(this._gameLayer);
        this._viewLayer?.parent?.removeChild(this._viewLayer);
        this._uiLayer?.parent?.removeChild(this._uiLayer);
        this._world.offAddEntity(this._onAddEntity);
    }
}