import * as THREE from "three";
import {UIObject} from "../UIObject";
import {Anchor} from "../Anchor";

export class UIPanel extends UIObject
{
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _texture: THREE.CanvasTexture;

    private _width: number = 600;
    private _height: number = 300;
    private _bgColour: string = "#000000";
    private _border: string = "#ffffff";
    private _alpha: number = 1;

    public constructor(width: number, height: number, anchor: Anchor = Anchor.MiddleCenter, offsetX: number, offsetY: number)
    {
        super();
        this._width = width;
        this._height = height;
        this._anchor = anchor;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
    }

    public setStyle(bgColour: string, border: string, alpha: number): void
    {
        this._bgColour = bgColour;
        this._border = border;
        this._alpha = alpha;
        this.redraw();
    }

    public load(): void
    {
        this._canvas = document.createElement("canvas");
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this._ctx = this._canvas.getContext("2d")!;
        this._texture = new THREE.CanvasTexture(this._canvas);

        const geo = new THREE.PlaneGeometry(this._width, this._height);
        const mat = new THREE.MeshBasicMaterial({
            map: this._texture,
            transparent: true,
            depthTest: false,
        });

        this._mesh = new THREE.Mesh(geo, mat);
        this._mesh.renderOrder = 998;

        this.redraw();
    }

    public update(): void {}

    public destroy(): void
    {
        this._texture?.dispose();
        (this._mesh as THREE.Mesh)?.geometry.dispose();
    }

    private redraw(): void
    {
        if(!this._ctx) {return;}

        this._ctx.clearRect(0, 0, this._width, this._height);

        this._ctx.globalAlpha = this._alpha;
        this._ctx.fillStyle = this._bgColour;
        this._ctx.strokeStyle = this._border;
        this._ctx.lineWidth = 2;

        this._ctx.beginPath();
        this._ctx.roundRect(2, 2, this._width - 4, this._height - 4, 12);
        this._ctx.fill();
        this._ctx.stroke();

        this._ctx.globalAlpha = 1;

        if(this._texture) {this._texture.needsUpdate = true;}
    }
}
