import * as THREE from "three";
import {GameObject} from "@engine/core/GameObject";
import {Time} from "@engine/api/Time";
import {Mesh} from "@engine/api/Mesh";

export class CubeObject extends GameObject
{
    private _rotationSpeed: {x: number, y: number, z: number};
    private _edgesMesh: any = null;

    public constructor()
    {
        super("Cube");
    }

    private onLoad(): void
    {
        this._mesh = Mesh.createBox(0.075, 0x111111, true, 1);
        this._edgesMesh = Mesh.createEdgesFromMesh(this._mesh as any, 0xff00ff);

        Mesh.addChild(this._mesh, this._edgesMesh);

        this._rotationSpeed = Mesh.randomRotationSpeed();
    }

    private onUpdate(): void
    {
        if(!this._mesh) {return;}
        Mesh.rotate(this._mesh, this._rotationSpeed, Time.deltaTime);
    }

    public setEdgeColour(color: number): void
    {
        if(!this._edgesMesh) {return;}
        Mesh.setColour(this._edgesMesh, color);
    }

    public setNFTTexture(texture: any): void
    {
        if(!this._mesh) {return;}
        const mat = (this._mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.map = texture;
        mat.color.set(0xffffff);
        mat.transparent = false;
        mat.needsUpdate = true;
    }
}