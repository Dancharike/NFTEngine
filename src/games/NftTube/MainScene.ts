import * as THREE from "three";
import {GameScene} from "@engine/core/GameScene";
import {TubeObject} from "./TubeObject";
import {FloaterObject} from "./FloaterObject";
import {CameraObject} from "./CameraObject";

export class MainScene extends GameScene
{
    protected async onLoad(): Promise<void>
    {
        this.renderScene.background = new THREE.Color(0x000000);
        this.renderScene.fog = new THREE.FogExp2(0x000000, 0.25);

        this.addGameObject(new TubeObject("Tube"));
        this.addGameObject(new FloaterObject("Floater"));
        this.addGameObject(new CameraObject("Camera"));
    }

    protected onUnload(): void {}
}
