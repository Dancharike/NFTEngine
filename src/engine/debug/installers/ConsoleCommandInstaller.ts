import {ICommandInstaller, DebugCommand} from "../DebugCommand";
import {DebugCommandRegistry} from "../DebugCommandRegistry";
import {DebugController} from "../DebugController";

export const CLEAR_SIGNAL = "__clear__";

export class ConsoleCommandInstaller implements ICommandInstaller
{
    public readonly groupName = "Console";

    public install(registry: DebugCommandRegistry): void
    {
        registry.register(this.groupName, new DebugCommand(
            "help",
            "Lists all available commands",
            "help",
            () =>
            {
                const ctrl = DebugController.instance;
                let output = "";

                for(const installer of ctrl.installers)
                {
                    const cmds = ctrl.registry.getAccessible(ctrl.isDeveloperMode)
                        .filter(c => c.groupName === installer.groupName);

                    if(cmds.length === 0) continue;

                    output += `<span class="cmd-group">${installer.groupName}</span>\n`;
                    for(const cmd of cmds)
                    {
                        output += `  <span class="cmd-format">${cmd.commandFormat}</span> — ${cmd.commandDescription}\n`;
                    }
                }

                return output.trimEnd();
            }
        ));

        registry.register(this.groupName, new DebugCommand(
            "clear",
            "Clears all console logs",
            "clear",
            () => CLEAR_SIGNAL
        ));
    }
}
