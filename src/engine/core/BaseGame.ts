import * as THREE from "three";
import {IMessage, IMessageHandler, MessageBus} from "./MessageBus";
import {GameScene} from "./GameScene";
import {SceneManager} from "@engine/managers/SceneManager";

export abstract class BaseGame implements IMessageHandler
{
    protected _gameArea: HTMLDivElement;
    protected _sceneManager: SceneManager;
    protected _camera: THREE.Camera;
    protected _isInitialized: boolean = false;

    public constructor(gameArea: HTMLDivElement, protected _bus: MessageBus)
    {
        this._gameArea = gameArea;
        this._sceneManager = new SceneManager(this);
    }

    public get activeScene(): GameScene | null {return this._sceneManager.activeScene;}
    public get activeCamera(): THREE.Camera    {return this._camera;}
    public get sceneManager(): SceneManager    {return this._sceneManager;}
    public get isInitialized(): boolean        {return this._isInitialized;}

    public async onStartup(aspect: number): Promise<void>
    {
        await this.createCamera(1);
        await this.loadAssets();
        await this.registerScenes();
        await this.onInitialize();

        this._isInitialized = true;
    }

    public async startNew(): Promise<void>
    {
        await this.onGameStart();
    }

    public update(deltaTime: number): void
    {
        this._sceneManager.update(deltaTime);

        this.onUpdate(deltaTime);
    }

    public onMessage(message: IMessage): void
    {
        switch(message.code)
        {
            case "scene_change": if(message.context && message.context.sceneName) {this._sceneManager.changeScene(message.context.sceneName);} break;
            default:
                if(this.activeScene) {this.activeScene.broadcastMessage(message);}
                this.onGameMessage(message);
                break;
        }
    }

    protected async createCamera(aspect: number): Promise<void>
    {
        this._camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this._camera.position.set(0, 5, 10);
        this._camera.lookAt(0, 0, 0);
    }

    protected registerScene(name: string, scene: GameScene): void
    {
        this._sceneManager.addScene(name, scene);
    }

    protected async changeScene(name: string): Promise<boolean>
    {
        return await this._sceneManager.changeScene(name);
    }

    protected abstract loadAssets(): Promise<void>;
    protected abstract registerScenes(): Promise<void>;
    protected abstract onInitialize(): Promise<void>;
    protected abstract onGameStart(): Promise<void>;
    protected abstract onUpdate(deltaTime: number): Promise<void>;
    protected abstract onGameMessage(message: IMessage): Promise<void>;
}
