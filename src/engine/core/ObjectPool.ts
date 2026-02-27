export interface IPoolable
{
    readonly isActive: boolean;
    reset(): void;
    activate(): void;
    deactivate(): void;
}

export class ObjectPool<T extends IPoolable>
{
    private _pool: T[] = [];
    private _factory: () => T;
    private _maxSize: number;

    public constructor(factory: () => T, initialSize: number = 10, maxSize: number = 100)
    {
        this._factory = factory;
        this._maxSize = maxSize;

        for(let i = 0; i < initialSize; i++)
        {
            const obj = this._factory();
            obj.deactivate();
            this._pool.push(obj);
        }
    }

    public get(): T
    {
        for(const obj of this._pool)
        {
            if(!obj.isActive)
            {
                obj.reset();
                obj.activate();
                return obj;
            }
        }

        if(this._pool.length < this._maxSize)
        {
            const obj = this._factory();
            obj.reset();
            obj.activate();
            this._pool.push(obj);
            return obj;
        }

        throw new Error(`ObjectPool: max size of ${this._maxSize} reached`);
    }

    public release(obj: T): void
    {
        obj.deactivate();
    }

    public releaseAll(): void
    {
        for(const obj of this._pool)
        {
            obj.deactivate();
        }
    }

    public get activeCount(): number  {return this._pool.filter(o => o.isActive).length;}
    public get totalCount(): number   {return this._pool.length;}
    public get freeCount(): number    {return this._pool.filter(o => !o.isActive).length;}
}
