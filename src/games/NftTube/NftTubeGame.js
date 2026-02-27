const BaseGame = require("@engine/core/BaseGame").BaseGame;
const MainScene = require("./MainScene").MainScene;

class NftTubeGame extends BaseGame
{
    async loadAssets()
    {
        console.log("Loading assets...");
    }

    async registerScenes()
    {
        console.log("NftTubeGame: registering scenes...");
        this.registerScene("main", new MainScene(this));
    }

    async onInitialize()
    {
        console.log("NftTubeGame: initialized");
    }

    async onGameStart()
    {
        console.log("NftTubeGame: starting...");
        await this.changeScene("main");
    }

    async onUpdate()
    {
        
    }

    async onGameMessage(message)
    {
        console.log("Message:", message.code);
    }
}

module.exports = {NftTubeGame};
