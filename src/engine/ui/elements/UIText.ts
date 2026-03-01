import * as THREE from "three";
import {UIObject} from "../UIObject";
import {Anchor} from "../Anchor";

export class UIText extends UIObject
{
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _texture: THREE.CanvasTexture;

    private _text: string = "";
    private _fontSize: number = 24;
    private _colour: string = "#ffffff";
    private _font: string = "Consolas";
    private _width: number = 320;
    private _height: number = 160;

    public constructor(text: string, anchor: Anchor = Anchor.MiddleCenter, offsetX: number = 0, offsetY: number = 0)
    {
        super();
        this._text = text;
        this._anchor = anchor;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
    }

    public get text(): string {return this._text;}

    public setText(text: string): void
    {
        this._text = text;
        this.redraw();
    }

    public setStyle(fontSize: number, colour: string, font: string = "Consolas"): void
    {
        this._fontSize = fontSize;
        this._colour = colour;
        this._font = font;
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
        this._mesh.renderOrder = 999;

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
        this._ctx.fillStyle = this._colour;
        this._ctx.font = "${this._fontSize}px ${this._font}";
        this._ctx.textAlign = "left";
        this._ctx.textBaseline = "middle";
        this._ctx.fillText(this._text, 8, this._height / 2);

        if(this._texture) {this._texture.needsUpdate = true;}
    }
}
