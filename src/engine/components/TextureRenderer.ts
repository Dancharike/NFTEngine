import * as THREE from "three";
import {Component} from "./Component";
import {GameObject} from "@engine/core/GameObject";
import {AssetManager} from "@engine/managers/AssetManager";
import {TextureAsset} from "@engine/assets/AssetTypes";
import {IMessage} from "@engine/core/MessageBus";

export class TextureRenderer extends Component
{
    private _textureName: string = "";

    public constructor(owner: GameObject, textureName?: string)
    {
        super(owner, "TextureRenderer");
        if(textureName) {this._textureName = textureName;}
    }

    public load(): void
    {
        if(this._textureName) {this.applyTexture();}
    }

    public setTexture(name: string): void
    {
        this._textureName = name;
        this.applyTexture();
    }

    private applyTexture(): void
    {
        const asset = AssetManager.get<TextureAsset>(this._textureName);
        if(!asset) {console.error(`Texture not found: ${this._textureName}`); return;}

        const mesh = this._owner.mesh;
        if(!mesh) {console.error(`No mesh on ${this._owner.name}`); return;}

        const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if(!mat || !('map' in mat)) {console.error(`Material does not support texture`); return;}

        mat.map = asset.texture;
        mat.needsUpdate = true;
    }

    public onMessage(message: IMessage): void
    {
        if(message.code === "set_texture" && message.context?.name)
        {
            this.setTexture(message.context.name);
        }
    }
}
