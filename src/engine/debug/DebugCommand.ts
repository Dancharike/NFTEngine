import {DebugCommandRegistry} from "./DebugCommandRegistry";

export interface ICommandInstaller
{
    readonly groupName: string;
    install(registry: DebugCommandRegistry): void;
}

export enum CommandAccessLevel
{
    Everyone,
    DeveloperOnly
}

export abstract class DebugCommandBase
{
    public groupName: string = "";
    public isToggle: boolean = false;

    public constructor(
        public readonly commandId: string,
        public readonly commandDescription: string,
        public readonly commandFormat: string,
        public readonly accessLevel: CommandAccessLevel = CommandAccessLevel.Everyone
    ) {}

    public abstract tryExecute(arg: string | null): {error: string | null, result: string | null};
}

export class DebugCommand extends DebugCommandBase
{
    private readonly _command: () => string | null;

    public constructor(
        id: string,
        description: string,
        format: string,
        command: () => string | null | void,
        accessLevel: CommandAccessLevel = CommandAccessLevel.Everyone
    )
    {
        super(id, description, format, accessLevel);
        this._command = () => command() as string | null ?? null;
    }

    public tryExecute(arg: string | null): {error: string | null; result: string | null;}
    {
        const result = this._command();
        return {error: null, result};
    }

    public asToggle(): this
    {
        this.isToggle = true;
        return this;
    }
}

export class DebugCommandWithArg<T> extends DebugCommandBase
{
    private readonly _command: (value: T) => void;
    private readonly _parser: (arg: string) => {success: boolean, value: T};

    public constructor(
        id: string,
        description: string,
        format: string,
        command: (value: T) => void,
        parser: (arg: string) => {success: boolean, value: T},
        accessLevel: CommandAccessLevel = CommandAccessLevel.Everyone
    )
    {
        super(id, description, format, accessLevel);
        this._command = command;
        this._parser = parser;
    }

    public tryExecute(arg: string | null): {error: string | null; result: string | null;}
    {
        if(arg === null) {return {error: `Expected argument. Format: ${this.commandFormat}`, result: null};}

        const {success, value} = this._parser(arg.trim());
        if(!success) {return {error: `Invalid argument. Format: ${this.commandFormat}`, result: null};}

        this._command(value);
        return {error: null, result: null};
    }
}
