import * as THREE from "three";
import {GameObject} from "@engine/core/GameObject";
import spline from "./Spline";

export class TubeObject extends GameObject
{
    private _tube: THREE.TubeGeometry;

    private onLoad(): void
    {
        const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
        const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
        const mat = new THREE.LineBasicMaterial({color: 0xff00ff});

        this._mesh = new THREE.LineSegments(edges, mat);
    }
}
