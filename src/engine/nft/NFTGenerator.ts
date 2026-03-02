import * as THREE from "three";
import {PerlinNoise} from "./PerlinNoise";

export interface NFTMetaData
{
    id: number;
    seed: number;
    colourA: string;
    colourB: string;
    octaves: number;
    persistence: number;
}

export class NFTGenerator
{
    private static readonly SIZE = 128;

    private constructor() {}

    public static generate(id: number): {texture: THREE.CanvasTexture, metadata: NFTMetaData}
    {
        const seed = Math.random();
        const noise = new PerlinNoise(seed);
        const octaves = 3 + Math.floor(Math.random() * 3);
        const persistence = 0.4 + Math.random() * 0.4;

        const colourA = this.randomSynthwaveColour();
        const colourB = this.randomSynthwaveColour();

        const canvas = document.createElement("canvas");
        canvas.width = this.SIZE;
        canvas.height = this.SIZE;
        const ctx = canvas.getContext("2d");

        const gradient = ctx.createLinearGradient(0, 0, this.SIZE, this.SIZE);
        gradient.addColorStop(0, colourA);
        gradient.addColorStop(1, colourB);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.SIZE, this.SIZE);

        const imageData = ctx.getImageData(0, 0, this.SIZE, this.SIZE);
        const data = imageData.data;

        for(let y = 0; y < this.SIZE; y++)
        {
            for(let x = 0; x < this.SIZE; x++)
            {
                const nx = x / this.SIZE * 4;
                const ny = y / this.SIZE * 4;
                const n = noise.octaveNoise(nx, ny, octaves, persistence);
                const alpha = ((n + 1) / 2) * 180;

                const i = (y * this.SIZE + x) * 4;
                data[i] = Math.min(255, data[i] + n * 60);
                data[i + 1] = Math.min(255, data[i + 1] + n * 30);
                data[i + 2] = Math.min(255, data[i + 2] + n * 80);
                data[i + 3] = 255;
            }
        }

        ctx.putImageData(imageData, 0, 0);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const metadata: NFTMetaData = {
            id,
            seed: Math.round(seed * 1000000),
            colourA,
            colourB,
            octaves,
            persistence: Math.round(persistence * 100) / 100,
        };

        return {texture, metadata};
    }

    private static randomSynthwaveColour(): string
    {
        const colours = ["#ff00ff", "#00ffff", "#ff0099", "#9900ff", "#00ff99", "#ff6600", "#0066ff", "#ff3366", "#33ffcc",];
        return colours[Math.floor(Math.random() * colours.length)];
    }
}
