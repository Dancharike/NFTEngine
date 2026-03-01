import * as THREE from "three";
import {GeometryAsset} from "./AssetTypes";

export class Material
{
    private _asset: GeometryAsset;

    public constructor(asset: GeometryAsset)
    {
        this._asset = asset;
    }

    public get name(): string                   {return this._asset.name;}
    public get geometry(): THREE.BufferGeometry {return this._asset.geometry;}
    public get vertices(): number               {return this._asset.vertices;}
    public get loaded(): boolean                {return this._asset.loaded;}

    public computeNormals(): void
    {
        this._asset.geometry.computeVertexNormals();
    }

    public dispose(): void
    {
        this._asset.geometry.dispose();
    }
}
