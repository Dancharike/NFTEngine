import * as THREE from "three";
import {UIObject} from "./UIObject";
import {UICamera} from "./UICamera";

export class UIScene
{
    private _scene: THREE.Scene = new THREE.Scene();
    private _camera: UICamera;
    private _objects: UIObject[] = [];

    public constructor(width: number, height: number)
    {
        this._camera = new UICamera(width, height);
    }

    public get scene(): THREE.Scene               {return this._scene;}
    public get camera(): THREE.OrthographicCamera {return this._camera.camera;}

    public add(object: UIObject): void
    {
        object.load();
        object.updatePosition(this._camera.width, this._camera.height);
        this._objects.push(object);
        if(object.mesh) {this._scene.add(object.mesh);}
    }

    public update(): void
    {
        for(const obj of this._objects) {obj.update();}
    }

    public remove(object: UIObject): void
    {
        this._objects = this._objects.filter(o => o !== object);
        if(object.mesh) {this._scene.remove(object.mesh);}
        object.destroy();
    }

    public onResize(width: number, height: number): void
    {
        this._camera.onResize(width, height);
        for(const obj of this._objects) {obj.onResize(width, height);}
    }

    public clear(): void
    {
        for(const obj of this._objects) {obj.destroy();}
        this._objects = [];
        while(this._scene.children.length > 0) {this._scene.remove(this._scene.children[0]);}
    }
}
