import * as THREE from "three";
import {AssetType, IAsset, 
    SpriteAsset, SpriteConfig, 
    AudioAsset, AudioConfig, 
    TextureAsset, TextureConfig, 
    GeometryAsset, GeometryConfig, 
    MaterialAsset, MaterialConfig, 
    ColourUtils} from "@engine/assets/AssetTypes";

export class AssetManager
{
    private static _assets: Map<string, IAsset> = new Map();
    private static _textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    private static _audioContext: AudioContext | null = null;
    private static _isInitialized: boolean = false;

    private constructor() {}
    
    public static initialize(): void
    {
        if(this._isInitialized) {return;}
        
        this._audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this._isInitialized = true;
        
        console.log("AssetManager initialized");
    }
    
    public static dispose(): void
    {
        this._assets.forEach(asset => {
            const a = asset as any;
            if('texture' in asset && a.texture instanceof THREE.Texture) {a.texture.dispose();}
            if('material' in asset && a.material instanceof THREE.Material) {a.material.dispose();}
            if('geometry' in asset && a.geometry instanceof THREE.BufferGeometry) {a.geometry.dispose();}
        });
        
        this._assets.clear();
        
        if(this._audioContext)
        {
            this._audioContext.close();
            this._audioContext = null;
        }
        
        this._isInitialized = false;
        console.log("AssetManager disposed");
    }
    
    public static async load<T extends AssetType>(type: T, config: any): Promise<IAsset>
    {
        switch(type)
        {
            case AssetType.SPRITE:   return await this.loadSprite(config as SpriteConfig);
            case AssetType.TEXTURE:  return await this.loadTexture(config as TextureConfig);
            case AssetType.AUDIO:    return await this.loadAudio(config as AudioConfig);
            case AssetType.GEOMETRY: return await this.loadGeometry(config as GeometryConfig);
            case AssetType.MATERIAL: return await this.loadMaterial(config as MaterialConfig);
            default:                 throw new Error(`Asset type ${type} not implemented yet`);
        }
    }
    
    public static get<T extends IAsset>(name: string): T | null
    {
        return (this._assets.get(name) as T) || null;
    }

    public static getAsset<T>(name: string): T | null
    {
        const asset = this.get<IAsset>(name);
        return asset as T | null;
    }
    
    public static has(name: string): boolean
    {
        return this._assets.has(name);
    }
    
    public static remove(name: string): void
    {
        const asset = this._assets.get(name);
        if(asset)
        {
            const a = asset as any;
            if('texture' in asset && a.texture instanceof THREE.Texture) {a.texture.dispose();}
            if('material' in asset && a.material instanceof THREE.Material) {a.material.dispose();}
            if('geometry' in asset && a.geometry instanceof THREE.BufferGeometry) {a.geometry.dispose();}
            
            this._assets.delete(name);
        }
    }
    
    public static async loadBatch(configs: Array<{type: AssetType, config: any}>): Promise<void>
    {
        const promises = configs.map(({type, config}) => this.load(type, config));
        await Promise.all(promises);
        console.log(`Batch loaded: ${configs.length} assets`);
    }
    
    private static async loadSprite(config: SpriteConfig): Promise<SpriteAsset>
    {
        if(this._assets.has(config.name)) {return this._assets.get(config.name) as SpriteAsset;}
        
        return new Promise((resolve, reject) => {
            this._textureLoader.load(
                config.texturePath,
                (texture) => {
                    texture.magFilter = THREE.NearestFilter;
                    texture.minFilter = THREE.NearestFilter;
                    
                    const imageWidth = texture.image.width;
                    const imageHeight = texture.image.height;
                    
                    const framesPerRow = config.framesPerRow || Math.floor(imageWidth / config.frameWidth);
                    const frameCount = config.frameCount || (Math.floor(imageWidth / config.frameWidth) * Math.floor(imageHeight / config.frameHeight));
                    
                    const asset: SpriteAsset = {
                        name: config.name,
                        type: AssetType.SPRITE,
                        loaded: true,
                        texture: texture,
                        frameWidth: config.frameWidth,
                        frameHeight: config.frameHeight,
                        frameCount: frameCount,
                        framesPerRow: framesPerRow,
                        fps: config.fps || 10,
                        loop: config.loop !== false,
                        origin: config.origin || {x: 0.5, y: 0.5}
                    };
                    
                    this._assets.set(config.name, asset);
                    console.log(`Sprite loaded: ${config.name} (${frameCount} frames)`);
                    resolve(asset);
                },
                undefined,
                (error) => {
                    console.error(`Failed to load sprite: ${config.name}`, error);
                    reject(error);
                }
            );
        });
    }
    
