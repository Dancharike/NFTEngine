import {GameObject} from "@engine/core/GameObject";
import {Time} from "@engine/api/Time";
import {Camera} from "@engine/api/Camera";
import spline from "./Spline";

export class CameraObject extends GameObject
{
    private _t: number = 0;

    private onUpdate(): void
    {
        this._t += Time.deltaTime * 0.1;
        const p = (this._t % 10) / 10;

        Camera.current.position.copy(spline.getPointAt(p));
        Camera.current.lookAt(spline.getPointAt((p + 0.03) % 1));
    }
}
