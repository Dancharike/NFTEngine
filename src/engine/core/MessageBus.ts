export interface IMessage
{
    code: string;
    sender: any;
    context: any;
}

export interface IMessageHandler
{
    onMessage(message: IMessage): void;
}

export class MessageBus
{
    private _subscriptions: Map<string, Set<IMessageHandler>> = new Map();

    public subscribe(code: string, handler: IMessageHandler): void
    {
        if(!this._subscriptions.has(code))
        {
            this._subscriptions.set(code, new Set());
        }

        this._subscriptions.get(code)!.add(handler);
    }

    public unsubscribe(code: string, handler: IMessageHandler): void
    {
        this._subscriptions.get(code)?.delete(handler);
    }

    public dispatch(message: IMessage): void
    {
        const handlers = this._subscriptions.get(message.code);
        if(!handlers) {return;}

        for(const handler of handlers)
        {
            handler.onMessage(message);
        }
    }
}
