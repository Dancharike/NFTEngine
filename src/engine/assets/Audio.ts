import {AudioAsset} from "./AssetTypes";

export class Audio
{
    private _asset: AudioAsset;
    private _sources: AudioBufferSourceNode[] = [];
    private _context: AudioContext;
    private _gainNode: GainNode;

    public constructor(asset: AudioAsset, context: AudioContext)
    {
        this._asset = asset;
        this._context = context;
        this._gainNode = context.createGain();
        this._gainNode.gain.value = asset.volume;
        this._gainNode.connect(context.destination);
    }

    public get name(): string      {return this._asset.name;}
    public get duration(): number  {return this._asset.buffer.duration;}
    public get volume(): number    {return this._gainNode.gain.value;}
    public get loaded(): boolean   {return this._asset.loaded;}

    public play(): void
    {
        if(this._sources.length >= this._asset.poolSize) {return;}

        const source = this._context.createBufferSource();
        source.buffer = this._asset.buffer;
        source.loop = this._asset.loop;
        source.connect(this._gainNode);
        source.start();

        source.onended = () => {
            this._sources = this._sources.filter(s => s !== source);
        };

        this._sources.push(source);
    }

    public stop(): void
    {
        for(const source of this._sources)
        {
            try {source.stop();} catch {}
        }
        this._sources = [];
    }

    public setVolume(value: number): void
    {
        this._gainNode.gain.value = Math.max(0, Math.min(1, value));
    }

    public fadeIn(duration: number): void
    {
        this._gainNode.gain.setValueAtTime(0, this._context.currentTime);
        this._gainNode.gain.linearRampToValueAtTime(this._asset.volume, this._context.currentTime + duration);
    }

    public fadeOut(duration: number): void
    {
        this._gainNode.gain.setValueAtTime(this._asset.volume, this._context.currentTime);
        this._gainNode.gain.linearRampToValueAtTime(0, this._context.currentTime + duration);
    }
}
