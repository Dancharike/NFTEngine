const GameObject = require("@engine/core/GameObject").GameObject;
const spline = require("./Spline").default;

class CameraObject extends GameObject
{
    constructor(name, scene)
    {
        super(name);
        this._sceneRef = scene;
        this._time = 0;
    }

    onUpdate(deltaTime)
    {
        this._time += deltaTime * 0.1;

        const looptime = 10;
        const p = (this._time % looptime) / looptime;

        const pos = spline.getPointAt(p);
        const lookAt = spline.getPointAt((p + 0.03) % 1);

        const cam = this._sceneRef.camera;
        cam.position.copy(pos);
        cam.lookAt(lookAt);
    }
}

module.exports = {CameraObject};
