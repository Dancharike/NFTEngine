import {Time} from "@engine/api/Time";

export class FpsWidget
{
    private static _instance: FpsWidget;
    public static get instance(): FpsWidget {return FpsWidget._instance;}

    private readonly _el: HTMLDivElement;
    private _visible: boolean = false;

    public constructor()
    {
        FpsWidget._instance = this;
        this._el = document.getElementById("fps-widget") as HTMLDivElement;
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

        const fps = Time.fps;
        const color = fps >= 60 ? "#00ff00" : fps >= 30 ? "#ffff00" : "#ff4444";
        this._el.style.color = color;
        this._el.textContent = `FPS: ${fps}`;
    }
}
