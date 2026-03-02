import * as THREE from "three";
import {UIObject} from "../UIObject";
import {Anchor} from "../Anchor";

export class UIButton extends UIObject
{
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _texture: THREE.CanvasTexture;

    private _label: string = "";
    private _width: number = 320;
    private _height: number = 80;
    private _bgColour: string = "#ffffff";
    private _textColour: string = "#000000";
    private _hoverColour: string = "#eeeeee";
    private _fontSize: number = 20;
    private _font: string = "Consolas";
    private _isHovered: boolean = false;

    private _onClick?: () => void;

    public constructor(label: string, anchor: Anchor = Anchor.MiddleCenter, offsetX: number = 0, offsetY: number = 0, width: number = 320, height: number = 80)
    {
        super();
        this._label = label;
        this._anchor = anchor;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._width = width;
        this._height = height;
    }

    public onClick(callback: () => void): void
    {
        this._onClick = callback;
    }

    public setStyle(bgColour: string, textColour: string, hoverColour: string, fontSize: number = 20, font: string = "Consolas"): void
    {
        this._bgColour = bgColour;
        this._textColour = textColour;
        this._hoverColour = hoverColour;
        this._fontSize = fontSize;
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
        this.bindEvents();
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

        this._ctx.fillStyle = this._isHovered ? this._hoverColour : this._bgColour;
        this._ctx.strokeStyle = this._textColour;
        this._ctx.lineWidth = 2;
        this._ctx.beginPath();
        this._ctx.roundRect(2, 2, this._width - 4, this._height - 4, 8);
        this._ctx.fill();
        this._ctx.stroke();

        this._ctx.fillStyle = this._textColour;
        this._ctx.font = `bold ${this._fontSize}px ${this._font}`;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
        this._ctx.fillText(this._label, this._width / 2, this._height / 2);

        if(this._texture) {this._texture.needsUpdate = true;}
    }

    private bindEvents(): void
    {
        window.addEventListener("click", (e: MouseEvent) => {
            if(this.hitTest(e.clientX, e.clientY)) {this._onClick?.();}
        });

        window.addEventListener("mousemove", (e: MouseEvent) => {
            const hit = this.hitTest(e.clientX, e.clientY);
            if(hit !== this._isHovered)
            {
                this._isHovered = hit;
                this.redraw();
            }
        });
    }

    private hitTest(clientX: number, clientY: number): boolean
    {
        if(!this._mesh) {return false;}

        const hw = this._width / 2;
        const hh = this._height / 2;

        const worldX = this._mesh.position.x;
        const worldY = this._mesh.position.y;

        const mx = clientX - window.innerWidth / 2;
        const my = -clientY + window.innerHeight / 2;

        return mx >= worldX - hw && mx <= worldX + hw && my >= worldY - hh && my <= worldY + hh;
    }
}
