import * as THREE from "three";

export enum AssetType
{
    SPRITE = "sprite",
    AUDIO = "audio",
    FONT = "font",
    SCRIPT = "script",
    TEXT = "text",
    TEXTURE = "texture",
    MATERIAL = "material",
    GEOMETRY = "geometry",
    PREFAB = "prefab",
    SCENE = "scene",
    SHADER = "shader",
    OBJECT = "object",
    MODEL = "model",
    ANIMATION = "animation",
    LOD = "lod",
    PARTICLE = "particle",
    SKYBOX = "skybox"
}

export interface IAsset
{
    name: string,
    type: AssetType,
    loaded: boolean
}

//#region Sprite
export interface SpriteAsset extends IAsset
{
    type: AssetType.SPRITE;
    texture: THREE.Texture;
    frameWidth: number;
    frameHeight: number;
    frameCount: number;
    framesPerRow: number;
    fps: number;
    loop: boolean;
    origin: {x: number, y: number};
}

export interface SpriteConfig
{
    name: string;
    texturePath: string;
    frameWidth: number;
    frameHeight: number;
    frameCount?: number;
    framesPerRow?: number;
    fps?: number;
    loop?: boolean;
    origin?: {x: number; y: number};
}
//#endregion

//#region Audio
export interface AudioAsset extends IAsset
{
    type: AssetType.AUDIO;
    category: "sound" | "music";
    buffer: AudioBuffer;
    poolSize: number;
    volume: number;
    fadeIn: number;
    fadeOut: number;
    loop: boolean;
}

export interface AudioConfig
{
    name: string;
    category: "sound" | "music";
    audioPath: string;
    poolSize?: number;
    volume?: number;
    fadeIn?: number;
    fadeOut?: number;
    loop?: boolean;
}
//#endregion

//#region Font
export interface FontAsset extends IAsset
{
    type: AssetType.FONT;
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    colour: string;
}

export interface FontConfig
{
    name: string;
    fontFamily: string;
    fontSize: number;
    fontWeight?: number;
    colour?: string;
}
//#endregion

//#region Script
export interface ScriptAsset extends IAsset
{
    type: AssetType.SCRIPT;
    sourceCode: string;
    compiledFunction?: Function;
    dependencies: string[];
    exports: string[];
    metadata: {
        author?: string;
        version?: string;
        description?: string;
        requires?: string[];
    };
    lastModified?: number;
    hash?: string;
}

export interface ScriptConfig
{
    name: string;
    scriptPath: string;
    dependencies?: string[];
    exports?: string;
    hotReload?: boolean;
    metadata: {
        author?: string;
        version?: string;
        description?: string;
    };
}
//#endregion

//#region Text
export interface TextAsset extends IAsset
{
    type: AssetType.TEXT;
    content: string;
    format: "txt" | "json" | "md";
    parsed?: any;
    encoding: string;
}

export interface TextConfig
{
    name: string;
    filePath: string;
    format?: "txt" | "json" | "md";
    encoding?: string;
    autoParse?: boolean;
}
//#endregion

//#region Texture
export interface TextureAsset extends IAsset
{
    type: AssetType.TEXTURE;
    texture: THREE.Texture;
    width: number;
    height: number;
}

export interface TextureConfig
{
    name: string;
    texturePath: string;
    wrapS?: THREE.Wrapping;
    wrapT?: THREE.Wrapping;
    minFilter?: THREE.MinificationTextureFilter;
    magFilter?: THREE.MagnificationTextureFilter;
    anisotropy?: number;
    flipY?: boolean;
    generateMipmaps?: boolean;
}
//#endregion

//#region Material
export interface MaterialAsset extends IAsset
{
    type: AssetType.MATERIAL;
    material: THREE.Material;
    properties: Record<string, any>;
}

export interface MaterialConfig
{
    name: string;
    type: "basic" | "standard" | "phong" | "lambert" | "toon" | "points" | "line" | "sprite";
    colour?: number | string;
    opacity?: number;
    transparent?: boolean;
    side?: THREE.Side;

    metalness?: number;
    roughness?: number;
    emissive?: number | string;
    emissiveIntensity?: number;
    normalMap?: string;
    normalScale?: {x: number, y: number};
    ambientOcclusionMap?: string;
    displacementMap?: string;
    displacementScale?: number;

    wireframe?: boolean;
    wireframeLinewidth?: number;

    map?: string;
    alphaMap?: string;
    blending?: THREE.Blending;
    depthTest?: boolean;
    depthWrite?: boolean;
}
//#endregion

//#region Geometry
export interface GeometryAsset extends IAsset
{
    type: AssetType.GEOMETRY;
    geometry: THREE.BufferGeometry;
    vertices: number;
}

export interface GeometryConfig
{
    name: string;
    type: "box" | "sphere" | "cylinder" | "cone" | "plane" | "torus" | "ring" | "circle" | "shape";

    width?: number;
    height?: number;
    depth?: number;
    widthSegments?: number;
    heightSegments?: number;
    depthSegments?: number;

