import {DebugCommandBase, CommandAccessLevel} from "./DebugCommand";

export class DebugCommandRegistry
{
    private readonly _commands: DebugCommandBase[] = [];

    public register(groupName: string, cmd: DebugCommandBase): void
    {
        cmd.groupName = groupName;
        this._commands.push(cmd);
    }

    public findExact(input: string, developerMode: boolean): DebugCommandBase | null
    {
        const lower = input.trim().toLowerCase();
        return this.getAccessible(developerMode).find(c => c.commandId === lower) ?? null;
    }

    public findSuggestions(prefix: string, developerMode: boolean): DebugCommandBase[]
    {
        const lower = prefix.toLowerCase();
        return this.getAccessible(developerMode).filter(c => c.commandId.startsWith(lower));
    }

    public getAccessible(developerMode: boolean): DebugCommandBase[]
    {
        return this._commands.filter(c => c.accessLevel === CommandAccessLevel.Everyone || (developerMode && c.accessLevel === CommandAccessLevel.DeveloperOnly));
    }
}
