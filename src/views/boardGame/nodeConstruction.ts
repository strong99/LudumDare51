export interface NodeConstruction {
    is(model: any): boolean;
    update(timeElapsed: number): void;
    destroy(): void;
}