    private static async loadTexture(config: TextureConfig): Promise<TextureAsset>
    {
        if(this._assets.has(config.name)) {return this._assets.get(config.name) as TextureAsset;}
        
        return new Promise((resolve, reject) => {
            this._textureLoader.load(
                config.texturePath,
                (texture) => {
                    if(config.wrapS !== undefined) {texture.wrapS = config.wrapS;}
                    if(config.wrapT !== undefined) {texture.wrapT = config.wrapT;}
                    if(config.minFilter !== undefined) {texture.minFilter = config.minFilter;}
                    if(config.magFilter !== undefined) {texture.magFilter = config.magFilter;}
                    if(config.anisotropy !== undefined) {texture.anisotropy = config.anisotropy;}
                    if(config.flipY !== undefined) {texture.flipY = config.flipY;}
                    if(config.generateMipmaps !== undefined) {texture.generateMipmaps = config.generateMipmaps;}
                    
                    texture.needsUpdate = true;
                    
                    const asset: TextureAsset = {
                        name: config.name,
                        type: AssetType.TEXTURE,
                        loaded: true,
                        texture: texture,
                        width: texture.image.width,
                        height: texture.image.height
                    };
                    
                    this._assets.set(config.name, asset);
                    console.log(`Texture loaded: ${config.name} (${asset.width}x${asset.height})`);
                    resolve(asset);
                },
                undefined,
                (error) => {
                    console.error(`Failed to load texture: ${config.name}`, error);
                    reject(error);
                }
            );
        });
    }
    
    private static async loadAudio(config: AudioConfig): Promise<AudioAsset>
    {
        if(this._assets.has(config.name)) {return this._assets.get(config.name) as AudioAsset;}
        
        if(!this._audioContext) {throw new Error("AudioContext not initialized");}
        
        try
        {
            const response = await fetch(config.audioPath);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
            
            const asset: AudioAsset = {
                name: config.name,
                type: AssetType.AUDIO,
                loaded: true,
                category: config.category,
                buffer: audioBuffer,
                poolSize: config.poolSize || (config.category === "sound" ? 3 : 1),
                volume: config.volume || (config.category === "music" ? 0.7 : 1.0),
                fadeIn: config.fadeIn || 0,
                fadeOut: config.fadeOut || 0,
                loop: config.loop || (config.category === "music")
            };
            
            this._assets.set(config.name, asset);
            console.log(`Audio loaded: ${config.name} [${config.category}] (${audioBuffer.duration.toFixed(2)}s)`);
            return asset;
        }
        catch(error)
        {
            console.error(`Failed to load audio: ${config.name}`, error);
            throw error;
        }
    }
    
    private static async loadGeometry(config: GeometryConfig): Promise<GeometryAsset>
    {
        if(this._assets.has(config.name)) {return this._assets.get(config.name) as GeometryAsset;}
        
        let geometry: THREE.BufferGeometry;
        
        switch(config.type)
        {
            case "box":
                geometry = new THREE.BoxGeometry(
                    config.width || 1,
                    config.height || 1,
                    config.depth || 1,
                    config.widthSegments || 1,
                    config.heightSegments || 1,
                    config.depthSegments || 1
                );
                break;
                
            case "sphere":
                geometry = new THREE.SphereGeometry(
                    config.radius || 1,
                    config.widthSegments || 32,
                    config.heightSegments || 16
                );
                break;
                
            case "cylinder":
                geometry = new THREE.CylinderGeometry(
                    config.radiusTop || 1,
                    config.radiusBottom || 1,
                    config.height || 1,
                    config.segments || 32
                );
                break;
                
            case "cone":
                geometry = new THREE.ConeGeometry(
                    config.radius || 1,
                    config.height || 1,
                    config.segments || 32
                );
                break;
                
            case "plane":
                geometry = new THREE.PlaneGeometry(
                    config.planeWidth || config.width || 1,
                    config.planeHeight || config.height || 1,
                    config.widthSegments || 1,
                    config.heightSegments || 1
                );
                break;
                
            case "torus":
                geometry = new THREE.TorusGeometry(
                    config.radius || 1,
                    config.radiusBottom || 0.4,
                    config.heightSegments || 16,
                    config.segments || 100
                );
                break;
                
            case "ring":
                geometry = new THREE.RingGeometry(
                    config.radiusBottom || 0.5,
                    config.radius || 1,
                    config.segments || 32
                );
                break;
                
            case "circle":
                geometry = new THREE.CircleGeometry(
                    config.radius || 1,
                    config.segments || 32
                );
                break;
                
            default: throw new Error(`Geometry type ${config.type} not supported`);
        }
        
        if(config.computeNormals) {geometry.computeVertexNormals();}
        
        const asset: GeometryAsset = {
            name: config.name,
            type: AssetType.GEOMETRY,
            loaded: true,
            geometry: geometry,
            vertices: geometry.attributes.position.count
        };
        
        this._assets.set(config.name, asset);
        console.log(`Geometry loaded: ${config.name} [${config.type}] (${asset.vertices} vertices)`);
        return asset;
    }
    
