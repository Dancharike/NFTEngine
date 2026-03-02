import * as THREE from "three";
import {BaseGame} from "./BaseGame";
import {GameObject} from "./GameObject";
import {IMessage} from "./MessageBus";

export abstract class GameScene
{
    private _scene: THREE.Scene;
    private _isLoaded: boolean = false;
    private _game: BaseGame;
    private _gameObjects: Map<string, GameObject> = new Map();

    public constructor(game: BaseGame)
    {
        this._game = game;
        this._scene = new THREE.Scene();
    }

    public get renderScene(): Readonly<THREE.Scene> {return this._scene;}
    public get isLoaded(): boolean                  {return this._isLoaded;}
    public get game(): BaseGame                     {return this._game;}

    protected abstract onLoad(): Promise<void>;
    protected abstract onUnload(): void;

    public async load(): Promise<void>
    {
        console.log(`Loading scene...`);

        await this.onLoad();

        for(const [id, gameObject] of this._gameObjects)
        {
            gameObject.awake();
        }
        
        for(const [id, gameObject] of this._gameObjects)
        {
            gameObject.load();
            if(gameObject.mesh) {this._scene.add(gameObject.mesh);}
        }

        for(const [id, gameObject] of this._gameObjects)
        {
            gameObject.start();
        }

        this._isLoaded = true;
        console.log(`Scene loaded with ${this._gameObjects.size} objects`);
    }

    public unload(): void
    {
        console.log(`Unloading scene...`);

        for(const [id, gameObject] of this._gameObjects)
        {
            gameObject.destroy();
        }

        this._gameObjects.clear();

        while(this._scene.children.length > 0)
        {
            this._scene.remove(this._scene.children[0]);
        }

        this.onUnload();
        this._isLoaded = false;
    }

    public update(): void
    {
        for(const [id, gameObject] of this._gameObjects)
        {
            if(gameObject.isActive) {gameObject.update();}
        }
    }

    //#region JS api
    public instanceCreate<T extends GameObject>(objectClass: new(...args: any[]) => T, x: number, y: number, z: number): T
    {
        const instance = new objectClass();
        instance.scene = this;

        this.addGameObject(instance);

        (instance as any)._pendingX = x;
        (instance as any)._pendingY = y;
        (instance as any)._pendingZ = z;

        return instance;
    }

    public instanceFind(objectName: string): GameObject | null
    {
        return this.findGameObjectByName(objectName);
    }

    public instanceFindAll(objectName: string): GameObject[]
    {
        const result: GameObject[] = [];
        for(const [id, gameObject] of this._gameObjects)
        {
            if(gameObject.name === objectName) {result.push(gameObject);}
        }

        return result;
    }

    public instanceGetAll(): GameObject[]
    {
        return Array.from(this._gameObjects.values());
    }

    public instanceCount(objectName: string): number
    {
        let count = 0;
        for(const [id, gameObject] of this._gameObjects)
        {
            if(gameObject.name === objectName) {count++;}
        }

        return count;
    }

    public instanceDestroy(object: GameObject): void
    {
        this.removeGameObject(object.id);
    }
    //#endregion

    public addGameObject(gameObject: GameObject): void
    {
        if(this._gameObjects.has(gameObject.id)) {console.warn(`Game object with id ${gameObject.id} already exists in the scene`); return;}

        gameObject.scene = this;
        
        this._gameObjects.set(gameObject.id, gameObject);

        if(this.isLoaded)
        {
            gameObject.awake();
            gameObject.load();
            if(gameObject.mesh) {this._scene.add(gameObject.mesh);}
            gameObject.start();
        }
    }

    public removeGameObject(id: string): void
    {
        const gameObject = this._gameObjects.get(id);
        if(gameObject)
        {
            this._gameObjects.delete(id);
            gameObject.destroy();
        }
    }

    public getGameObject(id: string): GameObject | null
    {
        return this._gameObjects.get(id) || null;
    }

    public findGameObjectByName(name: string): GameObject | null
    {
        for(const [id, gameObject] of this._gameObjects)
        {
            if(gameObject.name === name) {return gameObject;}
        }

        return null;
    }

    public findByTag(tag: string): GameObject | null
    {
        for(const [id, gameObject] of this._gameObjects)
        {
            if(gameObject.tag === tag) {return gameObject;}
        }
        
        return null;
    }

    public findAllByTag(tag: string): GameObject[]
    {
        const result: GameObject[] = [];
        for(const [id, gameObject] of this._gameObjects)
        {
            if(gameObject.tag === tag) {result.push(gameObject);}
        }

        return result;
    }

    public broadcastMessage(message: IMessage): void
    {
        for(const [id, gameObject] of this._gameObjects)
        {
            gameObject.onMessage(message);
        }
    }
}
