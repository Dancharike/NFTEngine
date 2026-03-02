import * as THREE from "three";
import {GameScene} from "@engine/core/GameScene";
import {Scene} from "@engine/api/Scene";
import {TubeObject} from "./TubeObject";
import {FloaterObject} from "./FloaterObject";
import {CameraObject} from "./CameraObject";
import {CubeObject} from "./CubeObject";

export class MainScene extends GameScene
{
    private _cubes: CubeObject[] = [];
    
    protected async onLoad(): Promise<void>
    {
        Scene.setBackground(this, 0x000000);
        Scene.setFog(this, 0x000000, 0.25);

        this.addGameObject(new TubeObject());
        this.addGameObject(new FloaterObject(this._cubes));
        this.addGameObject(new CameraObject());
    }

    public applyNFTTexture(index: number, texture: THREE.Texture): void
    {
        if(index < this._cubes.length)
        {
            this._cubes[index].setNFTTexture(texture);
        }
    }

    protected onUnload(): void
    {
        this._cubes = [];
    }
}
