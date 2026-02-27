import {Engine} from "@engine/core/Engine";
import {DebugCommandRegistry} from "./DebugCommandRegistry";
import {ICommandInstaller} from "./DebugCommand";
import {ConsoleCommandInstaller} from "./installers/ConsoleCommandInstaller";
import {GeneralCommandInstaller} from "./installers/GeneralCommandInstaller";
import {RenderingCommandInstaller} from "./installers/RenderingCommandInstaller";
import {SystemCommandInstaller} from "./installers/SystemCommandInstaller";

export class DebugController
{
    private static _instance: DebugController;
    public static get instance(): DebugController { return DebugController._instance; }

    public readonly registry: DebugCommandRegistry;
    public isDeveloperMode: boolean = false;

    private readonly _installers: ICommandInstaller[];

    public constructor(private readonly _engine: Engine)
    {
        DebugController._instance = this;
        this.registry = new DebugCommandRegistry();

        this._installers = [
            new ConsoleCommandInstaller(),
            new GeneralCommandInstaller(_engine),
            new RenderingCommandInstaller(_engine),
            new SystemCommandInstaller(),
        ];

        for(const installer of this._installers)
        {
            installer.install(this.registry);
        }
    }

    public get installers(): readonly ICommandInstaller[] {return this._installers;}

    public toggleDeveloperMode(): void
    {
        this.isDeveloperMode = !this.isDeveloperMode;
    }
}
