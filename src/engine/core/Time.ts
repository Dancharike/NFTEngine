import {ServiceLocator} from "./ServiceLocator";
import {ServiceKeys} from "../services/ServiceKeys";
import {ITimeService} from "../services/TimeService";

export class Time
{
    public static get deltaTime(): number {return ServiceLocator.get<ITimeService>(ServiceKeys.TIME).deltaTime;}
    public static get elapsed(): number   {return ServiceLocator.get<ITimeService>(ServiceKeys.TIME).elapsed;}
    public static get fps(): number       {return ServiceLocator.get<ITimeService>(ServiceKeys.TIME).fps;}
}
