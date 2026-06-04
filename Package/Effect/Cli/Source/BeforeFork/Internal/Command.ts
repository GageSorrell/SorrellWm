/**
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable */

import type * as CliApp from "../CliApp.js";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as EffectCommand from "@effect/cli/Command";
import type { ValidationError } from "../ValidationError.js";

export type PowerShellCompletionShell = "powershell" | "pwsh";

export interface PowerShellCompletionsRunOptions<A>
    extends Omit<CliApp.CliApp.ConstructorArgs<A>, "command">
{
    readonly powerShellCommandNames?: ReadonlyArray<string>;
}

type CompletionKind =
    | "None"
    | "WordList"
    | "FileSystem"
    | "Directory";

interface CompletionSpecification
{
    readonly kind: CompletionKind;
    readonly values: ReadonlyArray<string>;
}

interface ParsedBashCompletions
{
    readonly completionMap: ReadonlyMap<string, ReadonlyArray<string>>;
    readonly optionValueCompletionMap: ReadonlyMap<
        string,
        ReadonlyMap<string, CompletionSpecification>
    >;
}

export const RunWithPowerShellCompletions = <
    Name extends string,
    Requirements,
    Error,
    Value
>(
    CommandValue: EffectCommand.Command<Name, Requirements, Error, Value>,
    Options: PowerShellCompletionsRunOptions<Value>
) =>
{
    type Runner = (args: ReadonlyArray<string>) => Effect.Effect<
        void,
        | Error
        | ValidationError,
        | Requirements
        | CliApp.CliApp.Environment
    >;
    const EffectCliRunner: Runner = EffectCommand.run(CommandValue, Options);

    return (Arguments: ReadonlyArray<string>) =>
    {
        const RequestedCompletionShell: PowerShellCompletionShell | undefined =
            GetRequestedCompletionShell(Arguments);

        if (RequestedCompletionShell !== undefined)
        {
            return PrintPowerShellCompletions(CommandValue, Options);
        }

        return EffectCliRunner(Arguments);
    };
};

export const GetPowerShellSessionCompletionCommand = (
    ExecutableName: string
): string =>
    `${ExecutableName} --completions powershell | Out-String | Invoke-Expression`;

export const GetPowerShellProfileCompletionCommand = (
    ExecutableName: string
): string =>
    `${ExecutableName} --completions powershell | Add-Content $PROFILE`;

const PrintPowerShellCompletions = <
    Name extends string,
    Requirements,
    Error,
    Value
>(
    CommandValue: EffectCommand.Command<Name, Requirements, Error, Value>,
    Options: PowerShellCompletionsRunOptions<Value>
) =>
    Effect.gen(function* ()
    {
        const RootCommandName: string = GetRootCommandName(CommandValue);
        const PowerShellCommandNames: ReadonlyArray<string> = Options.powerShellCommandNames
            ?? [ Options.executable ?? RootCommandName ];

        const BashCompletionLines = yield* EffectCommand.getBashCompletions(
            CommandValue,
            RootCommandName
        );

        const ParsedCompletions = ParseBashCompletions(BashCompletionLines);

        const PowerShellScriptText = BuildPowerShellCompletionScriptText(
            RootCommandName,
            PowerShellCommandNames,
            ParsedCompletions
        );

        yield* Console.log(PowerShellScriptText);
    });

const GetRequestedCompletionShell = (
    Arguments: ReadonlyArray<string>
): PowerShellCompletionShell | undefined =>
{
    for (let Index = 0; Index < Arguments.length; Index++)
    {
        const Argument = Arguments[Index];

        if (Argument === "--completions")
        {
            const NextArgument = Arguments[Index + 1]?.toLowerCase();

            if (NextArgument === "powershell" || NextArgument === "pwsh")
            {
                return NextArgument;
            }
        }

        if (Argument !== undefined && Argument.startsWith("--completions="))
        {
            const CompletionShell = Argument
                .slice("--completions=".length)
                .toLowerCase();

            if (CompletionShell === "powershell" || CompletionShell === "pwsh")
            {
                return CompletionShell;
            }
        }
    }

    return undefined;
};

const GetRootCommandName = <
    Name extends string,
    Requirements,
    Error,
    Value
>(
    CommandValue: EffectCommand.Command<Name, Requirements, Error, Value>
): string =>
{
    for (const CommandName of EffectCommand.getNames(CommandValue))
    {
        return CommandName;
    }

    throw new Error("Unable to determine the root command name.");
};

