type EventConstructor<T> = new (...args: any[]) => T;
type EventHandler<T> = (event: T) => void;

export class EventBus
{
    private static _handlers: Map<EventConstructor<any>, Set<EventHandler<any>>> = new Map();

    private constructor() {}

    public static on<T>(eventType: EventConstructor<T>, handler: EventHandler<T>): void
    {
        if(!this._handlers.has(eventType))
        {
            this._handlers.set(eventType, new Set());
        }

        this._handlers.get(eventType)!.add(handler);
    }

    public static off<T>(eventType: EventConstructor<T>, handler: EventHandler<T>): void
    {
        this._handlers.get(eventType)?.delete(handler);
    }

    public static emit<T extends object>(event: T): void
    {
        const eventType = event.constructor as EventConstructor<T>;
        const handlers  = this._handlers.get(eventType);
        if(!handlers) {return;}

        for(const handler of handlers)
        {
            handler(event);
        }
    }

    public static clear<T>(eventType: EventConstructor<T>): void
    {
        this._handlers.delete(eventType);
    }

    public static clearAll(): void
    {
        this._handlers.clear();
    }
}
