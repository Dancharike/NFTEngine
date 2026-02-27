const THREE = require("three");
const GameScene = require("@engine/core/GameScene").GameScene;

const TubeObject = require("./TubeObject").TubeObject;
const FloaterObject = require("./FloaterObject").FloaterObject;
const CameraObject = require("./CameraObject").CameraObject;

class MainScene extends GameScene
{
    constructor(game)
    {
        super(game);
    }
    
    async onLoad()
    {
        this.renderScene.background = new THREE.Color(0x000000);
        this.renderScene.fog = new THREE.FogExp2(0x000000, 0.25);

        this.addGameObject(new TubeObject("Tube"));
        this.addGameObject(new FloaterObject("Floater"));
        this.addGameObject(new CameraObject("Camera"));
    }
}

module.exports = {MainScene};
