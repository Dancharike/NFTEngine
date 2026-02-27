import {BaseGame} from "@engine/core/BaseGame";
import {IMessage} from "@engine/core/MessageBus";
import {MainScene} from "./MainScene";

export class NftTubeGame extends BaseGame
{
    protected async loadAssets(): Promise<void>
    {
        console.log("Loading assets...");
    }

    protected async registerScenes(): Promise<void>
    {
        console.log("NftTubeGame: registering scenes...");
        this.registerScene("main", new MainScene(this));
    }

    protected async onInitialize(): Promise<void>
    {
        console.log("NftTubeGame: initialized");
    }

    protected async onGameStart(): Promise<void>
    {
        console.log("NftTubeGame: starting...");
        await this.changeScene("main");
    }

    protected async onUpdate(): Promise<void>
    {

    }

    protected async onGameMessage(message: IMessage): Promise<void>
    {
        console.log("Message:", message.code);
    }
}
