const THREE = require("three");
const GameObject = require("@engine/core/GameObject").GameObject;
const spline = require("./Spline").default;

class FloaterObject extends GameObject
{
    onLoad()
    {
        const boxGeo = new THREE.BoxGeometry(0.075, 0.075, 0.075);

        for(let i = 0; i < 55; i++)
        {
            const p = (i / 55 + Math.random() * 0.1) % 1;
            const pos = spline.getPointAt(p);

            const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
            const color = new THREE.Color().setHSL(0.7 - p, 1, 0.5);
            const mat = new THREE.LineBasicMaterial({ color });

            const mesh = new THREE.LineSegments(edges, mat);
            mesh.position.copy(pos);

            this._scene.add(mesh);
        }
    }
}

module.exports = {FloaterObject};
