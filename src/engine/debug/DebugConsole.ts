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
        this._container = document.getElementById("debug-console") as HTMLDivElement;
        this._historyEl = document.getElementById("debug-console-history") as HTMLDivElement;
        this._inputEl = document.getElementById("debug-console-input") as HTMLInputElement;
        this._suggestionsEl = document.getElementById("debug-console-suggestions") as HTMLDivElement;

        this.bindEvents();
        this.printWelcome();
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

        this._inputEl = this._container.querySelector("#debug-console-input")!;
        this._historyEl = this._container.querySelector("#debug-console-history")!;
        this._suggestionsEl = this._container.querySelector("#debug-console-suggestions")!;

        this._inputEl.addEventListener("input", () => {
            this._input = this._inputEl.value;
            this.updateSuggestions();
        });

        this._container.querySelector("#debug-console-close")!.addEventListener("click", () => this.toggle());

        this.makeDraggable();
    }

    private toggle(): void
    {
        this._isOpen = !this._isOpen;
        this._container.classList.toggle("open", this._isOpen);
        if(this._isOpen) { this._inputEl.focus(); }
    }

    private handleInput(): void
    {
        const trimmed = this._input.trim().toLowerCase();
        if(!trimmed) return;

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
                if(result) this.addHistory(result);
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

            if(this._suggestions.length > 0) this._selectedSuggestion = 0;
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
        this.addHistory(`<span style="color:#444">${"─".repeat(80)}</span>`);
        this.addHistory(`Enter <span class="cmd-format">help</span> to see all available commands`);
        this.addHistory(`<span class="cmd-format">Tab</span> — autocomplete &nbsp; <span class="cmd-format">↑↓</span> — navigate suggestions &nbsp; <span class="cmd-format">Enter</span> — execute`);
        this.addHistory(`<span style="color:#444">${"─".repeat(80)}</span>`);
    }

    private makeDraggable(): void
    {
        const header = this._container.querySelector("#debug-console-header") as HTMLElement;
        let startX = 0, startY = 0, startLeft = 0, startTop = 0;

        header.addEventListener("mousedown", (e: MouseEvent) => {
            startX = e.clientX;
            startY = e.clientY;
            startLeft = this._container.offsetLeft;
            startTop = this._container.offsetTop;

            const onMove = (e: MouseEvent) => {
                let newLeft = startLeft + e.clientX - startX;
                let newTop  = startTop  + e.clientY - startY;

                this._container.style.left  = `${newLeft}px`;
                this._container.style.top   = `${newTop}px`;
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

        const minLeft = 0;
        const minTop = 0;
        const maxLeft = window.innerWidth - rect.width;
        const maxTop = window.innerHeight - rect.height;

        const clampedLeft = Math.max(minLeft, Math.min(rect.left, maxLeft));
        const clampedTop = Math.max(minTop, Math.min(rect.top, maxTop));

        this._container.style.left = `${clampedLeft}px`;
        this._container.style.top = `${clampedTop}px`;
    }
}
