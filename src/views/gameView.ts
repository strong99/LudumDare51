import { LoadStateListener } from "./loadState";

export interface GameView {

    prepare(): LoadStateListener;
    update(elapsedTime: number): void;
    destroy(): void;
}