/**
 * @file      Validate.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Validate from "./Validate.Command.Internal.js";
import { Args, Command, Options } from "@sorrell/effect/unstable/cli";
import { Effect, pipe } from "effect";
import type { ValidateCommandEffect, ValidateCommandType } from "./Validate.Command.Types.js";
import { Cli } from "@sorrell/cli-utilities";
import type { Handler } from "@sorrell/cli-utilities/cli";
import type { Internal } from "./Validate.Command.Internal.Types.js";
import { MakeConfig } from "../../Shared/SubCommand.js";

const ValidatorDescriptions: Cli.Choice.DescriptionRecord<Internal.Validator.Choice> =
    {
        "config-not-missing-providers":
            "Determine whether the consumer's config has an entry for every installed provider.",
        "has-config": "Validate the consumer's config file.",
        "has-providers": "Determine whether the consumer has any providers currently installed.",
        "no-collisions":
            "Determine whether any augmented interface would have more than one " +
            "property of the same key, if the `generate` command were run.",
        "no-ignored-providers":
            "Determine whether there is an installed provider that is not currently used " +
            "in the consumer's codebase--that is, for any installed provider, whether " +
            "there are any types exported in the consumer's codebase that are defined " +
            "with that provider's generic type, with which the generated module augments " +
            "that provider's interface."
    } as const;

/* eslint-disable-next-line @typescript-eslint/typedef, jsdoc/require-jsdoc */
export const FixCategories =
    [
        "all",
        "error",
        "recommended",
        ...Validate.Choices
    ] as const;

/* eslint-disable-next-line @typescript-eslint/typedef, jsdoc/require-jsdoc */
export const ValidateConfig = MakeConfig({
    Fix: pipe(
        Cli.Options.Choice.Choice(
            "fix",
            FixCategories,
            {
                Base: "@TODO",
                Choices:
                {
                    all: "@TODO",
                    error: "@TODO",
                    recommended: "@TODO",
                    ...ValidatorDescriptions
                }
            }
        ),
        Options.withDefault([ "all" ]),
        Options.optional
    ),
    Validators: pipe(
        Cli.Args.Choice.Choice(
            Validate.Choices,
            {
                Description:
                {
                    Base:
                        "The validators to run when calling this command.  " +
                        "Specifying none will cause all validators to run.  \n" +
                        "Please note that some validators check for recommended " +
                        "usage of code-auger, and these recommendations are not required.",
                    Choices: ValidatorDescriptions
                },
                name: "validators"
            }
        ),
        Args.repeated
    )
});

/* eslint-disable-next-line jsdoc/require-jsdoc */
function HandleValidate(
    Options: Handler.Argument<typeof ValidateConfig>
): ValidateCommandEffect
{
    return Effect.gen(function* ()
    {
        yield* Validate.RunValidators(Options);
    });
}

export/** The `validate` command, which validates the consumer's project setup *wrt* `code-auger`. */
const ValidateCommand: ValidateCommandType = Command.make("validate", ValidateConfig, HandleValidate);
