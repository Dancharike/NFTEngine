import * as THREE from "three";
import {Renderer} from "./Renderer";
import {BaseGame} from "./BaseGame";
import {InputManager} from "../managers/InputManager";
import {MessageBus} from "./MessageBus";

export class Engine
{
    private _renderer: Renderer;
    private _gameArea: HTMLDivElement;
    private _viewport: HTMLCanvasElement;
    private _aspect: number;
    private _gameTime: number = 0;
    private _isRunning: boolean = false;
    private _resizeObserver: ResizeObserver;

    private _messageBus = new MessageBus();
    private _game: BaseGame;

    public constructor(canvas: HTMLCanvasElement, gameArea: HTMLDivElement, game: BaseGame)
    {
        this._viewport = canvas;
        this._gameArea = gameArea;
        this._renderer = new Renderer(canvas);
        this._game = game;

        this._resizeObserver = new ResizeObserver(() => {
            this.onWindowResize();
        });
    }

    public get messageBus(): MessageBus {return this._messageBus;}

    public async start(): Promise<void>
    {
        console.log("Starting engine...");

        this._resizeObserver.observe(this._gameArea);

        const gameAreaWidth = this._gameArea.clientWidth;
        const gameAreaHeight = this._gameArea.clientHeight;
        this._aspect = gameAreaWidth / gameAreaHeight;

        InputManager.initialize();

        this._viewport.width = gameAreaWidth;
        this._viewport.height = gameAreaHeight;
        this._renderer.onResize(gameAreaWidth, gameAreaHeight);

        window.addEventListener("resize", this.onWindowResize.bind(this));

        await this._game.onStartup(this._aspect);
        await this._game.startNew();

        this._isRunning = true;
        this.loop(0);

        console.log("Engine started with aspect:", this._aspect.toFixed(2));
    }

    public stop(): void
    {
        this._isRunning = false;
        this._resizeObserver.disconnect();
        console.log("Engine stopped");
    }

    private update(deltaTime: number): void
    {
        if(!this._isRunning) {return;}

        this._game.update(deltaTime);

        InputManager.update();

        const activeScene = this._game.activeScene;
        const activeCamera = this._game.activeCamera;

        if(activeScene && activeScene.isLoaded && activeCamera)
        {
            this._renderer.render(deltaTime, activeScene.renderScene, activeCamera);
        }
    }

    private loop(gameTime: number): void
    {
        if(!this._isRunning) {return;}

        requestAnimationFrame(this.loop.bind(this));

        let lastTime = this._gameTime;
        this._gameTime = gameTime;

        let delta = this._gameTime - lastTime;
        delta *= 0.001;

        this.update(delta);
    }

    private onWindowResize(): void
    {
        requestAnimationFrame(() => {
            const gameAreaWidth = this._gameArea.clientWidth;
            const gameAreaHeight = this._gameArea.clientHeight;
            
            this._viewport.width = gameAreaWidth;
            this._viewport.height = gameAreaHeight;
            
            this._renderer.onResize(gameAreaWidth, gameAreaHeight);
            
            const camera = this._game.activeCamera;
            if(camera && camera instanceof THREE.PerspectiveCamera)
            {
                camera.aspect = gameAreaWidth / gameAreaHeight;
                camera.updateProjectionMatrix();
            }
        });
    }
}
