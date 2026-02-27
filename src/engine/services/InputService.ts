import {IService} from "@engine/core/ServiceLocator";

export interface IInputService extends IService
{
    isKeyPressed(key: string): boolean;
    isKeyDown(key: string): boolean;
    isKeyUp(key: string): boolean;
    getMousePosition(): {x: number, y: number};
    isMouseButtonPressed(button: number): boolean;
    isMouseButtonDown(button: number): boolean;
    isMouseButtonUp(button: number): boolean;
}

export class InputService implements IInputService
{
    private _keys: Map<string, boolean> = new Map();
    private _keysDown: Map<string, boolean> = new Map();
    private _keysUp: Map<string, boolean> = new Map();
    private _mousePosition: {x: number, y: number} = {x: 0, y: 0};
    private _mouseButtons: Map<number, boolean> = new Map();
    private _mouseButtonsDown: Map<number, boolean> = new Map();
    private _mouseButtonsUp: Map<number, boolean> = new Map();

    public constructor()
    {
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if(!e.isTrusted) {return;}
            if(!this._keys.get(e.code)) {this._keysDown.set(e.code, true);}
            this._keys.set(e.code, true);
        });

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            if(!e.isTrusted) {return;}
            this._keys.set(e.code, false);
            this._keysUp.set(e.code, true);
        });

        window.addEventListener("mousemove", (e: MouseEvent) => {
            if(!e.isTrusted) {return;}
            this._mousePosition.x = e.clientX;
            this._mousePosition.y = e.clientY;
        });

        window.addEventListener("mousedown", (e: MouseEvent) => {
            if(!e.isTrusted) {return;}
            if(!this._mouseButtons.get(e.button)) {this._mouseButtonsDown.set(e.button, true);}
            this._mouseButtons.set(e.button, true);
        });

        window.addEventListener("mouseup", (e: MouseEvent) => {
            if(!e.isTrusted) {return;}
            this._mouseButtons.set(e.button, false);
            this._mouseButtonsUp.set(e.button, true);
        });
    }

    public isKeyPressed(key: string): boolean            {return this._keys.get(key) || false;}
    public isKeyDown(key: string): boolean               {return this._keysDown.get(key) || false;}
    public isKeyUp(key: string): boolean                 {return this._keysUp.get(key) || false;}
    public getMousePosition(): {x: number, y: number}    {return {...this._mousePosition};}
    public isMouseButtonPressed(button: number): boolean {return this._mouseButtons.get(button) || false;}
    public isMouseButtonDown(button: number): boolean    {return this._mouseButtonsDown.get(button) || false;}
    public isMouseButtonUp(button: number): boolean      {return this._mouseButtonsUp.get(button) || false;}

    public update(): void
    {
        this._keysDown.clear();
        this._keysUp.clear();
        this._mouseButtonsDown.clear();
        this._mouseButtonsUp.clear();
    }
}