const ParseBashCompletions = (
    CompletionLines: ReadonlyArray<string>
): ParsedBashCompletions =>
{
    const CompletionMap = new Map<string, ReadonlyArray<string>>();
    const OptionValueCompletionMap = new Map<
        string,
        Map<string, CompletionSpecification>
    >();

    let CurrentCommandKey: string | undefined = undefined;

    for (let Index = 0; Index < CompletionLines.length; Index++)
    {
        const CompletionLine = CompletionLines[Index] ?? "";
        const NextCompletionLine = CompletionLines[Index + 1] ?? "";

        const CommandCaseMatch = /^\s*([^\s)]+)\)\s*$/.exec(CompletionLine);
        const OptionListMatch = /^\s*opts="([^"]*)"\s*$/.exec(NextCompletionLine);

        if (
            CommandCaseMatch !== null &&
            OptionListMatch !== null &&
            CommandCaseMatch[1] !== undefined &&
            OptionListMatch[1] !== undefined
        )
        {
            CurrentCommandKey = CommandCaseMatch[1];

            CompletionMap.set(
                CurrentCommandKey,
                AddPowerShellCompletionWords(
                    SplitCompletionWords(OptionListMatch[1])
                )
            );

            AddOptionValueCompletion(
                OptionValueCompletionMap,
                CurrentCommandKey,
                "--completions",
                {
                    kind: "WordList",
                    values: [ "sh", "bash", "fish", "zsh", "powershell", "pwsh" ]
                }
            );

            continue;
        }

        if (CurrentCommandKey === undefined)
        {
            continue;
        }

        const OptionCaseMatch = /^\s*((?:-{1,2}[^)\s|]+)(?:\|-{1,2}[^)\s|]+)*)\)\s*$/
            .exec(CompletionLine);

        const CompletionSpecification = ParseCompletionSpecification(NextCompletionLine);

        if (OptionCaseMatch === null || CompletionSpecification === undefined)
        {
            continue;
        }

        if (OptionCaseMatch[1] !== undefined)
        {
            const OptionNames = SplitOptionCaseNames(OptionCaseMatch[1]);

            for (const OptionName of OptionNames)
            {
                AddOptionValueCompletion(
                    OptionValueCompletionMap,
                    CurrentCommandKey,
                    OptionName,
                    CompletionSpecification
                );
            }
        }
    }

    return {
        completionMap: CompletionMap,
        optionValueCompletionMap: OptionValueCompletionMap
    };
};

const ParseCompletionSpecification = (
    CompletionLine: string
): CompletionSpecification | undefined =>
{
    if (!CompletionLine.includes("COMPREPLY=("))
    {
        return undefined;
    }

    const WordListMatch = /compgen\s+-W\s+"([^"]*)"/.exec(CompletionLine);

    if (WordListMatch !== null && WordListMatch[1] !== undefined)
    {
        return {
            kind: "WordList",
            values: SplitChoiceWords(WordListMatch[1])
        };
    }

    if (/compgen\s+-d\b/.test(CompletionLine))
    {
        return {
            kind: "Directory",
            values: []
        };
    }

    if (/compgen\s+-f\b/.test(CompletionLine))
    {
        return {
            kind: "FileSystem",
            values: []
        };
    }

    return {
        kind: "None",
        values: []
    };
};

const AddOptionValueCompletion = (
    OptionValueCompletionMap: Map<string, Map<string, CompletionSpecification>>,
    CommandKey: string,
    OptionName: string,
    CompletionSpecification: CompletionSpecification
): void =>
{
    let CommandOptionValueCompletionMap = OptionValueCompletionMap.get(CommandKey);

    if (CommandOptionValueCompletionMap === undefined)
    {
        CommandOptionValueCompletionMap = new Map<string, CompletionSpecification>();
        OptionValueCompletionMap.set(CommandKey, CommandOptionValueCompletionMap);
    }

    CommandOptionValueCompletionMap.set(OptionName, CompletionSpecification);
};

const AddPowerShellCompletionWords = (
    CompletionWords: ReadonlyArray<string>
): ReadonlyArray<string> =>
{
    if (!CompletionWords.includes("--completions"))
    {
        return CompletionWords;
    }

    return CompletionWords;
};

const SplitCompletionWords = (
    Words: string
): ReadonlyArray<string> =>
{
    const TrimmedWords = Words.trim();

    if (TrimmedWords.length === 0)
    {
        return [];
    }

    return [ ...new Set(TrimmedWords.split(/\s+/)) ];
};

const SplitChoiceWords = (
    Words: string
): ReadonlyArray<string> =>
{
    const TrimmedWords = Words.trim();

    if (TrimmedWords.length === 0)
    {
        return [];
    }

    return [
        ...new Set(
            TrimmedWords
                .split(/[\s,]+/)
                .map((Word) => Word.trim())
                .filter((Word) => Word.length > 0)
        )
    ];
};

