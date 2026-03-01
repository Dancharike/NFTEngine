import {Component} from "./Component";
import {GameObject} from "@engine/core/GameObject";
import {IMessage} from "@engine/core/MessageBus";
import {Sprite} from "@engine/assets/Sprite";
import {AssetManager} from "@engine/managers/AssetManager";
import {SpriteAsset} from "@engine/assets/AssetTypes";

export class SpriteRenderer extends Component
{
    private _sprite: Sprite | null = null;
    private _spriteName: string = "";
    private _autoPlay: boolean = true;

    public constructor(owner: GameObject, componentName: string = "SpriteRenderer", autoPlay: boolean = true)
    {
        super(owner, componentName);
        this._autoPlay = autoPlay;
    }

    public get sprite(): Sprite | null {return this._sprite;}
    public get spriteName(): string {return this._spriteName;}
    public get currentFrame(): number {return this._sprite?.currentFrame || 0;}
    public get frameCount(): number {return this._sprite?.frameCount || 0;}
    public get isPlaying(): boolean {return this._sprite?.isPlaying || false;}

    public setSprite(spriteName: string, width?: number, height?: number): boolean
    {
        const spriteAsset = AssetManager.get<SpriteAsset>(spriteName);
        if(!spriteAsset) {console.error(`Sprite not found: ${spriteName}`); return false;}

        if(this._sprite && this._sprite.mesh)
        {
            const mesh = this._sprite.mesh;
            if(mesh.parent) {mesh.parent.remove(mesh);}
        }

        this._sprite = new Sprite(spriteAsset);
        this._spriteName = spriteName;

        const mesh = this._sprite.createMesh(width, height);

        if(this._owner.mesh)
        {
            const parent = this._owner.mesh.parent;
            const position = this._owner.mesh.position.clone();
            const rotation = this._owner.mesh.rotation.clone();
            const scale = this._owner.mesh.scale.clone();

            if(parent)
            {
                parent.remove(this._owner.mesh);
                parent.add(mesh);
            }

            mesh.position.copy(position);
            mesh.rotation.copy(rotation);
            mesh.scale.copy(scale);
        }

        (this._owner as any)._mesh = mesh;

        if(this._autoPlay) {this._sprite.play();}

        return true;
    }

    public setFrame(frame: number): void
    {
        this._sprite?.setFrame(frame);
    }

    public play(): void
    {
        this._sprite?.play();
    }

    public pause(): void
    {
        this._sprite?.pause();
    }

    public stop(): void
    {
        this._sprite?.stop();
    }

    public restart(): void
    {
        this._sprite?.restart();
    }

    public onAnimationEnd(callback: () => void): void
    {
        this._sprite?.onAnimationEnd(callback);
    }

    public onFrameChange(callback: () => void): void
    {
        this._sprite?.onFrameChange(callback);
    }

    public load(): void
    {
        if(this._spriteName) {this.setSprite(this._spriteName);}
    }

    public update(): void
    {
        if(this._sprite && this._enabled) {this._sprite.update();}
    }

    public destroy(): void
    {
        this._sprite = null;
    }

    public onMessage(message: IMessage): void
    {
        switch(message.code)
        {
            case "sprite_play": this.play(); break;
            case "sprite_pause": this.pause(); break;
            case "sprite_stop": this.stop(); break;
            case "sprite_set_frame": if(message.context?.frame !== undefined) {this.setFrame(message.context.frame);} break;
            case "change_sprite": if(message.context?.spriteName) {this.setSprite(message.context.spriteName);} break;
        }
    }
}
