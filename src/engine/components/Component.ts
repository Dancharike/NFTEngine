import {GameObject} from "@engine/core/GameObject";
import {IMessage} from "@engine/core/MessageBus";

export abstract class Component
{
    protected _owner: GameObject;
    protected _enabled: boolean = true;
    protected _name: string;

    public constructor(owner: GameObject, name: string)
    {
        this._owner = owner;
        this._name = name;
    }

    public get owner(): GameObject {return this._owner;}
    public get enabled(): boolean  {return this._enabled;}
    public get name(): string      {return this._name;}
    
    public setEnabled(enabled: boolean): void
    {
        this._enabled = enabled;
    }

    public load(): void {}
    public update(): void {}
    public destroy(): void {}
    public onMessage(message: IMessage): void {}
}
