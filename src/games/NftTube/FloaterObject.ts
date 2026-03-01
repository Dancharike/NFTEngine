import {GameObject} from "@engine/core/GameObject";
import {Mesh} from "@engine/api/Mesh";
import {CubeObject} from "./CubeObject";
import spline from "./Spline";

export class FloaterObject extends GameObject
{
    public constructor()
    {
        super("FloaterManager");
    }
    
    private onLoad(): void
    {
        for(let i = 0; i < 55; i++)
        {
            const p = (i / 55 + Math.random() * 0.1) % 1;
            const pos = spline.getPointAt(p);

            console.log(`Cube ${i}: p=${p.toFixed(3)} pos=${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`);
            
            pos.x += (Math.random() - 0.5) * 0.5;
            pos.y += (Math.random() - 0.5) * 0.5;

            const cube = this._scene.instanceCreate(CubeObject, pos.x, pos.y, pos.z);
            cube.setEdgeColour(Mesh.colourFromHSL(0.7 - p));
        }
    }
}
