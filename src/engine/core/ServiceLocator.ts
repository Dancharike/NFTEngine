export interface IService {}

export class ServiceLocator
{
    private static _services: Map<string, IService> = new Map();

    private constructor() {}

    public static register<T extends IService>(key: string, servive: T): void
    {
        if(this._services.has(key)) {console.warn(`ServiceLocator: overwriting service "${key}"`);}
        this._services.set(key, servive);
    }

    public static get<T extends IService>(key: string): T
    {
        const service = this._services.get(key);
        if(!service) {throw new Error(`ServiceLocator: service "${key}" not found`);}
        return service as T;
    }

    public static has(key: string): boolean
    {
        return this._services.has(key);
    }

    public static unregister(key: string): void
    {
        this._services.delete(key);
    }
}
