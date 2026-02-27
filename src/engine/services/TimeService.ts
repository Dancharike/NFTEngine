import {IService} from "@engine/core/ServiceLocator";

export interface ITimeService extends IService
{
    readonly deltaTime: number;
    readonly elapsed: number;
    readonly fps: number;
    tick(deltaTime: number): void;
}

export class TimeService implements ITimeService
{
    private _deltaTime: number = 0;
    private _elapsed: number = 0;
    private _fps: number = 0;

    public get deltaTime(): number {return this._deltaTime;}
    public get elapsed(): number   {return this._elapsed;}
    public get fps(): number       {return this._fps;}

    public tick(deltaTime: number): void
    {
        this._deltaTime = deltaTime;
        this._elapsed += deltaTime;
        this._fps = (deltaTime > 0) ? Math.round(1 / deltaTime) : 0;
    }
}
