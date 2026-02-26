const THREE = require("three");
const GameObject = require("@engine/core/GameObject").GameObject;
const spline = require("./Spline").default;

class TubeObject extends GameObject
{
    onLoad()
    {
        const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
        this._tube = tubeGeo;

        const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
        const mat = new THREE.LineBasicMaterial({color: 0xff00ff});

        this._mesh = new THREE.LineSegments(edges, mat);
    }

    get path() {return this._tube.parameters.path;}
}

module.exports = {TubeObject};
