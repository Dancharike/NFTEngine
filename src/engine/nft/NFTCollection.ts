import * as THREE from "three";
import {NFTMetaData, NFTGenerator} from "./NFTGenerator";

export class NFTCollection
{
    private _slots: (THREE.CanvasTexture | null)[];
    private _meta: (NFTMetaData | null)[];
    private _current: number = 0;
    private _total: number = 0;
    private _size: number;

    public constructor(size: number)
    {
        this._size = size;
        this._slots = new Array(size).fill(null);
        this._meta = new Array(size).fill(null);
    }

    public get totalGenerated(): number {return this._total;}
    public get size(): number           {return this._size;}

    public generate(): {index: number, texture: THREE.CanvasTexture, metadata: NFTMetaData}
    {
        const index = this._current % this._size;

        if(this._slots[index])
        {
            this._slots[index]!.dispose();
        }

        const {texture, metadata} = NFTGenerator.generate(this._total);

        this._slots[index] = texture;
        this._meta[index] = metadata;
        this._current = (this._current + 1) % this._size;
        this._total++;

        return {index, texture, metadata};
    }

    public getMetaData(index: number): NFTMetaData | null
    {
        return this._meta[index] || null;
    }
}
