import { AnimatedSprite, Application, Container, Loader, Sprite, SpritesheetLoader, Text, TextStyle, Texture } from "pixi.js";
import { DemoWorld } from "../demo/DemoWorld";
import { World } from "../model/world";
import { GameView } from "./gameView";
import { GameViewService } from "./gameViewService";
import { LoadState } from "./loadState";
import { Sound } from "@pixi/sound";

export class MenuGameView implements GameView {

    private _viewService: GameViewService;
    private _pixi: Application;

    private _parentResource?: Container;
    private _activeWorld?: World;

    private _backdrop?: Container;
    private _sky?: Sprite;
    private _background?: Sprite;
    private _foreground?: Sprite;
    private _questBoard?: Sprite;
    private _topright?: Container;

    private _rootGrabbingTextures?: Array<Texture>;

    private _startButton?: Sprite;
    private _continueButton?: Sprite;

    public constructor(viewService: GameViewService, pixi: Application, world?: World) {
        this._pixi = pixi;
        this._viewService = viewService;
        this._activeWorld = world;
    }
    
    private _prevMusic?: Sound;
    private _music?: Sound;
    private _musicId?: string;
    public playMusic(audio: string) {
        if (this._musicId === audio && this._music) {
            this._music.loop = true;
            return;
        }

        if (this._music) {
            this._music.loop = false;
        }
        this._musicId = audio;
        this._music = Sound.from(`${audio}.ogg`);
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

    public prepare(): LoadState {
        const startMusic = ()=>{
            this.playMusic('happytune');
            window.removeEventListener('click', startMusic);
        };
        window.addEventListener('click', startMusic);

        this._parentResource = new Container();
        this._parentResource.visible = false;

        this._pixi.stage.addChild(this._parentResource);
        this._parentResource.visible = true;

        const loader = new Loader()
            .add('continueButton.png')
            .add('questBoard.png')
            .add('startButton.png')
            .add('menu.png');

        for (let i = 0; i < 10; ++i) {
            loader.add(`rootsGrabbing/frame000${i}.png`);
        }

        const loadState = new LoadState();
        let i = 0;
        loader.onProgress.add((l, r) => loadState.onProgress(++i, Object.keys(loader.resources).length, r.name))
        loader.onComplete.add((r) => {
            if (!this._parentResource) {
                throw new Error("Layer not loaded");
            }

            this.playMusic('happytune');

            this._rootGrabbingTextures ??= [];
            this._rootGrabbingTextures.length = 0;
            for(let i = 0; i < 10; ++i) {
                const frame = `rootsGrabbing/frame000${i}.png`;
                const texture = r.resources[frame].texture;
                if (!texture) {
                    throw new Error("Root Grabbing animation frame texture not loaded");
                }
                this._rootGrabbingTextures.push(texture);
            }

            this._backdrop = new Container();

            this._foreground = new Sprite(r.resources['menu.png'].texture);
            this._foreground.anchor.set(0.5, 0.5);
            this._backdrop.addChild(this._foreground);
            this._parentResource.addChild(this._backdrop);

            this._questBoard = new Sprite(r.resources['questBoard.png'].texture);
            this._questBoard.anchor.set(0, 1);
            this._questBoard.position.set(-window.innerWidth / 2, window.innerHeight / 2);
            this._parentResource.addChild(this._questBoard);

            this._startButton = new Sprite(r.resources['startButton.png'].texture);
            this._startButton.anchor.set(0.5, 0.5);
            this._startButton.position.set(153, -120);
            this._startButton.interactive = true;
            this._startButton.on('click', () => this.grabButton(this._startButton!, ()=>this.onNew()));
            this._startButton.on('pointerover', () => this._startButton?.anchor.set(0.5, 0.35));
            this._startButton.on('pointerout', () => this._startButton?.anchor.set(0.5, 0.5));
            this._questBoard.addChild(this._startButton);

            if (this._activeWorld || this._viewService.saveManager.hasQuickSave()) {
                this._continueButton = new Sprite(r.resources['continueButton.png'].texture);
                this._continueButton.anchor.set(0.5, 0.5);
                this._continueButton.position.set(276, -116);
                this._continueButton.interactive = true;
                this._continueButton.on('click', () => this.grabButton(this._continueButton!, ()=>this.onContinue()));
                this._continueButton.on('pointerover', () => this._continueButton?.anchor.set(0.5,0.35));
                this._continueButton.on('pointerout', () => this._continueButton?.anchor.set(0.5,0.5));
                this._questBoard.addChild(this._continueButton);
            }

            this._topright = new Container();
            this._topright.x = window.innerWidth / 2 - 10;
            this._topright.y = window.innerHeight / 2 - 10;
            const hdr = new Text("The Blood Tree", {
                fontSize: 30,
                align: 'right',
                fill: 'white',
                fontWeight: 'bolder'
            });
            hdr.anchor.set(1,1);
            hdr.y = -20 * 3;
            this._topright.addChild(hdr);
            const expl = new Text("Lure and trap humans to survive and thrive\nBeware not to disrupt men for the Hero will smite\ngrow your roots through magical ground nodes", {
                fontSize: 20,
                align: 'right',
                fill: 'white'
            });
            expl.anchor.set(1,1);
            this._topright.addChild(expl);
            this._parentResource.addChild(this._topright);

            loadState.onFinished()
        });
        loader.load();
        return loadState;
    }

    private grabButton(sprite: Sprite, callback: ()=>void) {
        Sound.from(`rip.ogg`).play();

        if (!this._rootGrabbingTextures) {
            throw new Error("Grabbing root textures not loaded");
        }

        if (!this._questBoard) {
            throw new Error("Questboard not loaded");
        }
        sprite.interactive = false;

        const roots = new AnimatedSprite(this._rootGrabbingTextures);
        roots.onComplete = ()=>{
            setTimeout(()=>callback(), 500);
            roots.destroy();
        };
        roots.onFrameChange = (frameIdx) => {
            if (frameIdx == 6) {
                sprite.visible = false;
            }
        };
        roots.play();
        roots.loop = false;
        roots.animationSpeed = 0.4;
        roots.anchor.set(0.4, 0.4);
        roots.position.set(sprite.x, sprite.y);
        this._questBoard.addChild(roots);
    }

    private onNew() {
        const world = new World(DemoWorld);
        this._viewService.swapViewToBoard(world);
    }

    private onContinue() {
        const world = this._activeWorld ?? this._viewService.saveManager.loadQuickSave();
        this._viewService.swapViewToBoard(world);
    }

    public update(elapsedTime: number): void {
        if (this._prevMusic?.isPlaying === false) delete this._prevMusic;
        if (!this._prevMusic && this._music?.isPlaying === false) this._music.play();

        this._questBoard!.position.set(-window.innerWidth / 2, window.innerHeight / 2);
        this._parentResource?.position.set(window.innerWidth / 2, window.innerHeight / 2);
        const sx = window.innerWidth / 1600;
        const sy = window.innerHeight / 1080;
        const maxS = sx > sy ? sx : sy
        const minS = sx < sy ? sx : sy
        this._backdrop?.scale.set(maxS);
        this._questBoard?.scale.set(minS);
        if (this._topright) {
            this._topright.x = window.innerWidth / 2 - 10;
            this._topright.y = window.innerHeight / 2 - 10;
        }
    }

    public destroy(): void {
        this._prevMusic?.stop();
        this._music?.stop();
        delete this._music;
        delete this._prevMusic;
        this._parentResource?.parent?.removeChild(this._parentResource);
    }
}
