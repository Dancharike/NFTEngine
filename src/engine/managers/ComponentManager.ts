import {Component} from "@engine/components/Component";
import {GameObject} from "@engine/core/GameObject";
import {IMessage} from "@engine/core/MessageBus";

export class ComponentManager
{
    private _components: Map<string, Component> = new Map();
    private _owner: GameObject;

    public constructor(owner: GameObject)
    {
        this._owner = owner;
    }

    public add<T extends Component>(component: T): T
    {
        if(this._components.has(component.name))
        {
            console.warn(`Component ${component.name} already exists on ${this._owner.name}`);
            return this._components.get(component.name) as T;
        }

        this._components.set(component.name, component);
        component.load();
        return component;
    }

    public get<T extends Component>(name: string): T | null
    {
        return (this._components.get(name) as T) || null;
    }

    public getAll(): Component[]
    {
        return Array.from(this._components.values());
    }

    public getByType<T extends Component>(type: new (...args: any[]) => T): T | null
    {
        for(const component of this._components.values())
        {
            if(component instanceof type) {return component as T;}
        }
        
        return null;
    }

    public has(name: string): boolean
    {
        return this._components.has(name);
    }

    public update(): void
    {
        for(const component of this._components.values())
        {
            if(component.enabled) {component.update();}
        }
    }

    public remove(name: string): void
    {
        const component = this._components.get(name);
        if(component)
        {
            component.destroy();
            this._components.delete(name);
        }
    }
    
    public destroyAll(): void
    {
        for(const component of this._components.values())
        {
            component.destroy();
        }
        
        this._components.clear();
    }

    public broadcastMessage(message: IMessage): void
    {
        for(const component of this._components.values())
        {
            if(component.enabled) {component.onMessage(message);}
        }
    }
}
