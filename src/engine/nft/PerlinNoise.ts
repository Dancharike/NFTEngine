export class PerlinNoise
{
    private _perm: number[];

    public constructor(seed: number = Math.random())
    {
        this._perm = this.generatePermutation(seed);
    }

    private generatePermutation(seed: number): number[]
    {
        let s = seed * 2147483647;
        const rand = () => {
            s = (s * 1664525 + 1013904223) & 0xffffffff;
            return (s >>> 0) / 0xffffffff;
        };

        const p = Array.from({length: 256}, (_, i) => i);
        for(let i = 255; i > 0; i--)
        {
            const j = Math.floor(rand() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }

        return [...p, ...p];
    }

    private fade(t: number): number
    {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(a: number, b: number, t: number): number
    {
        return a + t * (b - a);
    }

    private grad(hash: number, x: number, y: number): number
    {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
    }

    public noise(x: number, y: number): number
    {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        const u = this.fade(x);
        const v = this.fade(y);

        const a = this._perm[X] + Y;
        const b = this._perm[X + 1] + Y;

        return this.lerp(
            this.lerp(this.grad(this._perm[a],     x,     y),     this.grad(this._perm[b],     x - 1, y),     u),
            this.lerp(this.grad(this._perm[a + 1], x,     y - 1), this.grad(this._perm[b + 1], x - 1, y - 1), u),
            v
        );
    }

    public octaveNoise(x: number, y: number, octaves: number = 4, persistence: number = 0.5): number
    {
        let value = 0;
        let amplitude = 1;
        let frequency = 1;
        let max = 0;

        for(let i = 0; i < octaves; i++)
        {
            value += this.noise(x * frequency, y * frequency) * amplitude;
            max += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return value / max;
    }
}
