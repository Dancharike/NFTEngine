import {GameScene} from "@engine/core/GameScene";
import {Scene} from "@engine/api/Scene";
import {TubeObject} from "./TubeObject";
import {FloaterObject} from "./FloaterObject";
import {CameraObject} from "./CameraObject";

export class MainScene extends GameScene
{
    protected async onLoad(): Promise<void>
    {
        Scene.setBackground(this, 0x000000);
        //Scene.setFog(this, 0x000000, 0.25);

        this.addGameObject(new TubeObject());
        this.addGameObject(new FloaterObject());
        this.addGameObject(new CameraObject());
    }

    protected onUnload(): void {}
}
