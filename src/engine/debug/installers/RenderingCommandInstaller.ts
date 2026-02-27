import {ICommandInstaller, DebugCommand, DebugCommandWithArg} from "../DebugCommand";
import {DebugCommandRegistry} from "../DebugCommandRegistry";
import {Time} from "@engine/api/Time";
import {FpsWidget} from "../widgets/FpsWidget";
import {FpsGraphWidget} from "../widgets/FpsGraphWidget";
import {Engine} from "@engine/core/Engine";

export class RenderingCommandInstaller implements ICommandInstaller
{
    public readonly groupName = "Rendering";

    public constructor(private readonly _engine: Engine) {}

    public install(registry: DebugCommandRegistry): void
    {
        registry.register(this.groupName, new DebugCommand(
            "fps_show",
            "Shows current FPS in console",
            "fps_show",
            () =>
            {
                FpsWidget.instance.toggle();
                return `FPS Widget: ${FpsWidget.instance.isVisible ? "<span class='ok'>ON</span>" : "<span class='err'>OFF</span>"}`;
            }
        ).asToggle());

        registry.register(this.groupName, new DebugCommand(
            "fps_graph",
            "Toggles FPS graph widget",
            "fps_graph",
            () =>
            {
                FpsGraphWidget.instance.toggle();
                return `FPS Graph: ${FpsGraphWidget.instance.isVisible ? "<span class='ok'>ON</span>" : "<span class='err'>OFF</span>"}`;
            }
        ).asToggle());

        registry.register(this.groupName, new DebugCommandWithArg<number>(
            "fps_set",
            "Sets FPS limit (0 = unlimited)",
            "fps_set <value>",
            value => this._engine.setFpsLimit(value),
            arg =>
            {
                const v = parseInt(arg);
                return isNaN(v) ? {success: false, value: 0} : {success: true, value: v};
            }
        ));

        registry.register(this.groupName, new DebugCommand(
            "fps_unlock",
            "Removes FPS limit",
            "fps_unlock",
            () =>
            {
                this._engine.setFpsLimit(0);
                return "FPS unlocked.";
            }
        ));
    }
}