    private static async loadMaterial(config: MaterialConfig): Promise<MaterialAsset>
    {
        if(this._assets.has(config.name)) {return this._assets.get(config.name) as MaterialAsset;}
        
        let material: THREE.Material;
        
        const commonParams: any = {
            transparent: config.transparent || false,
            opacity: config.opacity || 1,
            side: config.side || THREE.FrontSide,
            wireframe: config.wireframe || false,
            depthTest: config.depthTest !== false,
            depthWrite: config.depthWrite !== false
        };
        
        if(config.colour !== undefined)
        {
            const colour = typeof config.colour === 'string'  ? new THREE.Color(config.colour) : new THREE.Color(config.colour);
            commonParams.color = colour;
        }
        
        if(config.map)
        {
            const textureAsset = this.get<TextureAsset>(config.map);
            if(textureAsset) {commonParams.map = textureAsset.texture;}
        }
        
        if(config.alphaMap)
        {
            const alphaAsset = this.get<TextureAsset>(config.alphaMap);
            if(alphaAsset) {commonParams.alphaMap = alphaAsset.texture;}
        }
        
        switch(config.type)
        {
            case "basic":
                material = new THREE.MeshBasicMaterial(commonParams);
                break;
                
            case "standard":
                material = new THREE.MeshStandardMaterial({
                    ...commonParams,
                    metalness: config.metalness || 0,
                    roughness: config.roughness || 1,
                    emissive: config.emissive ? new THREE.Color(config.emissive as any) : new THREE.Color(0x000000),
                    emissiveIntensity: config.emissiveIntensity || 1
                });
                
                if(config.normalMap)
                {
                    const normalAsset = this.get<TextureAsset>(config.normalMap);
                    if(normalAsset)
                    {
                        (material as THREE.MeshStandardMaterial).normalMap = normalAsset.texture;
                        if(config.normalScale) {(material as THREE.MeshStandardMaterial).normalScale = new THREE.Vector2(config.normalScale.x, config.normalScale.y);}
                    }
                }
                break;
                
            case "phong":
                material = new THREE.MeshPhongMaterial(commonParams);
                break;
                
            case "lambert":
                material = new THREE.MeshLambertMaterial(commonParams);
                break;
                
            case "toon":
                material = new THREE.MeshToonMaterial(commonParams);
                break;
                
            case "points":
                material = new THREE.PointsMaterial(commonParams);
                break;
                
            case "line":
                material = new THREE.LineBasicMaterial(commonParams);
                break;
                
            case "sprite":
                material = new THREE.SpriteMaterial(commonParams);
                break;
                
            default: throw new Error(`Material type ${config.type} not supported`);
        }
        
        const asset: MaterialAsset = {
            name: config.name,
            type: AssetType.MATERIAL,
            loaded: true,
            material: material,
            properties: {...config}
        };
        
        this._assets.set(config.name, asset);
        console.log(`Material loaded: ${config.name} [${config.type}]`);
        return asset;
    }
    
    public static getAudioContext(): AudioContext | null
    {
        return this._audioContext;
    }
    
    public static getAllByType<T extends IAsset>(type: AssetType): T[]
    {
        const result: T[] = [];
        this._assets.forEach(asset => {
            if(asset.type === type) {result.push(asset as T);}
        });

        return result;
    }
    
    public static getStats(): Record<AssetType, number>
    {
        const stats: any = {};
        
        Object.values(AssetType).forEach(type => {
            stats[type] = 0;
        });
        
        this._assets.forEach(asset => {
            stats[asset.type]++;
        });
        
        return stats;
    }
    
    public static printStats(): void
    {
        const stats = this.getStats();
        console.log("=".repeat(50));
        console.log("Asset Manager Statistics");
        console.log("=".repeat(50));
        
        let total = 0;
        Object.entries(stats).forEach(([type, count]) => {
            if(count > 0)
            {
                console.log(`${type.padEnd(12)}: ${count}`);
                total += count;
            }
        });
    }
}
