import {GameObject} from "@engine/core/GameObject";
import {Mesh} from "@engine/api/Mesh";
import spline from "./Spline";

export class TubeObject extends GameObject
{
    public constructor()
    {
        super("Tube");
    }
    
    private onLoad(): void
    {
        this._mesh = Mesh.createEdgesTube(spline, 222, 0.65, 0xff00ff);
    }
}
