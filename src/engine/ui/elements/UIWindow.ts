export interface UIWindowConfig
{
    title: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
}

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export class UIWindow
{
    private _root: HTMLDivElement;
    private _content: HTMLDivElement;
    private _isMinimized: boolean = false;
    private _savedHeight: number;

    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private readonly _minWidth: number;
    private readonly _minHeight: number;

    public constructor(private readonly _config: UIWindowConfig)
    {
        this._x = _config.x ?? 10;
        this._y = _config.y ?? 10;
        this._width = _config.width ?? 360;
        this._height = _config.height ?? 480;
        this._minWidth = _config.minWidth ?? 200;
        this._minHeight = _config.minHeight ?? 80;
    }

    public get contentEl(): HTMLDivElement {return this._content;}

    public mount(): void
    {
        this.injectStyles();
        this._root = this.createRoot();
        document.body.appendChild(this._root);
        this.applyBounds();
        this.bindDrag();
        this.bindResizeHandles();
    }

    public unmount(): void
    {
        this._root?.remove();
    }

    public setContent(html: string): void
    {
        this._content.innerHTML = html;
    }

    private createRoot(): HTMLDivElement
    {
        const root = document.createElement("div");
        root.className = "ui-window";

        const header = document.createElement("div");
        header.className = "ui-window-header";

        const title = document.createElement("span");
        title.className = "ui-window-title";
        title.textContent = this._config.title;

        const controls = document.createElement("div");
        controls.className = "ui-window-controls";

        const minimizeBtn = document.createElement("button");
        minimizeBtn.textContent = "–";
        minimizeBtn.title = "Minimize";
        minimizeBtn.addEventListener("click", () => this.toggleMinimize());

        controls.appendChild(minimizeBtn);
        header.appendChild(title);
        header.appendChild(controls);

        this._content = document.createElement("div");
        this._content.className = "ui-window-content";

        const edges: ResizeEdge[] = ["n","s","e","w","ne","nw","se","sw"];
        for(const edge of edges)
        {
            const handle = document.createElement("div");
            handle.className = `ui-window-rz ui-window-rz-${edge}`;
            handle.dataset.edge = edge;
            root.appendChild(handle);
        }

        root.appendChild(header);
        root.appendChild(this._content);

        return root;
    }

    private applyBounds(): void
    {
        this._root.style.left = `${this._x}px`;
        this._root.style.top = `${this._y}px`;
        this._root.style.width = `${this._width}px`;
        this._root.style.height = `${this._height}px`;
    }

    private toggleMinimize(): void
    {
        this._isMinimized = !this._isMinimized;

        if(this._isMinimized)
        {
            this._savedHeight = this._height;
            this._content.style.display = "none";
            this._root.style.height = "36px";
        }
        else
        {
            this._content.style.display = "";
            this._root.style.height = `${this._savedHeight}px`;
        }
    }

    private bindDrag(): void
    {
        const header = this._root.querySelector(".ui-window-header") as HTMLElement;
        let startX = 0, startY = 0, startLeft = 0, startTop = 0;

        header.addEventListener("mousedown", (e: MouseEvent) => {
            if((e.target as HTMLElement).tagName === "BUTTON") {return;}
            e.preventDefault();

            startX = e.clientX;
            startY = e.clientY;
            startLeft = this._root.offsetLeft;
            startTop = this._root.offsetTop;

            const onMove = (e: MouseEvent) => {
                this._x = startLeft + e.clientX - startX;
                this._y = startTop + e.clientY - startY;
                this.clamp();
                this._root.style.left = `${this._x}px`;
                this._root.style.top = `${this._y}px`;
            };

            const onUp = () => {
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
            };

            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
        });
    }

    private bindResizeHandles(): void
    {
        const handles = this._root.querySelectorAll<HTMLElement>(".ui-window-rz");

        handles.forEach(handle => {
            handle.addEventListener("mousedown", (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();

                const edge = handle.dataset.edge as ResizeEdge;
                const startX = e.clientX;
                const startY = e.clientY;
                const startL = this._x;
                const startT = this._y;
                const startW = this._width;
                const startH = this._height;

                const onMove = (e: MouseEvent) => {
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;

                    let newL = startL;
                    let newT = startT;
                    let newW = startW;
                    let newH = startH;

                    if(edge.includes("e")) {newW = Math.max(this._minWidth,  startW + dx);}
                    if(edge.includes("w")) {
                        newW = Math.max(this._minWidth,  startW - dx);
                        newL = startL + startW - newW;
                    }

                    if(edge.includes("s")) {newH = Math.max(this._minHeight, startH + dy);}
                    if(edge.includes("n")) {
                        newH = Math.max(this._minHeight, startH - dy);
                        newT = startT + startH - newH;
                    }

                    this._x = newL;
                    this._y = newT;
                    this._width = newW;
                    this._height = newH;

                    this._root.style.left = `${newL}px`;
                    this._root.style.top = `${newT}px`;
                    this._root.style.width = `${newW}px`;
                    this._root.style.height = `${newH}px`;
                };

                const onUp = () => {
                    window.removeEventListener("mousemove", onMove);
                    window.removeEventListener("mouseup", onUp);
                };

                window.addEventListener("mousemove", onMove);
                window.addEventListener("mouseup", onUp);
            });
        });
    }

    private clamp(): void
    {
        this._x = Math.max(0, Math.min(this._x, window.innerWidth - this._width));
        this._y = Math.max(0, Math.min(this._y, window.innerHeight - this._height));
    }

    private injectStyles(): void
    {
        if(document.getElementById("ui-window-styles")) {return;}

        const style = document.createElement("style");
        style.id = "ui-window-styles";
        style.textContent = `
            .ui-window {
                position: fixed;
                background: #0d0d1a;
                border: 1px solid #ff00ff;
                border-radius: 6px;
                display: flex;
                flex-direction: column;
                z-index: 9000;
                box-shadow: 0 0 20px rgba(255,0,255,0.2);
                overflow: hidden;
                box-sizing: border-box;
            }

            .ui-window-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px 10px;
                background: #1a001a;
                border-bottom: 1px solid #ff00ff;
                cursor: move;
                user-select: none;
                flex-shrink: 0;
                height: 36px;
                box-sizing: border-box;
            }

            .ui-window-title {
                font-family: Consolas, monospace;
                font-size: 13px;
                color: #ff00ff;
                letter-spacing: 1px;
            }

            .ui-window-controls button {
                background: none;
                border: 1px solid #ff00ff44;
                color: #ff00ff;
                cursor: pointer;
                font-size: 14px;
                width: 22px;
                height: 22px;
                border-radius: 3px;
                line-height: 1;
                padding: 0;
            }

            .ui-window-controls button:hover { background: #ff00ff22; }

            .ui-window-content {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px;
                box-sizing: border-box;
                min-height: 0;
            }

            .ui-window-rz {
                position: absolute;
                z-index: 10;
            }

            .ui-window-rz-n  { top: -4px;    left: 8px;    right: 8px;   height: 8px;  cursor: n-resize;  }
            .ui-window-rz-s  { bottom: -4px; left: 8px;    right: 8px;   height: 8px;  cursor: s-resize;  }
            .ui-window-rz-e  { right: -4px;  top: 8px;     bottom: 8px;  width: 8px;   cursor: e-resize;  }
            .ui-window-rz-w  { left: -4px;   top: 8px;     bottom: 8px;  width: 8px;   cursor: w-resize;  }
            .ui-window-rz-ne { top: -4px;    right: -4px;  width: 12px;  height: 12px; cursor: ne-resize; }
            .ui-window-rz-nw { top: -4px;    left: -4px;   width: 12px;  height: 12px; cursor: nw-resize; }
            .ui-window-rz-se { bottom: -4px; right: -4px;  width: 12px;  height: 12px; cursor: se-resize; }
            .ui-window-rz-sw { bottom: -4px; left: -4px;   width: 12px;  height: 12px; cursor: sw-resize; }
        `;

        document.head.appendChild(style);
    }
}
