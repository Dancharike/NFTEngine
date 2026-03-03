import {UIWindow} from "@engine/ui/elements/UIWindow";
import {NFTMetaData} from "@engine/nft/NFTGenerator";

export class NFTWindow
{
    private _window: UIWindow;
    private _previewEl: HTMLImageElement;
    private _metaEl: HTMLDivElement;
    private _generateBtn: HTMLButtonElement;
    private _mintBtn: HTMLButtonElement;

    private _onGenerate?: () => void;
    private _lastMeta: NFTMetaData | null = null;
    private _lastCanvas: HTMLCanvasElement | null = null;

    public constructor()
    {
        this._window = new UIWindow({
            title: "NFT GENERATOR",
            x: 10,
            y: window.innerHeight - 510,
            width: 340,
            height: 500,
            minWidth: 240,
            minHeight: 200,
        });
    }

    public mount(): void
    {
        this._window.mount();
        this.injectStyles();
        this.buildContent();
    }

    public unmount(): void
    {
        this._window.unmount();
    }

    public onGenerate(callback: () => void): void
    {
        this._onGenerate = callback;
    }

    public updatePreview(canvas: HTMLCanvasElement): void
    {
        this._previewEl.src = canvas.toDataURL();
        this._lastCanvas = canvas;
        this._mintBtn.disabled = false;
    }

    public updateMeta(meta: NFTMetaData): void
    {
        this._lastMeta = meta;
        this._metaEl.innerHTML = `
            ID:          <span>#${meta.id}</span><br>
            Seed:        <span>${meta.seed}</span><br>
            Octaves:     <span>${meta.octaves}</span><br>
            Persistence: <span>${meta.persistence}</span><br>
            Colour A:    <span style="color:${meta.colourA}">${meta.colourA}</span><br>
            Colour B:    <span style="color:${meta.colourB}">${meta.colourB}</span>
        `;
    }

    private prepareMintPayload(): void
    {
        if(!this._lastCanvas || !this._lastMeta) {return;}

        localStorage.setItem("nft_mint_payload", JSON.stringify({
            imageDataURL: this._lastCanvas.toDataURL("image/png"),
            metadata: this._lastMeta
        }));

        window.open("http://localhost:8080/mint.html", "_blank");
    }

    private buildContent(): void
    {
        const content = this._window.contentEl;

        this._previewEl = document.createElement("img");
        this._previewEl.className = "nft-preview-img";
        this._previewEl.alt = "NFT Preview";

        this._metaEl = document.createElement("div");
        this._metaEl.className = "nft-meta";
        this._metaEl.textContent = "No NFT generated yet.";

        const fontRow = document.createElement("div");
        fontRow.className = "nft-font-row";

        const fontLabel = document.createElement("span");
        fontLabel.className = "nft-font-label";
        fontLabel.textContent = "Font size: 12px";

        const fontSlider = document.createElement("input");
        fontSlider.type = "range";
        fontSlider.min = "10";
        fontSlider.max = "22";
        fontSlider.value = "12";
        fontSlider.className = "nft-font-slider";

        fontSlider.addEventListener("input", () => {
            const size = fontSlider.value;
            fontLabel.textContent = `Font size: ${size}px`;
            this._metaEl.style.fontSize = `${size}px`;
        });

        fontRow.appendChild(fontLabel);
        fontRow.appendChild(fontSlider);

        this._generateBtn = document.createElement("button");
        this._generateBtn.className = "nft-generate-btn";
        this._generateBtn.textContent = "⬡ GENERATE NFT";
        this._generateBtn.addEventListener("click", () => this._onGenerate?.());

        this._mintBtn = document.createElement("button");
        this._mintBtn.className = "nft-generate-btn nft-mint-btn";
        this._mintBtn.textContent = "⛓  MINT NFT";
        this._mintBtn.disabled = true;
        this._mintBtn.addEventListener("click", () => this.prepareMintPayload());

        content.appendChild(this._previewEl);
        content.appendChild(this._metaEl);
        content.appendChild(fontRow);
        content.appendChild(this._generateBtn);
        content.appendChild(this._mintBtn);
    }

    private injectStyles(): void
    {
        if(document.getElementById("nft-window-styles")) {return;}

        const style = document.createElement("style");
        style.id = "nft-window-styles";
        style.textContent = `
            .nft-preview-img {
                width: 100%;
                aspect-ratio: 1;
                object-fit: contain;
                border: 1px solid #ff00ff44;
                border-radius: 4px;
                background: #111;
                flex-shrink: 0;
                min-height: 0;
                max-height: 50%;
            }

            .nft-meta {
                font-family: Consolas, monospace;
                font-size: 12px;
                color: #ff00ff;
                line-height: 1.7;
                flex-shrink: 0;
            }

            .nft-meta span { color: #ffffff; }

            .nft-font-row {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-shrink: 0;
            }

            .nft-font-label {
                font-family: Consolas, monospace;
                font-size: 11px;
                color: #ff00ff88;
                white-space: nowrap;
                min-width: 100px;
            }

            .nft-font-slider {
                flex: 1;
                accent-color: #ff00ff;
                cursor: pointer;
            }

            .nft-generate-btn {
                padding: 8px;
                background: #1a001a;
                border: 1px solid #ff00ff;
                color: #ff00ff;
                font-family: Consolas, monospace;
                font-size: 13px;
                letter-spacing: 1px;
                cursor: pointer;
                border-radius: 4px;
                flex-shrink: 0;
            }

            .nft-generate-btn:hover:not(:disabled) { background: #2d002d; }
            .nft-generate-btn:disabled { opacity: 0.4; cursor: not-allowed; }

            .nft-mint-btn {
                border-color: #00ffff;
                color: #00ffff;
                margin-top: 4px;
            }

            .nft-mint-btn:hover:not(:disabled) { background: #001a1a; }
        `;

        document.head.appendChild(style);
    }
}
