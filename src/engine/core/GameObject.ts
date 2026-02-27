import * as THREE from "three";
import {IMessage, IMessageHandler} from "./MessageBus";
import type {GameScene} from "./GameScene";
import {IPoolable} from "./ObjectPool";

interface IAwakable    {onAwake(): void;}
interface IStartable   {onStart(): void;}
interface IEnableable  {onEnable(): void;}
interface IDisableable {onDisable(): void;}
interface ILoadable    {onLoad(): void;}
interface IUpdatable   {onUpdate(): void;}
interface IDestroyable {onDestroy(): void;}
interface IResettable  {onReset(): void;}
interface IMessagable  {onMessageReceive(message: IMessage): void;}

export abstract class GameObject implements IMessageHandler, IPoolable
{
    protected _name: string;
    protected _id: string;
    protected _isActive: boolean = true;
    protected _isVisible: boolean = true;
    protected _mesh: THREE.Object3D | null = null;
    protected _scene: GameScene | null = null;

    public constructor(name: string)
    {
        this._name = name;
        this._id = this.generateId();
    }

    public get name(): string                {return this._name;}
    public get id(): string                  {return this._id;}
    public get isActive(): boolean           {return this._isActive;}
    public get isVisible(): boolean          {return this._isVisible;}
    public get mesh(): THREE.Object3D | null {return this._mesh;}
    
    public get x(): number               {return this._mesh?.position.x || 0;}
    public get y(): number               {return this._mesh?.position.y || 0;}
    public get z(): number               {return this._mesh?.position.z || 0;}
    public get scaleX(): number          {return this._mesh?.scale.x || 1;}
    public get scaleY(): number          {return this._mesh?.scale.y || 1;}
    public get scaleZ(): number          {return this._mesh?.scale.z || 1;}
    public get rotation(): number        {if(!this._mesh) return 0; return THREE.MathUtils.radToDeg(this._mesh.rotation.z);}
    public get depth(): number           {return this._mesh?.renderOrder || 0;}
    public get visible(): boolean        {return this._isVisible;}
    public get active(): boolean         {return this._isActive;}
    public get scene(): any              {return this._scene;}

    public set x(value: number)          {if(this._mesh) {this._mesh.position.x = value;}}
    public set y(value: number)          {if(this._mesh) {this._mesh.position.y = value;}}
    public set z(value: number)          {if(this._mesh) {this._mesh.position.z = value;}}
    public set scaleX(value: number)     {if(this._mesh) {this._mesh.scale.x = value;}}
    public set scaleY(value: number)     {if(this._mesh) {this._mesh.scale.y = value;}}
    public set scaleZ(value: number)     {if(this._mesh) {this._mesh.scale.z = value;}}
    public set rotation(degrees: number) {if(this._mesh) {this._mesh.rotation.z = THREE.MathUtils.degToRad(degrees);}}
    public set depth(value: number)      {if(this._mesh) {this._mesh.renderOrder = value;}}
    public set visible(value: boolean)   {this._isVisible = value; if(this._mesh) {this._mesh.visible = value;}}
    public set active(value: boolean)    {value ? this.enable() : this.disable();}
    public set scene(value: any)         {this._scene = value;}

    public awake(): void
    {
        if((this as unknown as IAwakable).onAwake)
        {
            (this as unknown as IAwakable).onAwake();
        }
    }

    public start(): void
    {
        if((this as unknown as IStartable).onStart)
        {
            (this as unknown as IStartable).onStart();
        }
    }

    public enable(): void
    {
        this._isActive = true;
        if(this._mesh) {this._mesh.visible = true;}
        
        if((this as unknown as IEnableable).onEnable)
        {
            (this as unknown as IEnableable).onEnable();
        }
    }

    public disable(): void
    {
        this._isActive = false;
        if(this._mesh) {this._mesh.visible = false;}

        if((this as unknown as IDisableable).onDisable)
        {
            (this as unknown as IDisableable).onDisable();
        }
    }
    
    public load(): void
    {
        if((this as unknown as ILoadable).onLoad)
        {
            (this as unknown as ILoadable).onLoad();
        }
    }

    public update(): void
    {
        if((this as unknown as IUpdatable).onUpdate)
        {
            (this as unknown as IUpdatable).onUpdate();
        }
    }

    public onMessage(message: IMessage): void
    {
        if((this as unknown as IMessagable).onMessageReceive)
        {
            (this as unknown as IMessagable).onMessageReceive(message);
        }
    }

    public destroy(): void
    {
        if(this._mesh && this._mesh.parent) {this._mesh.parent.remove(this._mesh);}

        if((this as unknown as IDestroyable).onDestroy)
        {
            (this as unknown as IDestroyable).onDestroy();
        }

        this._scene = null;
    }

    public destroySelf(): void
    {
        if(this._scene) {this._scene.removeGameObject(this._id);}
        else            {this.destroy();}
    }

    public activate(): void
    {
        this.enable();
    }

    public deactivate(): void
    {
        this.disable();
    }

    public reset(): void
    {
        if((this as unknown as IResettable).onReset)
        {
            (this as unknown as IResettable).onReset();
        }
    }

    public setActive(active: boolean): void
    {
        this._isActive = active
    }

    public setVisible(visible: boolean): void
    {
        this._isVisible = visible;
        if(this._mesh) {this._mesh.visible = visible;}
    }

    private generateId(): string
    {
        return `${this._name}_${crypto.randomUUID()}`;
    }
}
