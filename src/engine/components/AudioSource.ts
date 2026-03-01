import {Component} from "./Component";
import {GameObject} from "@engine/core/GameObject";
import {AssetManager} from "@engine/managers/AssetManager";
import {AudioAsset} from "@engine/assets/AssetTypes";
import {Audio} from "@engine/assets/Audio";
import {IMessage} from "@engine/core/MessageBus";

export class AudioSource extends Component
{
    private _audio: Audio | null = null;
    private _audioName: string = "";
    private _playOnLoad: boolean = false;

    public constructor(owner: GameObject, audioName?: string, playOnLoad: boolean = false)
    {
        super(owner, "AudioSource");
        if(audioName) {this._audioName = audioName;}
        this._playOnLoad = playOnLoad;
    }

    public load(): void
    {
        if(this._audioName) {this.setAudio(this._audioName);}
    }

    public setAudio(name: string): void
    {
        this._audioName = name;

        const asset = AssetManager.get<AudioAsset>(name);
        if(!asset) {console.error(`Audio not found: ${name}`); return;}

        const context = AssetManager.getAudioContext();
        if(!context) {console.error(`AudioContext not initialized`); return;}

        this._audio = new Audio(asset, context);

        if(this._playOnLoad) {this._audio.play();}
    }

    public play(): void    {this._audio?.play();}
    public stop(): void    {this._audio?.stop();}

    public setVolume(value: number): void  {this._audio?.setVolume(value);}
    public fadeIn(duration: number): void  {this._audio?.fadeIn(duration);}
    public fadeOut(duration: number): void {this._audio?.fadeOut(duration);}

    public destroy(): void {this._audio?.stop();}

    public onMessage(message: IMessage): void
    {
        switch(message.code)
        {
            case "audio_play":    this.play(); break;
            case "audio_stop":    this.stop(); break;
            case "audio_fade_in":  if(message.context?.duration) {this.fadeIn(message.context.duration);}  break;
            case "audio_fade_out": if(message.context?.duration) {this.fadeOut(message.context.duration);} break;
            case "set_audio":      if(message.context?.name)     {this.setAudio(message.context.name);}    break;
        }
    }
}
