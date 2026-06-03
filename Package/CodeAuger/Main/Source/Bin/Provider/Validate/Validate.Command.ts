/**
 * @file      Validate.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Args, Command, Options } from "@effect/cli";
import { Data, Effect, pipe } from "effect";
import { Path as EffectPath, FileSystem } from "@effect/platform";
import { Cli } from "@sorrell/cli-utilities";
import { Code } from "@sorrell/cli-utilities/format";
import type { Handler } from "@sorrell/cli-utilities/cli";
import type { Internal } from "./Internal/index.js";
import { MakeConfig } from "../../Shared/SubCommand.js";
import { MakeGetErrorDescription } from "./Internal/Validate.Command.Internal.js";
import type { PlatformError } from "@effect/platform/Error";
import type { ReadonlyRecord } from "effect/Record";
import type { Subcommand } from "../../Shared/SubCommand.Types.js";
import type { TFunction } from "@sorrell/utilities/functional";
import type { Validator } from "./Validate.Command.Types.js";

/* eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/typedef */
export const Validators =
    [
        "config-loads",
        "exports",
        "has-config",
        "has-peer-dependency"
    ] as const;

const ValidatorDescriptions: Cli.Choice.DescriptionRecord<Validator.Choice> =
    {
        "config-loads":
            "Determines whether the config exported by your config file can be loaded and " +
            "has the correct shape.",
        exports:
            "Determines whether the types described in your config can be imported by " +
            "other packages.",
        "has-config": "Determines whether a provider config file exists in your package.",
        "has-peer-dependency":
            `Determines whether ${ Code("code-auger") } is listed in your ` +
            `${ Code("package.json") } as a ${ Code("peerDependency") }.`
    } as const;

/* eslint-disable-next-line @typescript-eslint/typedef, jsdoc/require-jsdoc */
export const ValidateConfig = MakeConfig({
    Fix: pipe(
        Options.boolean("fix"),
        Options.withDefault(false),
        Options.withDescription(
            `Whether to fix any errors found by the ${ Code("validate") } command.`
        )
    ),
    Validators: pipe(
        Cli.Args.Choice.Choice(
            Validators,
            {
                Description:
                {
                    Base:
                        "",
                        // "The validators to run under this command.  If none are specified, then " +
                        // `${ Chalk.italic("all") } validators will run.`,
                    Choices: ValidatorDescriptions
                },
                name: "validators"
            }
        ),
        Args.repeated
    )
});

export class ValidateError extends Data.TaggedError("ValidateError")<{
    readonly Kind: Validator.ErrorKind;
}> { }

function HasConfig(
    Options: Omit<Handler.Argument<typeof ValidateConfig>, "Validators">
): Validator.Effect
{
    return Effect.gen(function* ()
    {
        const { Cwd } = Options;
        const Path: EffectPath.Path = yield* EffectPath.Path;
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;

        const ConfigPath: string = Path.join(Cwd, "code-auger.provider.ts");

        const CheckExistence: Effect.Effect<void, ValidateError | PlatformError> =
            Effect.gen(function* () { }) as Effect.Effect<void, ValidateError | PlatformError>;
        // const CheckExistence: Effect.Effect<void, ValidateError | PlatformError> = Effect.gen(function* ()
        // {
        //     if (!(yield* Fs.exists(ConfigPath)))
        //     {
        //         return yield* Effect.fail(new ValidateError({ Kind: "ConfigFileNotFound" }));
        //     }

        //     return;
        // });

        yield* pipe(
            CheckExistence,
            Effect.catchAll((_Error: unknown) => new ValidateError({ Kind: "ConfigFileNotFound" }))
        );

        yield* pipe(
            Fs.readFileString(ConfigPath),
            Effect.catchAll((_Error: PlatformError) => new ValidateError({ Kind: "FailedToReadConfigFile" }))
        );
    });
}

function ConfigLoads(
    Options: Omit<Handler.Argument<typeof ValidateConfig>, "Validators">
): Validator.Effect
{
    return Effect.gen(function* ()
    {

    });
}

function Exports(
    Options: Omit<Handler.Argument<typeof ValidateConfig>, "Validators">
): Validator.Effect
{
    return Effect.gen(function* ()
    {

    });
}
function HasPeerDependency(
    Options: Omit<Handler.Argument<typeof ValidateConfig>, "Validators">
): Validator.Effect
{
    return Effect.gen(function* ()
    {

    });
}

const ValidatorHandlers: ReadonlyRecord<Validator.Choice, typeof HasConfig> =
    {
        "config-loads": ConfigLoads,
        exports: Exports,
        "has-config": HasConfig,
        "has-peer-dependency": HasPeerDependency
    } as const;

function RunValidators(
    Options: Handler.Argument<typeof ValidateConfig>
): Validator.Effect
{
    const SelectedValidators: ReadonlyArray<Validator.Choice> = Options.Validators.length > 0
        ? Options.Validators
        : Validators;

    function ResolveValidator(Choice: Validator.Choice): Validator.Effect
    {
        return ValidatorHandlers[Choice](Options);
    }

    return Effect.forEach(SelectedValidators, ResolveValidator);
}

const ValidateErrorDescriptions: Internal.ErrorDescriptions =
    {
        ConfigFileNotFound:
            "",
            // `A provider config file ${ Code("\"code-auger.provider.ts\"") } could ` +
            // `${ Chalk.italic("not") } be found in your root directory.`,
        FailedToReadConfigFile: ""
    } as const;

function CatchValidatorError(Options: Validator.Argument): Effect.Effect<void>
{
    return Effect.gen(function * () { }) as Effect.Effect<void>;
    // const GetErrorDescription: TFunction.Safe<[ Validator.ErrorKind ], string> =
    //     MakeGetErrorDescription(ValidateErrorDescriptions, Options);

    // const DieWithDescription = (Error: ValidateError): Effect.Effect<never> =>
    // {
    //     return Effect.dieMessage(GetErrorDescription(Error.Kind));
    // };

    // Effect.catchTag(
    //     "ValidateError",
    //     DieWithDescription
    // );
}

function HandleValidate(
    Options: Handler.Argument<typeof ValidateConfig>
): Effect.Effect<void>
{
    return Effect.succeed(undefined);
    // return pipe(
    //     RunValidators(Options),
    //     CatchValidatorError
    // );
}

/* eslint-enable @typescript-eslint/no-empty-object-type */

export const ValidateCommand: Subcommand<"validate", typeof ValidateConfig> =
    Command.make("validate", ValidateConfig, HandleValidate);
