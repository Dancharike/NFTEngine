import * as THREE from "three";
import {ServiceLocator} from "../core/ServiceLocator";
import {ServiceKeys} from "../services/ServiceKeys";
import {ICameraService} from "../services/CameraService";

export class Camera
{
    public static get current(): THREE.Camera {return ServiceLocator.get<ICameraService>(ServiceKeys.CAMERA).camera;}
}
