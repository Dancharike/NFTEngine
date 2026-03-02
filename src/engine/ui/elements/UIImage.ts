import * as THREE from "three";
import {UIObject} from "../UIObject";
import {Anchor} from "../Anchor";

export class UIImage extends UIObject
{
    private _texture: THREE.Texture | null = null;
    private _material: THREE.MeshBasicMaterial | null = null;
    private _width: number;
    private _height: number;

    public constructor(anchor: Anchor = Anchor.MiddleCenter, offsetX: number = 0, offsetY: number = 0, width: number = 16, height: number = 16)
    {
        super();
        this._anchor = anchor;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._width = width;
        this._height = height;
    }

    public setTexture(texture: THREE.Texture): void
    {
        this._texture = texture;
        if(this._material)
        {
            this._material.map = texture;
            this._material.color.set(0xffffff);
            this._material.needsUpdate = true;
        }
    }

    public load(): void
    {
        const geo = new THREE.PlaneGeometry(this._width, this._height);
        this._material = new THREE.MeshBasicMaterial({
            transparent: true,
            depthTest: false,
            color: 0x333333
        });

        this._mesh = new THREE.Mesh(geo, this._material);
        this._mesh.renderOrder = 999;

        if(this._texture) {this.setTexture(this._texture);}
    }

    public update(): void {}

    public destroy(): void
    {
        (this._mesh as THREE.Mesh)?.geometry.dispose();
        this._material?.dispose();
    }
}
