import {ICommandInstaller, CommandAccessLevel, DebugCommand} from "../DebugCommand";
import {DebugCommandRegistry} from "../DebugCommandRegistry";

export class SystemCommandInstaller implements ICommandInstaller
{
    public readonly groupName = "System";

    public install(registry: DebugCommandRegistry): void
    {
        registry.register(this.groupName, new DebugCommand(
            "sys_info",
            "Displays system information",
            "sys_info",
            () =>
            {
                const nav = navigator as any;
                return [
                    `<span class="cmd-format">User Agent:</span> ${navigator.userAgent}`,
                    `<span class="cmd-format">Platform:</span> ${nav.userAgentData?.platform ?? navigator.platform}`,
                    `<span class="cmd-format">Resolution:</span> ${window.screen.width}x${window.screen.height}`,
                    `<span class="cmd-format">Window:</span> ${window.innerWidth}x${window.innerHeight}`,
                    `<span class="cmd-format">Device Pixel Ratio:</span> ${window.devicePixelRatio}`,
                ].join("\n");
            },
            CommandAccessLevel.DeveloperOnly
        ));
    }
}
