import * as THREE from "three";
import {GameScene} from "@engine/core/GameScene";

export class Scene
{
    private constructor() {}

    public static addMesh(scene: GameScene, mesh: THREE.Object3D): void
    {
        scene.renderScene.add(mesh);
    }

    public static removeMesh(scene: GameScene, mesh: THREE.Object3D): void
    {
        scene.renderScene.remove(mesh);
    }

    public static setBackground(scene: GameScene, color: number): void
    {
        scene.renderScene.background = new THREE.Color(color);
    }

    public static setFog(scene: GameScene, color: number, density: number): void
    {
        scene.renderScene.fog = new THREE.FogExp2(color, density);
    }
}
