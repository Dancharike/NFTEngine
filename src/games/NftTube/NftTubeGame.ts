import {BaseGame} from "@engine/core/BaseGame";
import {IMessage} from "@engine/core/MessageBus";
import {MainScene} from "./MainScene";
import {NFTCollection} from "@engine/nft/NFTCollection";
import {NFTWindow} from "./NFTWindow";

export class NftTubeGame extends BaseGame
{
    private _collection: NFTCollection;
    private _nftWindow: NFTWindow;

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
        this._collection = new NFTCollection(55);
        console.log("NftTubeGame: initialized");
    }

    protected async onGameStart(): Promise<void>
    {
        console.log("NftTubeGame: starting...");
        await this.changeScene("main");
        this.setupUI();
    }

    protected async onUpdate(): Promise<void>
    {

    }

    protected async onGameMessage(message: IMessage): Promise<void>
    {
        console.log("Message:", message.code);
    }

    private setupUI(): void
    {
        this._nftWindow = new NFTWindow();
        this._nftWindow.mount();
        this._nftWindow.onGenerate(() => this.generateNext());
    }

    private generateNext(): void
    {
        const scene = this.activeScene as MainScene;
        if(!scene) {return;}

        const {index, texture, metadata} = this._collection.generate();

        scene.applyNFTTexture(index, texture);

        this._nftWindow.updatePreview(texture.image as HTMLCanvasElement);
        this._nftWindow.updateMeta(metadata);
    }
}