    radius?: number;
    segments?: number;

    radiusTop?: number;
    radiusBottom?: number;

    planeWidth?: number;
    planeHeight?: number;

    vertices?: number[];
    indices?: number[];
    normals?: number[];
    uvs?: number[];

    mergeVerticies?: boolean;
    computeNormals?: boolean;
    computeTangents?: boolean;
}
//#endregion

//#region Prefab
export interface PrefabAsset extends IAsset
{
    type: AssetType.PREFAB;
    className: string;

    sprite?: string;
    model?: string;
    visual?: {
        type: "sprite" | "model" | "geometry";
        asset: string;
        scale?: {x: number, y: number; z: number};
    };
    collider?: {
        type: "box" | "sphere" | "capsule" | "mesh";
        size?: {x: number, y: number; z: number};
        asset?: string; // для mesh коллайдера
    };
    defaultProperties: Record<string, any>;
    components: string[];
    scripts?: string[];
}

export interface PrefabConfig
{
    name: string;
    className: string;
    sprite?: string;
    model?: string;
    visual?: {
        type: "sprite" | "model" | "geometry";
        asset: string;
        scale?: {x: number; y: number; z: number;}
    };
    collider?: {
        type: "box" | "sphere" | "capsule" | "mesh";
        size?: {x: number; y: number; z: number};
        asset?: string;
    };
    defaultProperties?: Record<string, any>;
    components?: string[];
    scripts?: string[];
    lod?: string;
}
//#endregion

//#region Scene
export interface SceneAsset extends IAsset
{
    type: AssetType.SCENE;
    bounds?: {
        min: {x: number, y: number; z: number};
        max: {x: number, y: number; z: number};
    };
    gravity?: {x: number, y: number; z: number};
    lights?: Array<{
        type: string;
        position: {x: number, y: number; z: number};
        colour: number;
        intensity: number;
    }>;
    objects: Array<{
        id: string;
        type: string;
        position: {x: number, y: number, z: number};
        rotation: {x: number, y: number, z: number};
        scale: {x: number; y: number; z: number};
        properties: Record<string, any>;
        components?: Array<{
            type: string;
            config: any;
        }>;
    }>;
    metadata: {
        name: string;
        author?: string;
        description?: string;
        startingPoint?: {x: number, y: number, z: number};
        ambientLight?: {colour: number, intensity: number};
        skybox?: string;
    };
}

export interface SceneConfig
{
    name: string;
    scenePath?: string;
    objects?: Array<SceneObjectsConfig>;
    metadata?: {
        author?: string;
        version?: string;
        description?: string;
        startingPoints?: {x: number; y: number, z: number};
        ambientLight?: {
            colour?: number | string;
            intensity?: number;
        };
        fog?: {
            type: "linear" | "exponential";
            colour?: number | string;
            near?: number;
            far?: number;
            density?: number;
        };
    };
}

export interface SceneObjectsConfig
{
    id: string;
    type: "mesh" | "light" | "camera" | "group" | "empty";

    name?: string;
    position?: {x: number, y: number, z: number};
    rotation?: {x: number; y: number; z: number};
    scale?: {x: number; y: number; z: number};

    geometry?: string;
    material?: string;
    castShadow?: boolean;
    receiveShadow?: boolean;

    lightType?: "ambient" | "directional" | "point" | "spot" | "hemisphere";
    colour?: number | string;
    intensity?: number;
    distance?: number;
    angle?: number;
    penumbra?: number;
    decay?: number;
    target?: {x: number, y: number, z: number};

    cameraType?: "perspective" | "orthographic";
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
    zoom?: number;

    visible?: boolean;
    userData?: Record<string, any>;
    children?: SceneObjectsConfig[];
}
//#endregion

//#region Shader
export interface ShaderAsset extends IAsset
{
    type: AssetType.SHADER;
    vertexShader: string;
    fragmentShader: string;
    uniforms: Record<string, {
        type: "float" | "vec2" | "vec3" | "vec4" | "mat3" | "mat4" | "texture";
        value: any;
    }>;
    compiledMaterial?: THREE.ShaderMaterial;
}

export interface ShaderConfig
{
    name: string;
    vertexPath?: string;
    fragmentPath?: string;
    vertexSource?: string;
    fragmentSource?: string;
    uniforms?: Record<string, any>;
    transparent?: boolean;
    side?: THREE.Side;
}
//#endregion

//#region Object
export interface ObjectAsset extends IAsset
{
    type: AssetType.OBJECT;
    visual?: {
        type: "sprite" | "model" | "primitive";
        asset: string;
    };
    mask?: string;
    collider3D?: {
        type: "box" | "sphere" | "capsule";
        size: {x: number; y: number; z: number};
    };
    persistent?: boolean;
    parent?: string;
    events?: Record<string, string[]>;
    variables: Record<string, any>;
}

export interface ObjectConfig
{
    name: string;
    sprite?: string;
    mask?: string;
    persistent?: boolean;
    parent?: string;
    variables?: Record<string, any>;
}
//#endregion

