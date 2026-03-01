import * as THREE from "three";

export class UICamera
{
    private _camera: THREE.OrthographicCamera;
    private _width: number;
    private _height: number;

    public constructor(width: number, height: number)
    {
        this._width = width;
        this._height = height;
        this._camera = this.createCamera();
    }

    public get camera(): THREE.OrthographicCamera {return this._camera;}
    public get width(): number                    {return this._width;}
    public get height(): number                   {return this._height;}

    private createCamera(): THREE.OrthographicCamera
    {
        const hw = this._width / 2;
        const hh = this._height / 2;
        const cam = new THREE.OrthographicCamera(-hw, hw, hh, -hh, 0.1, 100);
        cam.position.z = 10;
        return cam;
    }

    public onResize(width: number, height: number): void
    {
        this._width = width;
        this._height = height;

        const hw = width / 2;
        const hh = height / 2;

        this._camera.left = -hw;
        this._camera.right = hw;
        this._camera.top = hh;
        this._camera.bottom = -hh;
        this._camera.updateProjectionMatrix();
    }
}
