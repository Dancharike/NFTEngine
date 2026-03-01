import * as THREE from "three";
import {TextureAsset} from "./AssetTypes";

export class Texture
{
    private _asset: TextureAsset;

    public constructor(asset: TextureAsset)
    {
        this._asset = asset;
    }

    public get name(): string           {return this._asset.name;}
    public get texture(): THREE.Texture {return this._asset.texture;}
    public get width(): number          {return this._asset.texture.image.width;}
    public get height(): number         {return this._asset.texture.image.height;}
    public get loaded(): boolean        {return this._asset.loaded;}

    public setFilter(min: THREE.MinificationTextureFilter, mag: THREE.MagnificationTextureFilter): void
    {
        this._asset.texture.minFilter = min;
        this._asset.texture.magFilter = mag;
        this._asset.texture.needsUpdate = true;
    }

    public setWrap(wrapS: THREE.Wrapping, wrapT: THREE.Wrapping): void
    {
        this._asset.texture.wrapS = wrapS;
        this._asset.texture.wrapT = wrapT;
        this._asset.texture.needsUpdate = true;
    }

    public dispose(): void
    {
        this._asset.texture.dispose();
    }
}
