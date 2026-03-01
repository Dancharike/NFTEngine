// DebugConsole.ts
import {DebugController} from "./DebugController";
import {CLEAR_SIGNAL} from "./installers/ConsoleCommandInstaller";
import {DebugCommandBase} from "./DebugCommand";

export class DebugConsole
{
    private _isOpen: boolean = false;
    private _input: string = "";
    private _history: string[] = [];
    private _suggestions: DebugCommandBase[] = [];
    private _selectedSuggestion: number = -1;

    private _container: HTMLDivElement;
    private _historyEl: HTMLDivElement;
    private _inputEl: HTMLInputElement;
    private _suggestionsEl: HTMLDivElement;

    public constructor(private readonly _controller: DebugController)
    {
        this.createDOM();
        this.injectStyles();
        this.bindEvents();
        this.printWelcome();
    }

    private createDOM(): void
    {
        this._container = document.createElement("div");
        this._container.id = "debug-console";

        const header = document.createElement("div");
        header.id = "debug-console-header";
        header.innerHTML = `<span>Debug Console</span>`;

        const closeBtn = document.createElement("button");
        closeBtn.id = "debug-console-close";
        closeBtn.textContent = "✕";
        closeBtn.addEventListener("click", () => this.toggle());
        header.appendChild(closeBtn);

        this._historyEl = document.createElement("div");
        this._historyEl.id = "debug-console-history";

        const inputRow = document.createElement("div");
        inputRow.id = "debug-console-input-row";

        const prompt = document.createElement("span");
        prompt.className = "prompt";
        prompt.textContent = ">";

        this._inputEl = document.createElement("input");
        this._inputEl.id = "debug-console-input";
        this._inputEl.type = "text";
        this._inputEl.autocomplete = "off";
        this._inputEl.spellcheck = false;

        inputRow.appendChild(prompt);
        inputRow.appendChild(this._inputEl);

        this._suggestionsEl = document.createElement("div");
        this._suggestionsEl.id = "debug-console-suggestions";

        this._container.appendChild(header);
        this._container.appendChild(this._historyEl);
        this._container.appendChild(inputRow);
        this._container.appendChild(this._suggestionsEl);

        document.body.appendChild(this._container);
    }

    private injectStyles(): void
    {
        const style = document.createElement("style");
        style.textContent = `
            #debug-console
            {
                display: none;
                flex-direction: column;
                position: fixed;
                top: 40px;
                right: 20px;
                width: 800px;
                height: 600px;
                min-width: 400px;
                min-height: 200px;
                background: #1e1e1e;
                border: 1px solid #333;
                border-radius: 6px;
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 13px;
                color: #ccc;
                z-index: 9999;
                box-shadow: 0 8px 32px rgba(0,0,0,0.7);
                resize: both;
                overflow: hidden;
            }

            #debug-console.open { display: flex; }

            #debug-console-header
            {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px 12px;
                background: #161616;
                border-bottom: 1px solid #333;
                cursor: move;
                user-select: none;
                font-weight: bold;
                color: #fff;
                flex-shrink: 0;
            }

            #debug-console-close
            {
                background: none;
                border: none;
                color: #aaa;
                cursor: pointer;
                font-size: 14px;
            }

            #debug-console-close:hover { color: #fff; }

            #debug-console-history
            {
                flex: 1;
                overflow-y: auto;
                padding: 8px 12px;
                background: #1a1a1a;
                white-space: pre-wrap;
                line-height: 1.6;
            }

            #debug-console-input-row
            {
                display: flex;
                align-items: center;
                padding: 6px 12px;
                border-top: 1px solid #333;
                background: #161616;
                gap: 8px;
                flex-shrink: 0;
            }

            .prompt { color: #55ff55; }

            #debug-console-input
            {
                flex: 1;
                background: transparent;
                border: none;
                outline: none;
                color: #fff;
                font-family: inherit;
                font-size: 13px;
            }

            #debug-console-suggestions
            {
                display: none;
                position: absolute;
                bottom: 38px;
                left: 12px;
                right: 12px;
                background: #252525;
                border: 1px solid #444;
                border-radius: 4px;
                overflow: hidden;
            }

            #debug-console-suggestions.visible { display: block; }

            .suggestion-item
            {
                padding: 4px 10px;
                cursor: pointer;
                color: #aaa;
            }

            .suggestion-item:hover,
            .suggestion-item.selected
            {
                background: #333;
                color: #fff;
            }

            .cmd-group  { color: #66ccff; font-weight: bold; }
            .cmd-format { color: #fff; }
            .ok         { color: #55ff55; }
            .err        { color: #ff5555; }
        `;

        document.head.appendChild(style);
    }

