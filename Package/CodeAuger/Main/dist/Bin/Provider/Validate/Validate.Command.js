/**
 * @file      Validate.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Args, Command, Options } from "@sorrell/effect/unstable/cli";
import { Data, Effect, pipe } from "effect";
import { Path as EffectPath, FileSystem } from "@effect/platform";
import { Cli } from "@sorrell/cli-utilities";
import { Code } from "@sorrell/cli-utilities/format";
import { MakeConfig } from "../../Shared/SubCommand.js";
import { MakeGetErrorDescription } from "./Internal/Validate.Command.Internal.js";
/* eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/typedef */
export const Validators = [
    "config-loads",
    "exports",
    "has-config",
    "has-peer-dependency"
];
const ValidatorDescriptions = {
    "config-loads": "Determines whether the config exported by your config file can be loaded and " +
        "has the correct shape.",
    exports: "Determines whether the types described in your config can be imported by " +
        "other packages.",
    "has-config": "Determines whether a provider config file exists in your package.",
    "has-peer-dependency": `Determines whether ${Code("code-auger")} is listed in your ` +
        `${Code("package.json")} as a ${Code("peerDependency")}.`
};
/* eslint-disable-next-line @typescript-eslint/typedef, jsdoc/require-jsdoc */
export const ValidateConfig = MakeConfig({
    Fix: pipe(Options.boolean("fix"), Options.withDefault(false), Options.withDescription(`Whether to fix any errors found by the ${Code("validate")} command.`)),
    Validators: pipe(Cli.Args.Choice.Choice(Validators, {
        Description: {
            Base: "",
            // "The validators to run under this command.  If none are specified, then " +
            // `${ Chalk.italic("all") } validators will run.`,
            Choices: ValidatorDescriptions
        },
        name: "validators"
    }), Args.repeated)
});
export class ValidateError extends Data.TaggedError("ValidateError") {
}
function HasConfig(Options) {
    return Effect.gen(function* () {
        const { Cwd } = Options;
        const Path = yield* EffectPath.Path;
        const Fs = yield* FileSystem.FileSystem;
        const ConfigPath = Path.join(Cwd, "code-auger.provider.ts");
        const CheckExistence = Effect.gen(function* () { });
        // const CheckExistence: Effect.Effect<void, ValidateError | PlatformError> = Effect.gen(function* ()
        // {
        //     if (!(yield* Fs.exists(ConfigPath)))
        //     {
        //         return yield* Effect.fail(new ValidateError({ Kind: "ConfigFileNotFound" }));
        //     }
        //     return;
        // });
        yield* pipe(CheckExistence, Effect.catchAll((_Error) => new ValidateError({ Kind: "ConfigFileNotFound" })));
        yield* pipe(Fs.readFileString(ConfigPath), Effect.catchAll((_Error) => new ValidateError({ Kind: "FailedToReadConfigFile" })));
    });
}
function ConfigLoads(Options) {
    return Effect.gen(function* () {
    });
}
function Exports(Options) {
    return Effect.gen(function* () {
    });
}
function HasPeerDependency(Options) {
    return Effect.gen(function* () {
    });
}
const ValidatorHandlers = {
    "config-loads": ConfigLoads,
    exports: Exports,
    "has-config": HasConfig,
    "has-peer-dependency": HasPeerDependency
};
function RunValidators(Options) {
    const SelectedValidators = Options.Validators.length > 0
        ? Options.Validators
        : Validators;
    function ResolveValidator(Choice) {
        return ValidatorHandlers[Choice](Options);
    }
    return Effect.forEach(SelectedValidators, ResolveValidator);
}
const ValidateErrorDescriptions = {
    ConfigFileNotFound: "",
    // `A provider config file ${ Code("\"code-auger.provider.ts\"") } could ` +
    // `${ Chalk.italic("not") } be found in your root directory.`,
    FailedToReadConfigFile: ""
};
function CatchValidatorError(Options) {
    return Effect.gen(function* () { });
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
function HandleValidate(Options) {
    return Effect.succeed(undefined);
    // return pipe(
    //     RunValidators(Options),
    //     CatchValidatorError
    // );
}
/* eslint-enable @typescript-eslint/no-empty-object-type */
export const ValidateCommand = Command.make("validate", ValidateConfig, HandleValidate);
//# sourceMappingURL=Validate.Command.js.map