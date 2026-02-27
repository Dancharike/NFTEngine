import * as THREE from "three";

export class Renderer
{
    private _internal: THREE.WebGLRenderer;

    public constructor(canvasElement: HTMLCanvasElement)
    {
        let params: THREE.WebGLRendererParameters = {
            canvas: canvasElement,
            antialias: false,
            alpha: false
        }

        this._internal = new THREE.WebGLRenderer(params);
        this._internal.shadowMap.enabled = true;
        this._internal.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    public get internal(): THREE.WebGLRenderer {return this._internal;}

    public render(scene: THREE.Scene, camera: THREE.Camera): void
    {
        this._internal.render(scene, camera);
    }

    public onResize(width: number, height: number): void
    {
        this._internal.setSize(width, height);
        this._internal.setPixelRatio(window.devicePixelRatio);
    }

    public dispose(): void
    {
        this._internal.dispose();
    }
}
