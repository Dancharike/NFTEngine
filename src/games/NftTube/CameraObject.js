const {Time} = require("@engine/core/Time");
const {Camera} = require("@engine/core/Camera");
const GameObject = require("@engine/core/GameObject").GameObject;
const spline = require("./Spline").default;

class CameraObject extends GameObject
{
    constructor(name)
    {
        super(name);
        this._t = 0;
    }

    onUpdate()
    {
        this._t += Time.deltaTime * 0.1;
        const p = (this._t % 10) / 10;

        Camera.current.position.copy(spline.getPointAt(p));
        Camera.current.lookAt(spline.getPointAt((p + 0.03) % 1));
    }
}

module.exports = {CameraObject};
