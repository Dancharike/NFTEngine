import * as THREE from "three";
import {IService} from "@engine/core/ServiceLocator";

export interface ICameraService extends IService
{
    readonly camera: THREE.Camera;
    setCamera(camera: THREE.Camera): void;
}

export class CameraService implements ICameraService
{
    private _camera: THREE.Camera;

    public get camera(): THREE.Camera {return this._camera;}

    public setCamera(camera: THREE.Camera): void
    {
        this._camera = camera;
    }
}