const SplitOptionCaseNames = (
    OptionCaseNames: string
): ReadonlyArray<string> =>
    OptionCaseNames
        .split("|")
        .map((OptionName) => OptionName.trim())
        .filter((OptionName) => OptionName.length > 0);

const BuildPowerShellCompletionScriptText = (
    RootCommandName: string,
    PowerShellCommandNames: ReadonlyArray<string>,
    ParsedCompletions: ParsedBashCompletions
): string =>
{
    const CompletionMapLines = BuildPowerShellStringArrayHashtableLines(
        ParsedCompletions.completionMap,
        8
    );

    const OptionValueCompletionMapLines = BuildNestedPowerShellCompletionHashtableLines(
        ParsedCompletions.optionValueCompletionMap,
        8
    );

    return [
        `Register-ArgumentCompleter -Native -CommandName ${FormatPowerShellArray(PowerShellCommandNames)} -ScriptBlock {`,
        "    param(",
        "        [string] $WordToComplete,",
        "        [System.Management.Automation.Language.CommandAst] $CommandAst,",
        "        [int] $CursorPosition",
        "    )",
        "",
        "    $CompletionMap = @{",
        ...CompletionMapLines,
        "    }",
        "",
        "    $OptionValueCompletionMap = @{",
        ...OptionValueCompletionMapLines,
        "    }",
        "",
        `    $RootCommandKey = ${FormatPowerShellString(RootCommandName)}`,
        "",
        "    function New-EffectCliCompletionResult",
        "    {",
        "        param(",
        "            [string] $Value,",
        "            [System.Management.Automation.CompletionResultType] $ResultType",
        "        )",
        "",
        "        [System.Management.Automation.CompletionResult]::new(",
        "            $Value,",
        "            $Value,",
        "            $ResultType,",
        "            $Value",
        "        )",
        "    }",
        "",
        "    function Get-EffectCliWordListCompletions",
        "    {",
        "        param(",
        "            [string[]] $Values,",
        "            [System.Management.Automation.CompletionResultType] $ResultType",
        "        )",
        "",
        "        $Values |",
        "            Where-Object { $_ -like \"$WordToComplete*\" } |",
        "            Sort-Object -Unique |",
        "            ForEach-Object {",
        "                New-EffectCliCompletionResult $_ $ResultType",
        "            }",
        "    }",
        "",
        "    function Get-EffectCliFileSystemCompletions",
        "    {",
        "        param(",
        "            [switch] $DirectoryOnly",
        "        )",
        "",
        "        $CompletionPath = if ([string]::IsNullOrWhiteSpace($WordToComplete))",
        "        {",
        "            \"*\"",
        "        }",
        "        else",
        "        {",
        "            \"$WordToComplete*\"",
        "        }",
        "",
        "        Get-ChildItem -Path $CompletionPath -ErrorAction SilentlyContinue |",
        "            Where-Object { -not $DirectoryOnly -or $_.PSIsContainer } |",
        "            Sort-Object -Property Name -Unique |",
        "            ForEach-Object {",
        "                $CompletionValue = if ($_.PSIsContainer)",
        "                {",
        "                    \"$($_.Name)/\"",
        "                }",
        "                else",
        "                {",
        "                    $_.Name",
        "                }",
        "",
        "                New-EffectCliCompletionResult $CompletionValue ([System.Management.Automation.CompletionResultType]::ProviderItem)",
        "            }",
        "    }",
        "",
        "    $CommandElements = @(",
        "        $CommandAst.CommandElements | ForEach-Object { $_.Extent.Text.Trim() }",
        "    )",
        "",
        "    $CommandKey = $RootCommandKey",
        "    $SubcommandElements = @()",
        "",
        "    for ($Index = 1; $Index -lt $CommandElements.Count; $Index++)",
        "    {",
        "        $CommandElement = $CommandElements[$Index]",
        "",
        "        if ([string]::IsNullOrWhiteSpace($CommandElement) -or $CommandElement.StartsWith(\"-\"))",
        "        {",
        "            continue",
        "        }",
        "",
        "        $PossibleCommandKey = ((@($RootCommandKey) + $SubcommandElements + @($CommandElement)) -join \"__\") -replace \"-\", \"__\"",
        "",
        "        if ($CompletionMap.ContainsKey($PossibleCommandKey))",
        "        {",
        "            $CommandKey = $PossibleCommandKey",
        "            $SubcommandElements += $CommandElement",
        "        }",
        "    }",
        "",
        "    $CommandText = $CommandAst.Extent.Text",
        "    $CompletingNewWord = $CommandText.EndsWith(\" \") -or $CommandText.EndsWith(\"`t\")",
        "",
        "    $PreviousWord = if ($CompletingNewWord)",
        "    {",
        "        if ($CommandElements.Count -ge 2)",
        "        {",
        "            $CommandElements[$CommandElements.Count - 1]",
        "        }",
        "        else",
        "        {",
        "            \"\"",
        "        }",
        "    }",
        "    else",
        "    {",
        "        if ($CommandElements.Count -ge 3)",
        "        {",
        "            $CommandElements[$CommandElements.Count - 2]",
        "        }",
        "        else",
        "        {",
        "            \"\"",
        "        }",
        "    }",
        "",
        "    if (",
        "        $OptionValueCompletionMap.ContainsKey($CommandKey) -and",
        "        $OptionValueCompletionMap[$CommandKey].ContainsKey($PreviousWord)",
        "    )",
        "    {",
        "        $CompletionSpecification = $OptionValueCompletionMap[$CommandKey][$PreviousWord]",
        "",
        "        switch ($CompletionSpecification[\"Kind\"])",
        "        {",
        "            \"WordList\"",
        "            {",
        "                Get-EffectCliWordListCompletions -Values $CompletionSpecification[\"Values\"] -ResultType ([System.Management.Automation.CompletionResultType]::ParameterValue)",
        "                return",
        "            }",
        "            \"FileSystem\"",
        "            {",
        "                Get-EffectCliFileSystemCompletions",
        "                return",
        "            }",
        "            \"Directory\"",
        "            {",
        "                Get-EffectCliFileSystemCompletions -DirectoryOnly",
        "                return",
        "            }",
        "        }",
        "    }",
        "",
        "    if (-not $CompletionMap.ContainsKey($CommandKey))",
        "    {",
        "        return",
        "    }",
        "",
        "    $CompletionMap[$CommandKey] |",
        "        Where-Object { $_ -like \"$WordToComplete*\" } |",
        "        Sort-Object -Unique |",
        "        ForEach-Object {",
        "            $CompletionResultType = if ($_.StartsWith(\"-\"))",
        "            {",
        "                [System.Management.Automation.CompletionResultType]::ParameterName",
        "            }",
        "            else",
        "            {",
        "                [System.Management.Automation.CompletionResultType]::ParameterValue",
        "            }",
        "",
        "            New-EffectCliCompletionResult $_ $CompletionResultType",
        "        }",
        "}",
        ""
    ].join("\n");
};

