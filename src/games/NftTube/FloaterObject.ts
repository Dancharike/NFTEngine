import {GameObject} from "@engine/core/GameObject";
import {Mesh} from "@engine/api/Mesh";
import {CubeObject} from "./CubeObject";
import spline from "./Spline";

export class FloaterObject extends GameObject
{
    private _cubes: CubeObject[];
    
    public constructor(cubes: CubeObject[])
    {
        super("FloaterManager");
        this._cubes = cubes;
    }
    
    private onLoad(): void
    {
        for(let i = 0; i < 55; i++)
        {
            const p = (i / 55 + Math.random() * 0.1) % 1;
            const pos = spline.getPointAt(p);
            
            pos.x += (Math.random() - 0.5) * 0.5;
            pos.y += (Math.random() - 0.5) * 0.5;

            const cube = this._scene.instanceCreate(CubeObject, pos.x, pos.y, pos.z);
            cube.setEdgeColour(Mesh.colourFromHSL(0.7 - p));
            this._cubes.push(cube);
        }
    }
}
