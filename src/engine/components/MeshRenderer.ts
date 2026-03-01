import * as THREE from "three";
import {Component} from "./Component";
import {GameObject} from "@engine/core/GameObject";
import {AssetManager} from "@engine/managers/AssetManager";
import {GeometryAsset, MaterialAsset} from "@engine/assets/AssetTypes";
import {IMessage} from "@engine/core/MessageBus";

export class MeshRenderer extends Component
{
    private _geometryName: string = "";
    private _materialName: string = "";

    public constructor(owner: GameObject, geometryName?: string, materialName?: string)
    {
        super(owner, "MeshRenderer");
        if(geometryName) {this._geometryName = geometryName;}
        if(materialName) {this._materialName = materialName;}
    }

    public load(): void
    {
        if(this._geometryName && this._materialName) {this.buildMesh();}
    }

    public setGeometry(name: string): void
    {
        this._geometryName = name;
        if(this._materialName) {this.buildMesh();}
    }

    public setMaterial(name: string): void
    {
        this._materialName = name;
        if(this._geometryName) {this.buildMesh();}
    }

    private buildMesh(): void
    {
        const geoAsset = AssetManager.get<GeometryAsset>(this._geometryName);
        const matAsset = AssetManager.get<MaterialAsset>(this._materialName);

        if(!geoAsset) {console.error(`Geometry not found: ${this._geometryName}`); return;}
        if(!matAsset) {console.error(`Material not found: ${this._materialName}`); return;}

        const mesh = new THREE.Mesh(geoAsset.geometry, matAsset.material);

        const old = this._owner.mesh;
        if(old?.parent) {old.parent.remove(old);}

        (this._owner as any)._mesh = mesh;

        if(this._owner.scene?.isLoaded)
        {
            this._owner.scene.renderScene.add(mesh);
        }
    }

    public destroy(): void
    {
        const mesh = this._owner.mesh;
        if(mesh?.parent) {mesh.parent.remove(mesh);}
    }

    public onMessage(message: IMessage): void
    {
        switch(message.code)
        {
            case "set_geometry": if(message.context?.name) {this.setGeometry(message.context.name);} break;
            case "set_material": if(message.context?.name) {this.setMaterial(message.context.name);} break;
        }
    }
}