    private bindEvents(): void
    {
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.code === "Backquote") {e.preventDefault(); this.toggle(); return;}
            if(!this._isOpen) {return;}
            if(e.code === "Enter")     {e.preventDefault(); this.handleInput();}
            if(e.code === "Tab")       {e.preventDefault(); this.applySuggestion();}
            if(e.code === "ArrowDown") {e.preventDefault(); this.navigateSuggestions(1);}
            if(e.code === "ArrowUp")   {e.preventDefault(); this.navigateSuggestions(-1);}
        });

        window.addEventListener("resize", () => {
            if(this._isOpen) {this.clampToScreen();}
        });

        this._inputEl.addEventListener("input", () => {
            this._input = this._inputEl.value;
            this.updateSuggestions();
        });

        this.makeDraggable();
    }

    private toggle(): void
    {
        this._isOpen = !this._isOpen;
        this._container.classList.toggle("open", this._isOpen);
        if(this._isOpen) {this._inputEl.focus();}
    }

    private handleInput(): void
    {
        const trimmed = this._input.trim().toLowerCase();
        if(!trimmed) {return;}

        this.addHistory(`> ${trimmed}`, "ok");

        const parts = trimmed.split(" ", 2);
        const cmdId = parts[0];
        const arg   = parts[1] ?? null;

        const cmd = this._controller.registry.findExact(cmdId, this._controller.isDeveloperMode);
        if(cmd)
        {
            const {error, result} = cmd.tryExecute(arg);
            if(error)
            {
                this.addHistory(error, "err");
            }
            else if(result === CLEAR_SIGNAL)
            {
                this._history = [];
                this._historyEl.innerHTML = "";
                this.printWelcome();
            }
            else
            {
                if(result) {this.addHistory(result);}
                this.addHistory("Executed.", "ok");
            }
        }
        else
        {
            this.addHistory("Unknown command.", "err");
        }

        this._input = "";
        this._inputEl.value = "";
        this._suggestions = [];
        this._selectedSuggestion = -1;
        this.renderSuggestions();
        this._historyEl.scrollTop = this._historyEl.scrollHeight;
    }

    private addHistory(message: string, type?: "ok" | "err"): void
    {
        const line = document.createElement("div");
        line.innerHTML = type === "ok"  ? `<span class="ok">${message}</span>`
                       : type === "err" ? `<span class="err">${message}</span>`
                       : message;
        this._historyEl.appendChild(line);
    }

    private updateSuggestions(): void
    {
        this._suggestions = [];
        this._selectedSuggestion = -1;

        if(this._input.trim())
        {
            this._suggestions = this._controller.registry.findSuggestions(this._input, this._controller.isDeveloperMode);
            if(this._suggestions.length > 0) {this._selectedSuggestion = 0;}
        }

        this.renderSuggestions();
    }

    private renderSuggestions(): void
    {
        this._suggestionsEl.innerHTML = "";
        const visible = this._suggestions.slice(0, 6);

        if(visible.length === 0) {this._suggestionsEl.classList.remove("visible"); return;}

        this._suggestionsEl.classList.add("visible");
        visible.forEach((cmd, i) => {
            const item = document.createElement("div");
            item.className = "suggestion-item" + (i === this._selectedSuggestion ? " selected" : "");
            item.innerHTML = `<span class="cmd-format">${cmd.commandId}</span> <span style="color:#666">${cmd.commandDescription}</span>`;
            item.addEventListener("click", () => { this.applyIndex(i); });
            this._suggestionsEl.appendChild(item);
        });
    }

    private navigateSuggestions(dir: number): void
    {
        if(this._suggestions.length === 0) {return;}
        this._selectedSuggestion = (this._selectedSuggestion + dir + this._suggestions.length) % this._suggestions.length;
        this.renderSuggestions();
    }

    private applySuggestion(): void
    {
        this.applyIndex(this._selectedSuggestion);
    }

    private applyIndex(i: number): void
    {
        if(i < 0 || i >= this._suggestions.length) {return;}
        this._input = this._suggestions[i].commandId;
        this._inputEl.value = this._input;
        this._inputEl.focus();
        this._suggestions = [];
        this.renderSuggestions();
    }

    private printWelcome(): void
    {
        this.addHistory(`<span style="color:#444">${"&mdash;".repeat(80)}</span>`);
        this.addHistory(`Enter <span class="cmd-format">help</span> to see all available commands`);
        this.addHistory(`<span class="cmd-format">Tab</span> &mdash; autocomplete &nbsp; <span class="cmd-format">&uarr;&darr;</span> &mdash; navigate suggestions &nbsp; <span class="cmd-format">Enter</span> &mdash; execute`);
        this.addHistory(`<span style="color:#444">${"&mdash;".repeat(80)}</span>`);
    }

    private makeDraggable(): void
    {
        const header = this._container.querySelector("#debug-console-header") as HTMLElement;
        let startX = 0, startY = 0, startLeft = 0, startTop = 0;

        header.addEventListener("mousedown", (e: MouseEvent) => {
            startX = e.clientX;
            startY = e.clientY;
            startLeft = this._container.offsetLeft;
            startTop  = this._container.offsetTop;

            const onMove = (e: MouseEvent) => {
                this._container.style.left = `${startLeft + e.clientX - startX}px`;
                this._container.style.top = `${startTop  + e.clientY - startY}px`;
                this._container.style.right = "auto";
                this.clampToScreen();
            };

            const onUp = () => {
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
            };

            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
        });
    }

    private clampToScreen(): void
    {
        const rect = this._container.getBoundingClientRect();
        const clampedLeft = Math.max(0, Math.min(rect.left, window.innerWidth - rect.width));
        const clampedTop = Math.max(0, Math.min(rect.top, window.innerHeight - rect.height));
        this._container.style.left = `${clampedLeft}px`;
        this._container.style.top = `${clampedTop}px`;
    }
}
