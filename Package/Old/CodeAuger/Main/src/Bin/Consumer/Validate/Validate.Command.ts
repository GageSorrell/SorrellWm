/**
 * @file      Validate.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Argument, Command, Flag } from "@sorrell/effect/unstable/cli";
import { Effect, Record, pipe } from "effect";
import type { ValidateCommandEffect, ValidateCommandType } from "./Validate.Command.Types.js";
import type { Handler } from "@sorrell/cli-utilities/cli";

/* eslint-disable @typescript-eslint/typedef */

export/** The validators to run as part of the `validate` command. */
const Choices =
    [
        "config-not-missing-providers",
        "has-config",
        "has-providers",
        "no-collisions",
        "no-ignored-providers"
    ] as const;

/* eslint-enable @typescript-eslint/typedef */

/** The type of a validator {@link Effect.Effect | effect}. */
type ValidatorEffect =
    Effect.Effect<
        void,
        string,
        never
    >;

/** The possible choices for the `"validator"` argument. */
type Choice = (typeof Choices)[number];

/** Validate the consumer's config file. */
const HasConfig: ValidatorEffect = Effect.gen(function* ()
{
    return true;
});

/** Determine whether the consumer has any providers currently installed. */
const HasProviders: ValidatorEffect = Effect.gen(function* ()
{
    return true;
});

/** Determine whether the consumer's config has an entry for every installed provider. */
const ConfigNotMissingProviders: ValidatorEffect = Effect.gen(function* ()
{
    return true;
});

const AllValidators: ValidatorEffect = Effect.gen(function* ()
{
    return Effect.all(Record.values(ValidatorRecord));
});

/**
 * Determine whether any augmented interface would have more than one
 * property of the same key, if the `generate` command were run.
 */
const NoCollisions: ValidatorEffect = Effect.gen(function* ()
{
    return true;
});

/**
 * Determine whether there is an installed provider that is not currently used
 * in the consumer's codebase--that is, for any installed provider, whether
 * there are any types exported in the consumer's codebase that are defined
 * with that provider's generic type, with which the generated module augments
 * that provider's interface.
 */
const NoIgnoredProviders: ValidatorEffect = Effect.gen(function* ()
{
    return true;
});

/** The validators that the `validate` command can run. */
const ValidatorRecord: Record.ReadonlyRecord<"all" | Choice, ValidatorEffect> =
    {
        all: AllValidators,
        "config-not-missing-providers": ConfigNotMissingProviders,
        "has-config": HasConfig,
        "has-providers": HasProviders,
        "no-collisions": NoCollisions,
        "no-ignored-providers": NoIgnoredProviders
        // @TODO For the provider form of this command, the validators will be,
        // "config-loads",
        // "exports",
        // "has-config",
        // "has-peer-dependency"
    } as const;

// const ValidatorDescriptions: Cli.Choice.DescriptionRecord<Choice> =
//     {
//         "config-not-missing-providers":
//             "Determine whether the consumer's config has an entry for every installed provider.",
//         "has-config": "Validate the consumer's config file.",
//         "has-providers": "Determine whether the consumer has any providers currently installed.",
//         "no-collisions":
//             "Determine whether any augmented interface would have more than one " +
//             "property of the same key, if the `generate` command were run.",
//         "no-ignored-providers":
//             "Determine whether there is an installed provider that is not currently used " +
//             "in the consumer's codebase--that is, for any installed provider, whether " +
//             "there are any types exported in the consumer's codebase that are defined " +
//             "with that provider's generic type, with which the generated module augments " +
//             "that provider's interface."
//     } as const;

/* eslint-disable-next-line @typescript-eslint/typedef, jsdoc/require-jsdoc */

type ValidatorConfig =
    {
        Fix: Flag.Flag<ReadonlyArray<"all" | typeof Choices[number]>>;
        Validators: Argument.Argument<ReadonlyArray<ValidatorEffect>>;
    };

/* eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/typedef */
export const ValidateConfig: ValidatorConfig =
    {
        Fix: pipe(
            Flag.choice(
                "fix",
                [ "all", ...Choices ] as const
            ),
            Flag.atLeast(0),
            Flag.withDescription("@TODO Write description, with a description for each choice.")
        ),
        Validators: pipe(
            Argument.choiceWithValue(
                "validators",
                Record.toEntries(ValidatorRecord)
            ),
            Argument.withDescription(
                "The validators to run when calling this command.  " +
                "Specifying none will cause all validators to run.  \n" +
                "Please note that some validators check for recommended " +
                "usage of code-auger, and these recommendations are not required." +
                "\n\n@TODO Add descriptions of each choice."
            ),
            Argument.variadic()
        )
    } satisfies Command.Command.Config;

/* eslint-disable-next-line jsdoc/require-jsdoc */
function HandleValidate(
    Options: Handler.Argument<typeof ValidateConfig>
): ValidateCommandEffect
{
    return Effect.all(Options.Validators);
}

export/** The `validate` command, which validates the consumer's project setup *wrt* `code-auger`. */
const ValidateCommand: ValidateCommandType = Command.make("validate", ValidateConfig, HandleValidate);
