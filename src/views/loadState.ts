export type OnProgressCallback = (idx: number, total: number, id: string) => void;
export type OnFinishedCallback = () => void;

export interface LoadStateSource {
    onProgress(idx: number, total: number, id: string): void;
    onFinished(): void;
}

export interface LoadStateListener {
    registerOnProgress(callback: OnProgressCallback): void;
    registerOnFinished(callback: OnFinishedCallback): void;
}

export class LoadState implements LoadStateSource, LoadStateListener {
    private _onProgressListeners = new Array<OnProgressCallback>();
    private _onFinishedListeners = new Array<OnFinishedCallback>();
    private _onFinished = false;

    public onProgress(idx: number, total: number, id: string) {
        for(const l of this._onProgressListeners) {
            l(idx, total, id);
        }
    }

    public onFinished() {
        this._onFinished = true;

        for(const l of this._onFinishedListeners) {
            l();
        }
    }

    public registerOnProgress(callback: OnProgressCallback) {
        this._onProgressListeners.push(callback);
    }
    
    public registerOnFinished(callback: OnFinishedCallback) {
        this._onFinishedListeners.push(callback);

        /**
         * Fire finished callback if the loadState already
         * finished loading during registration
         */
        if (this._onFinished) {
            callback();
        }
    }
}