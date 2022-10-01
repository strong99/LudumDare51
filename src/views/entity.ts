export interface Entity {
    update(timeElapsed: number): void;
    destroy(): void;
}