//#region Model
export interface ModelAsset extends IAsset
{
    type: AssetType.MODEL;
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
    meshes: THREE.Mesh[];
    materials: THREE.Material[];
    textures: THREE.Texture[];
    skeleton?: THREE.Skeleton;
}

export interface ModelConfig
{
    name: string;
    modelPath: string;
    scale?: {x: number; y: number; z: number} | number;
    position?: {x: number; y: number; z: number};
    rotation?: {x: number; y: number; z: number};
    castShadow?: boolean;
    receiveShadow?: boolean;
    animations?: string[];
    materials?: Record<string, string>;
    lod?: boolean;
}
//#endregion

//#region Animation
export interface AnimationAsset extends IAsset
{
    type: AssetType.ANIMATION;
    clip: THREE.AnimationClip;
    duration: number;
    fps: number;
    loop: boolean;
}

export interface AnimationConfig
{
    name: string;
    animationPath: string;
    clipName?: string;
    loop?: boolean;
    speed?: number;
}
//#endregion

//#region LOD
export interface LODAsset extends IAsset
{
    type: AssetType.LOD;
    levels: Array<{
        geometry: THREE.BufferGeometry,
        distance: number;
    }>;
}

export interface LODConfig
{
    name: string;
    levels: Array<{
        geometry: string;
        distance: number;
    }>;
}
//#endregion

//#region Particle
export interface ParticleAsset extends IAsset
{
    type: AssetType.PARTICLE;
    maxParticles: number;
    texture: string;
    parameters: {
        lifetime?: {min: number; max: number};
        velocity?: {min: {x: number; y: number; z: number}; max: {x: number; y: number; z: number}};
        size?: {start: number; end: number};
        colour?: {start: ColourRGB; end: ColourRGB};
        opacity?: {start: number; end: number};
        rotation?: {min: number; max: number};
        blending?: THREE.Blending;
    };
    emitter: {
        type: "point" | "box" | "sphere" | "cone";
        size?: {x: number; y: number; z: number};
        angle?: number;
    };
}

export interface ParticleConfig
{
    name: string;
    texture: string;
    maxParticles?: number;
    parameters?: {
        lifetime?: {min?: number; max?: number};
        velocity?: {min?: {x?: number; y?: number; z?: number}; max?: {x?: number; y?: number; z?: number}};
        size?: {start?: number; end?: number};
        colour?: {start?: ColourRGB; end?: ColourRGB};
        opacity?: {start?: number; end?: number};
        rotation?: {min?: number; max?: number};
        blending?: THREE.Blending;
    };
    emitter?: {
        type?: "point" | "box" | "sphere" | "cone";
        size?: {x?: number; y?: number; z?: number};
        angle?: number;
    };
}
//#endregion

//#region Skybox
export interface SkyboxAsset extends IAsset
{
    type: AssetType.SKYBOX;
    texture: THREE.CubeTexture;
    size: number;
}

export interface SkyboxConfig
{
    name: string;
    paths?: {
        px: string;
        nx: string;
        py: string;
        ny: string;
        pz: string;
        nz: string;
    };
    equirectangularPath?: string;
    size?: number;
}
//#endregion

export type AssetConfig<T extends AssetType> = 
    T extends AssetType.SPRITE ? SpriteConfig :
    T extends AssetType.AUDIO ? AudioConfig :
    T extends AssetType.FONT ? FontConfig :
    T extends AssetType.TEXTURE ? TextureConfig :
    T extends AssetType.MATERIAL ? MaterialConfig :
    T extends AssetType.GEOMETRY ? GeometryConfig :
    T extends AssetType.PREFAB ? PrefabConfig :
    T extends AssetType.SCENE ? SceneConfig :
    T extends AssetType.SCRIPT ? ScriptConfig :
    T extends AssetType.TEXT ? TextConfig :
    T extends AssetType.SHADER ? ShaderConfig :
    T extends AssetType.OBJECT ? ObjectConfig :
    T extends AssetType.MODEL ? ModelConfig :
    T extends AssetType.ANIMATION ? AnimationConfig :
    T extends AssetType.LOD ? LODConfig :
    T extends AssetType.PARTICLE ? ParticleConfig :
    T extends AssetType.SKYBOX ? SkyboxConfig :
    never;

export interface ColourRGB
{
    r: number;
    g: number;
    b: number;
    a?: number;
}

export namespace ColourUtils
{
    export function toThreeJS(colour: ColourRGB): THREE.Color
    {
        return new THREE.Color(colour.r / 255, colour.g / 255, colour.b / 255);
    }

    export function fromHex(hex: number): ColourRGB
    {
        return {
            r: (hex >> 16) & 255,
            g: (hex >> 8) & 255,
            b: hex & 255,
            a: 255
        };
    }

    export function toHex(colour: ColourRGB): number
    {
        return (colour.r << 16) | (colour.g << 8) | colour.b;
    }
}
