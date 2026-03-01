import * as THREE from "three";
import {SpriteAsset} from "./AssetTypes";
import {Time} from "@engine/api/Time";

export class Sprite
{
    private _asset: SpriteAsset;
    private _currentFrame: number = 0;
    private _animationTime: number = 0;
    private _isPlaying: boolean = false;
    private _mesh: THREE.Mesh | null = null;
    
    private _onAnimationEnd?: () => void;
    private _onFrameChange?: (frame: number) => void;

    public constructor(asset: SpriteAsset)
    {
        this._asset = asset;
    }

    public get name(): string            {return this._asset.name;}
    public get frameCount(): number      {return this._asset.frameCount;}
    public get currentFrame(): number    {return this._currentFrame;}
    public get fps(): number             {return this._asset.fps;}
    public get isPlaying(): boolean      {return this._isPlaying;}
    public get mesh(): THREE.Mesh | null {return this._mesh;}

    public createMesh(width?: number, height?: number): THREE.Mesh
    {
        const w = width || this._asset.frameWidth;
        const h = height || this._asset.frameHeight;
        const geo = new THREE.PlaneGeometry(w, h);
        const mat = new THREE.MeshBasicMaterial({
            map: this._asset.texture,
            transparent: true,
            side: THREE.DoubleSide
        });

        this._mesh = new THREE.Mesh(geo, mat);
        this.updateUVs();

        return this._mesh;
    }

    public update(): void
    {
        if(!this._isPlaying) {return;}

        this._animationTime += Time.deltaTime;
        const frameDuration = 1 / this._asset.fps;

        if(this._animationTime >= frameDuration)
        {
            this._animationTime -= frameDuration;

            const oldFrame = this._currentFrame;
            this._currentFrame++;

            if(this._currentFrame >= this._asset.frameCount)
            {
                if(this._asset.loop)
                {
                    this._currentFrame = 0;
                }
                else
                {
                    this._currentFrame = this._asset.frameCount - 1;
                    this._isPlaying = false;
                    this._onAnimationEnd?.();
                }
            }

            if(oldFrame !== this._currentFrame)
            {
                this.updateUVs();
                this._onFrameChange?.(this._currentFrame);
            }
        }
    }

    public setFrame(frame: number): void
    {
        this._currentFrame = Math.max(0, Math.min(frame, this._asset.frameCount - 1));
        this.updateUVs();
    }

    public play(): void
    {
        this._isPlaying = true;
    }

    public pause(): void
    {
        this._isPlaying = false;
    }

    public stop(): void
    {
        this._isPlaying = false;
        this._currentFrame = 0;
        this._animationTime = 0;
        this.updateUVs();
    }

    public restart(): void
    {
        this._currentFrame = 0;
        this._animationTime = 0;
        this._isPlaying = true;
        this.updateUVs();
    }

    public onAnimationEnd(callback: () => void): void
    {
        this._onAnimationEnd = callback;
    }

    public onFrameChange(callback: () => void): void
    {
        this._onFrameChange = callback;
    }

    private updateUVs(): void
    {
        if(!this._mesh) {return;}

        const geo = this._mesh.geometry as THREE.PlaneGeometry;
        const uvAttribute = geo.attributes.uvs;

        const frameX = this._currentFrame % this._asset.framesPerRow;
        const frameY = Math.floor(this._currentFrame / this._asset.framesPerRow);

        const frameWidthUV = this._asset.frameWidth / this._asset.texture.image.width;
        const frameHeightUV = this._asset.frameHeight / this._asset.texture.image.height;

        const uMin = frameX * frameWidthUV;
        const uMax = uMin + frameWidthUV;
        const vMin = 1 - (frameY + 1) * frameHeightUV;
        const vMax = vMin + frameHeightUV;

        uvAttribute.setXY(0, uMin, vMax);
        uvAttribute.setXY(1, uMax, vMax);
        uvAttribute.setXY(2, uMin, vMin);
        uvAttribute.setXY(3, uMax, vMin);

        uvAttribute.needsUpdate = true;
    }
}
