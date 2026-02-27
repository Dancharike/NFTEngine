import {ServiceLocator} from "../core/ServiceLocator";
import {ServiceKeys} from "../services/ServiceKeys";
import {IInputService} from "@engine/services/InputService";

export class Input
{
    public static isKeyPressed(key: string): boolean            {return ServiceLocator.get<IInputService>(ServiceKeys.INPUT).isKeyPressed(key);}
    public static isKeyDown(key: string): boolean               {return ServiceLocator.get<IInputService>(ServiceKeys.INPUT).isKeyDown(key);}
    public static isKeyUp(key: string): boolean                 {return ServiceLocator.get<IInputService>(ServiceKeys.INPUT).isKeyUp(key);}
    public static getMousePosition(): {x: number, y: number}    {return ServiceLocator.get<IInputService>(ServiceKeys.INPUT).getMousePosition();}
    public static isMouseButtonPressed(button: number): boolean {return ServiceLocator.get<IInputService>(ServiceKeys.INPUT).isMouseButtonPressed(button);}
    public static isMouseButtonDown(button: number): boolean    {return ServiceLocator.get<IInputService>(ServiceKeys.INPUT).isMouseButtonDown(button);}
    public static isMouseButtonUp(button: number): boolean      {return ServiceLocator.get<IInputService>(ServiceKeys.INPUT).isMouseButtonUp(button);}
}
