import * as THREE from "three";
import {Anchor, resolveAnchor} from "../ui/Anchor";

export abstract class UIObject
{
    protected _mesh: THREE.Object3D | null = null;
    protected _anchor: Anchor = Anchor.MiddleCenter;
    protected _offsetX: number = 0;
    protected _offsetY: number = 0;
    protected _visible: boolean = true;

    private _dirty: boolean = true;

    public get mesh(): THREE.Object3D | null {return this._mesh;}
    public get visible(): boolean            {return this._visible;}

    public set anchor(value: Anchor)         {this._anchor = value; this._dirty = true;}
    public set offsetX(value: number)        {this._offsetX = value; this._dirty = true;}
    public set offsetY(value: number)        {this._offsetY = value; this._dirty = true;}
    public set visible(value: boolean)       {this._visible = value; if(this._mesh) {this._mesh.visible = value;}}

    public onResize(screenWidth: number, screenHeight: number): void
    {
        this._dirty = true;
        this.updatePosition(screenWidth, screenHeight);
    }

    public updatePosition(screenWidth: number, screenHeight: number): void
    {
        if(!this._mesh || !this._dirty) {return;}

        const origin = resolveAnchor(this._anchor, screenWidth, screenHeight);
        this._mesh.position.x = origin.x + this._offsetX;
        this._mesh.position.y = origin.y + this._offsetY;
        this._dirty = false;
    }

    public abstract load(): void;
    public abstract update(): void;
    public abstract destroy(): void;
}
