import { AnimatedSprite, Graphics, Point, Sprite, Texture } from 'pixi.js';
import { Node as NodeModel } from '../../model/node';
import { TreePlayer } from '../../model/treePlayer';
import { BoardGameView } from '../boardGameView';
import { Entity } from '../entity';

export class NodeConnection implements Entity {
    private _view: BoardGameView;
    private _model1: NodeModel;
    private _model2: NodeModel;

    public constructor(view: BoardGameView, sourceA: NodeModel, sourceB: NodeModel) {
        this._view = view;
        this._model1 = sourceA;
        this._model2 = sourceB;

        const center = new Point((this._model1.x + this._model2.x) / 2, (this._model1.y + this._model2.y) / 2);

        let ax = this._model1.x;
        let ay = this._model1.y;

        let bx = this._model2.x;
        let by = this._model2.y;

        const dx = ax - bx;
        const dy = ay - by;
        const length = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / length;
        const ny = dy / length;

        const xradius = 128 / 2;
        const yradius = 128 / 2;

        ax -= nx * xradius;
        ay -= ny * yradius;

        bx += nx * xradius;
        by += ny * yradius;

        if (!this._view.gameLayer) throw new Error();
    }

    public connectsTo(sourceA: NodeModel, sourceB: NodeModel) {
        return (
            (sourceA.id === this._model1.id && sourceB.id === this._model2.id) ||
            (sourceA.id === this._model2.id && sourceB.id === this._model1.id)
        );
    }

    private _hasRoots = false;
    private _roots = new Array<AnimatedSprite>();
    public update(timeElapsed: number): void {
        const hasPlayer = (this._model1.construct?.player instanceof TreePlayer|| this._model2.construct?.player instanceof TreePlayer);
        if (!this._hasRoots && hasPlayer) {
            this._hasRoots = true;
            const textures = new Array<Texture>();
            for(let i = 0; i < 7; ++i) textures.push(Texture.from(`roots/frame000${i}.png`));

            const m1 = this._model1.construct?.player instanceof TreePlayer ? this._model1 : this._model2;
            const m2 = this._model1.construct?.player instanceof TreePlayer ? this._model2 : this._model1;
            const dX = m2.x - m1.x;
            const dY = m2.y - m1.y;
            const l = Math.sqrt(dX * dX + dY *dY);
            const nX = dX / l;
            const nY = dY / l;

            for(let i = 0; i <l; i += 60) {
                const s = new AnimatedSprite(textures);
                if (nX > 0) s.scale.set(-1, 1);
                s.animationSpeed = 0.25;
                s.anchor.set(0.5, 1);
                s.loop = false;
                s.visible = false;
                s.position.set(
                    nX * i + m1.x,
                    nY * i + m1.y
                );
                this._view?.gameLayer?.addChild(s);
                this._roots.push(s);
            }
            for(let i = 0; i < this._roots.length; i++) {
                this._roots[i].onComplete = ()=> { 
                    const r=  this._roots[i + 1];
                    if (r) {
                        r.visible = true;
                        r.play();
                    }
                }
            }
            if (this._roots.length > 0) {
                this._roots[0].play();
            }
        }
    }

    public destroy(): void {
        this._roots.map(s=>s.destroy());
        this._roots.length = 0;
    }
}