const BuildPowerShellStringArrayHashtableLines = (
    CompletionMap: ReadonlyMap<string, ReadonlyArray<string>>,
    Indentation: number
): ReadonlyArray<string> =>
{
    const Prefix = " ".repeat(Indentation);

    return [ ...CompletionMap.entries() ]
        .sort(([ LeftKey ], [ RightKey ]) => LeftKey.localeCompare(RightKey))
        .map(([ Key, Values ]) =>
            `${Prefix}${FormatPowerShellString(Key)} = ${FormatPowerShellArray(Values)}`
        );
};

const BuildNestedPowerShellCompletionHashtableLines = (
    CompletionMap: ReadonlyMap<string, ReadonlyMap<string, CompletionSpecification>>,
    Indentation: number
): ReadonlyArray<string> =>
{
    const Prefix = " ".repeat(Indentation);
    const NestedPrefix = " ".repeat(Indentation + 4);
    const Lines: Array<string> = [];

    for (const [ CommandKey, OptionMap ] of [ ...CompletionMap.entries() ]
        .sort(([ LeftKey ], [ RightKey ]) => LeftKey.localeCompare(RightKey)))
    {
        Lines.push(`${Prefix}${FormatPowerShellString(CommandKey)} = @{`);

        for (const [ OptionName, CompletionSpecification ] of [ ...OptionMap.entries() ]
            .sort(([ LeftKey ], [ RightKey ]) => LeftKey.localeCompare(RightKey)))
        {
            Lines.push(
                `${NestedPrefix}${FormatPowerShellString(OptionName)} = @{ Kind = ${FormatPowerShellString(CompletionSpecification.kind)}; Values = ${FormatPowerShellArray(CompletionSpecification.values)} }`
            );
        }

        Lines.push(`${Prefix}}`);
    }

    return Lines;
};

const FormatPowerShellArray = (
    Values: ReadonlyArray<string>
): string =>
{
    if (Values.length === 0)
    {
        return "@()";
    }

    return `@(${Values.map(FormatPowerShellString).join(", ")})`;
};

const FormatPowerShellString = (
    Value: string
): string =>
    `'${Value.replaceAll("'", "''")}'`;
