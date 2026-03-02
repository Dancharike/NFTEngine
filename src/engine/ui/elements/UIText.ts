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
    private _align: CanvasTextAlign = "left";

    public constructor(text: string, anchor: Anchor = Anchor.MiddleCenter, offsetX: number = 0, offsetY: number = 0, width: number = 320, height: number = 160)
    {
        super();
        this._text = text;
        this._anchor = anchor;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._width = width;
        this._height = height;
    }

    public get text(): string {return this._text;}

    public setText(text: string): void
    {
        this._text = text;
        this.redraw();
    }

    public setStyle(fontSize: number, colour: string, font: string = "Consolas", align: CanvasTextAlign = "left"): void
    {
        this._fontSize = fontSize;
        this._colour = colour;
        this._font = font;
        this._align = align;
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

        const lines = this._text.split("\n");
        const lineHeight = this._fontSize * 1.4;
        const totalHeight = lines.length * lineHeight;
        const startY = (this._height - totalHeight) / 2 + this._fontSize / 2;

        const xPos = this._align === "center" ? this._width / 2
                   : this._align === "right"  ? this._width - 8
                   : 8;

        this._ctx.fillStyle = this._colour;
        this._ctx.font = `${this._fontSize}px ${this._font}`;
        this._ctx.textAlign = this._align;
        this._ctx.textBaseline = "middle";

        lines.forEach((line, i) => {
            this._ctx.fillText(line, xPos, startY + i * lineHeight);
        });

        if(this._texture) {this._texture.needsUpdate = true;}
    }
}
