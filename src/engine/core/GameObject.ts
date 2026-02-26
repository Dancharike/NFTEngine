import * as THREE from "three";
import {IMessage, IMessageHandler} from "./MessageBus";
import type {GameScene} from "./GameScene";

export abstract class GameObject implements IMessageHandler
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
    public set active(value: boolean)    {this._isActive = value;}
    public set scene(value: any)         {this._scene = value;}

    public load(): void
    {
        this.onLoad();
    }

    public update(deltaTime: number): void
    {
        this.onUpdate(deltaTime);
    }

    public onMessage(message: IMessage): void
    {
        this.onMessageReceive(message);
    }

    public destroy(): void
    {
        if(this._mesh && this._mesh.parent) {this._mesh.parent.remove(this._mesh);}

        if(this._scene) {this._scene.removeGameObject(this._id);}

        this.onDestroy();
    }

    protected onLoad(): void {}
    protected onUpdate(deltaTime: number): void {}
    protected onMessageReceive(message: IMessage): void {}
    protected onDestroy(): void {}

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
