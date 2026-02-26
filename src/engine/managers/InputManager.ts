export class InputManager
{
    private static _keys: Map<string, boolean> = new Map();
    private static _keysDown: Map<string, boolean> = new Map();
    private static _keysUp: Map<string, boolean> = new Map();

    private static _mousePosition: {x: number, y: number} = {x: 0, y: 0};
    private static _mouseButtons: Map<number, boolean> = new Map();
    private static _mouseButtonsDown: Map<number, boolean> = new Map();
    private static _mouseButtonsUp: Map<number, boolean> = new Map();

    private static _isInitialized: boolean = false;

    private constructor() {}

    public static initialize(): void
    {
        if(this._isInitialized) {return;}

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

        this._isInitialized = true;
        console.log("Input Manager initialized");
    }

    public static isKeyPressed(key: string): boolean
    {
        return this._keys.get(key) || false;
    }
    
    public static isKeyDown(key: string): boolean
    {
        return this._keysDown.get(key) || false;
    }
    
    public static isKeyUp(key: string): boolean
    {
        return this._keysUp.get(key) || false;
    }
    
    public static getMousePosition(): {x: number, y: number}
    {
        return {...this._mousePosition};
    }
    
    public static isMouseButtonPressed(button: number): boolean
    {
        return this._mouseButtons.get(button) || false;
    }
    
    public static isMouseButtonDown(button: number): boolean
    {
        return this._mouseButtonsDown.get(button) || false;
    }
    
    public static isMouseButtonUp(button: number): boolean
    {
        return this._mouseButtonsUp.get(button) || false;
    }
    
    public static update(): void
    {
        this._keysDown.clear();
        this._keysUp.clear();
        this._mouseButtonsDown.clear();
        this._mouseButtonsUp.clear();
    }
}
