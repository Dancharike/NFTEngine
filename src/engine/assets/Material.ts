import * as THREE from "three";
import {MaterialAsset} from "./AssetTypes";

export class Material
{
    private _asset: MaterialAsset;

    public constructor(asset: MaterialAsset)
    {
        this._asset = asset;
    }

    public get name(): string             {return this._asset.name;}
    public get material(): THREE.Material {return this._asset.material;}
    public get loaded(): boolean          {return this._asset.loaded;}

    public setOpacity(value: number): void
    {
        this._asset.material.opacity = value;
        this._asset.material.transparent = value < 1;
        this._asset.material.needsUpdate = true;
    }

    public setColour(colour: number | string): void
    {
        const mat = this._asset.material as any;
        if(mat.color) {mat.color.set(colour);}
    }

    public setWireframe(value: boolean): void
    {
        const mat = this._asset.material as any;
        if("wireframe" in mat) {mat.wireframe = value;}
    }

    public dispose(): void
    {
        this._asset.material.dispose();
    }
}
