import * as THREE from "three";
import {Renderer} from "./Renderer";
import {BaseGame} from "./BaseGame";
import {MessageBus} from "./MessageBus";
import {DebugController} from "../debug/DebugController";
import {DebugConsole} from "../debug/DebugConsole";
import {FpsWidget} from "@engine/debug/widgets/FpsWidget";
import {FpsGraphWidget} from "@engine/debug/widgets/FpsGraphWidget";
import {ServiceLocator} from "./ServiceLocator";
import {ServiceKeys} from "../services/ServiceKeys";
import {TimeService} from "../services/TimeService";
import {CameraService} from "../services/CameraService";
import {InputService} from "../services/InputService";
import {AssetManager} from "@engine/managers/AssetManager";

export class Engine
{
    private _renderer: Renderer;
    private _gameArea: HTMLDivElement;
    private _viewport: HTMLCanvasElement;
    private _aspect: number;
    private _gameTime: number = 0;
    private _isRunning: boolean = false;
    private _resizeObserver: ResizeObserver;

    private _timeService: TimeService;
    private _cameraService: CameraService;
    private _inputService: InputService;

    private _messageBus = new MessageBus();
    private _game: BaseGame;
    private _fpsLimit: number = 0;
    private _fpsAccumulator: number = 0;
    private _boundLoop = this.loop.bind(this);
    private _fpsWidget: FpsWidget;
    private _fpsGraph: FpsGraphWidget;

    public constructor(canvas: HTMLCanvasElement, gameArea: HTMLDivElement, game: BaseGame)
    {
        this._viewport = canvas;
        this._gameArea = gameArea;
        this._renderer = new Renderer(canvas);
        this._game = game;

        this._resizeObserver = new ResizeObserver(() => {
            this.onWindowResize();
        });

        const timeService = new TimeService();
        const cameraService = new CameraService();
        const inputService = new InputService();

        ServiceLocator.register(ServiceKeys.TIME, timeService);
        ServiceLocator.register(ServiceKeys.CAMERA, cameraService);
        ServiceLocator.register(ServiceKeys.INPUT, inputService);
        
        this._timeService = timeService;
        this._cameraService = cameraService;
        this._inputService = inputService;

        AssetManager.initialize();

        const fpsWidget = new FpsWidget();
        const fpsGraph = new FpsGraphWidget();
        const debugController = new DebugController(this);
        new DebugConsole(debugController);

        this._fpsWidget = fpsWidget;
        this._fpsGraph = fpsGraph;
    }

    public get messageBus(): MessageBus {return this._messageBus;}

    public async start(): Promise<void>
    {
        console.log("Starting engine...");

        this._resizeObserver.observe(this._gameArea);

        const gameAreaWidth = this._gameArea.clientWidth;
        const gameAreaHeight = this._gameArea.clientHeight;
        this._aspect = gameAreaWidth / gameAreaHeight;

        this._viewport.width = gameAreaWidth;
        this._viewport.height = gameAreaHeight;
        this._renderer.onResize(gameAreaWidth, gameAreaHeight);

        window.addEventListener("resize", this.onWindowResize.bind(this));

        await this._game.onStartup(this._aspect);

        this._cameraService.setCamera(this._game.activeCamera);

        await this._game.startNew();

        this._isRunning = true;
        this._gameTime = performance.now();
        requestAnimationFrame(this._boundLoop);

        console.log("Engine started with aspect:", this._aspect.toFixed(2));
    }

    public stop(): void
    {
        this._isRunning = false;
        this._resizeObserver.disconnect();
        console.log("Engine stopped");
    }
    
    public async restartScene(): Promise<void>
    {
        const active = this._game.activeScene;
        if(!active) {return;}

        await this._game.sceneManager.restartActiveScene();
    }

    public setFpsLimit(limit: number): void
    {
        this._fpsLimit = limit;
        this._fpsAccumulator = 0;
    }

    private update(deltaTime: number): void
    {
        if(!this._isRunning) {return;}

        this._timeService.tick(deltaTime);
        
        this._game.update();

        this._fpsWidget.update();
        this._fpsGraph.update();

        const activeScene = this._game.activeScene;
        const activeCamera = this._game.activeCamera;

        if(activeScene && activeScene.isLoaded && activeCamera)
        {
            this._renderer.render(activeScene.renderScene, activeCamera);
        }

        this._inputService.update();
    }

    private loop(): void
    {
        if(!this._isRunning) {return;}

        const gameTime = performance.now();
        const delta = Math.min((gameTime - this._gameTime) * 0.001, 0.1);
        this._gameTime = gameTime;

        if(this._fpsLimit > 0)
        {
            const targetInterval = 1000 / this._fpsLimit;
            this._fpsAccumulator += delta * 1000;

            if(this._fpsAccumulator < targetInterval)
            {
                requestAnimationFrame(this._boundLoop);
                return;
            }

            this._fpsAccumulator -= targetInterval;
            if(this._fpsAccumulator > targetInterval) {this._fpsAccumulator = 0;}
        }

        this.update(delta);
        requestAnimationFrame(this._boundLoop);
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
