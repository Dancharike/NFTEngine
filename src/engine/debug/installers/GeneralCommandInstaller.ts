import {ICommandInstaller, DebugCommand, CommandAccessLevel} from "../DebugCommand";
import {DebugCommandRegistry} from "../DebugCommandRegistry";
import {DebugController} from "../DebugController";
import {Engine} from "@engine/core/Engine";

export class GeneralCommandInstaller implements ICommandInstaller
{
    public readonly groupName = "General";

    public constructor(private readonly _engine: Engine) {}

    public install(registry: DebugCommandRegistry): void
    {
        registry.register(this.groupName, new DebugCommand(
            "dev_mode",
            "Enables/Disables developer mode",
            "dev_mode",
            () =>
            {
                DebugController.instance.toggleDeveloperMode();
                const on = DebugController.instance.isDeveloperMode;
                return `Developer mode: ${on ? "<span class='ok'>ON</span>" : "<span class='err'>OFF</span>"}`;
            }
        ));

        registry.register(this.groupName, new DebugCommand(
            "scene_restart",
            "Restarts the current scene",
            "scene_restart",
            () =>
            {
                this._engine.restartScene();
                return "Scene restarting...";
            },
            CommandAccessLevel.DeveloperOnly
        ));

        registry.register(this.groupName, new DebugCommand(
            "game_end",
            "Stops the engine",
            "game_end",
            () =>
            {
                this._engine.stop();
                return "Engine stopped.";
            }
        ));
    }
}
