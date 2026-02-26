import {GameScene} from "@engine/core/GameScene";
import {BaseGame} from "@engine/core/BaseGame";

export class SceneManager
{
    private _scenes: Map<string, GameScene> = new Map();
    private _activeScene: GameScene | null = null;
    private _game: BaseGame;

    public constructor(game: BaseGame)
    {
        this._game = game;
    }

    public get activeScene(): GameScene | null {return this._activeScene;}

    public addScene(name: string, scene: GameScene): void
    {
        if(this._scenes.has(name)) {console.warn(`Scene ${name} already exists. Overwritinh...`);}

        this._scenes.set(name, scene);
    }

    public getScene(name: string): GameScene | null
    {
        return this._scenes.get(name) || null;
    }

    public async changeScene(name: string): Promise<boolean>
    {
        const scene = this._scenes.get(name);
        if(!scene) {console.error(`Scene ${name} not found`); return false;}

        if(this._activeScene) {this._activeScene.unload();}

        this._activeScene = scene;
        await this._activeScene.load();

        console.log(`Scene changed to: ${name}`);
        return true;
    }

    public update(deltaTime: number): void
    {
        if(this._activeScene && this._activeScene.isLoaded) {this._activeScene.update(deltaTime);}
    }
}
