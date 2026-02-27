import {Time} from "@engine/api/Time";

export class FpsGraphWidget
{
    private static _instance: FpsGraphWidget;
    public static get instance(): FpsGraphWidget {return FpsGraphWidget._instance;}

    private readonly _el: HTMLDivElement;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _ctx: CanvasRenderingContext2D;
    private readonly _samples: number[] = new Array(200).fill(0);
    private _visible: boolean = false;

    public constructor()
    {
        FpsGraphWidget._instance = this;
        this._el = document.getElementById("fps-graph-widget") as HTMLDivElement;
        this._canvas = document.getElementById("fps-graph-canvas") as HTMLCanvasElement;
        this._ctx = this._canvas.getContext("2d")!;
    }

    public get isVisible(): boolean {return this._visible;}

    public toggle(): void
    {
        this._visible = !this._visible;
        this._el.classList.toggle("visible", this._visible);
    }

    public update(): void
    {
        if(!this._visible) {return;}

        this._samples.push(Time.fps);
        this._samples.shift();

        const ctx = this._ctx;
        const w = this._canvas.width;
        const h = this._canvas.height;
        const max = Math.max(...this._samples, 60);

        ctx.clearRect(0, 0, w, h);

        const barW = w / this._samples.length;

        this._samples.forEach((fps, i) => {
            const ratio = fps / max;
            const barH = h * ratio;
            ctx.fillStyle = fps >= 60 ? "#00ff00" : fps >= 30 ? "#ffff00" : "#ff4444";
            ctx.fillRect(i * barW, h - barH, barW, barH);
        });
    }
}
