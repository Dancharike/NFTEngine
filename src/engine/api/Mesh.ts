import * as THREE from "three";

export class Mesh
{
    private constructor() {}

    public static createEdgesFromMesh(mesh: THREE.Mesh, color: number): THREE.LineSegments
    {
        const edges = new THREE.EdgesGeometry(mesh.geometry, 0.2);
        const mat = new THREE.LineBasicMaterial({color});
        return new THREE.LineSegments(edges, mat);
    }
    
    public static createEdgesBox(size: number, color: number): THREE.LineSegments
    {
        const geo = new THREE.BoxGeometry(size, size, size);
        const edges = new THREE.EdgesGeometry(geo, 0.2);
        const mat = new THREE.LineBasicMaterial({color});
        return new THREE.LineSegments(edges, mat);
    }

    public static createEdgesTube(spline: THREE.CatmullRomCurve3, segments: number, radius: number, color: number): THREE.LineSegments
    {
        const geo = new THREE.TubeGeometry(spline, segments, radius, 16, true);
        const edges = new THREE.EdgesGeometry(geo, 0.2);
        const mat = new THREE.LineBasicMaterial({color});
        return new THREE.LineSegments(edges, mat);
    }

    public static createBox(size: number, color: number, transparent: boolean = false, opacity: number = 1): THREE.Mesh
    {
        const geo = new THREE.BoxGeometry(size, size, size);
        const mat = new THREE.MeshBasicMaterial({color, transparent, opacity});
        return new THREE.Mesh(geo, mat);
    }

    public static colourFromHSL(h: number, s: number = 1, l: number = 0.5): number
    {
        return new THREE.Color().setHSL(h, s, l).getHex();
    }

    public static setPosition(mesh: THREE.Object3D, x: number, y: number, z: number): void
    {
        mesh.position.set(x, y, z);
    }

    public static setColour(mesh: THREE.Object3D, color: number): void
    {
        const mat = (mesh as any).material;
        if(mat?.color) {mat.color.set(color);}
    }

    public static addChild(parent: THREE.Object3D, child: THREE.Object3D): void
    {
        parent.add(child);
    }

    public static setTexture(mesh: THREE.Object3D, texture: THREE.Texture): void
    {
        const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if(!mat) {return;}
        mat.map = texture;
        mat.transparent = false;
        mat.opacity = 1;
        mat.needsUpdate = true;
    }

    public static randomRotationSpeed(): {x: number, y: number, z: number}
    {
        return {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2,
        };
    }

    public static rotate(mesh: THREE.Object3D, speed: {x: number, y: number, z: number}, deltaTime: number): void
    {
        mesh.rotation.x += speed.x * deltaTime;
        mesh.rotation.y += speed.y * deltaTime;
        mesh.rotation.z += speed.z * deltaTime;
    }
}
