/**
 * @file      Validate.Command.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-namespace */

import { Effect, Record } from "effect";
import type { Handler } from "@sorrell/cli-utilities/cli";
import type { Internal } from "./Validate.Command.Internal.Types.js";
import type { ValidateConfig } from "./Validate.Command.js";

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

namespace Validator
{
    export/** Validate the consumer's config file. */
    const HasConfig: Effect.Effect<boolean> = Effect.gen(function* ()
    {
        return true;
    });

    export/** Determine whether the consumer has any providers currently installed. */
    const HasProviders: Internal.Validator.Effect = Effect.gen(function* ()
    {
        return true;
    });

    export /** Determine whether the consumer's config has an entry for every installed provider. */
    const ConfigNotMissingProviders: Internal.Validator.Effect = Effect.gen(function* ()
    {
        return true;
    });

    export /**
            * Determine whether any augmented interface would have more than one
            * property of the same key, if the `generate` command were run.
            */
    const NoCollisions: Internal.Validator.Effect = Effect.gen(function* ()
    {
        return true;
    });

    export /**
            * Determine whether there is an installed provider that is not currently used
            * in the consumer's codebase--that is, for any installed provider, whether
            * there are any types exported in the consumer's codebase that are defined
            * with that provider's generic type, with which the generated module augments
            * that provider's interface.
            */
    const NoIgnoredProviders: Internal.Validator.Effect = Effect.gen(function* ()
    {
        return true;
    });

    export/** The validators that the `validate` command can run. */
    const Record: Record.ReadonlyRecord<Internal.Validator.Choice, Internal.Validator.Effect> =
        {
            "config-not-missing-providers": ConfigNotMissingProviders,
            "has-config": HasConfig,
            "has-providers": HasProviders,
            "no-collisions": NoCollisions,
            "no-ignored-providers": NoIgnoredProviders
        } as const;
}

/**
 * Run the validators specified in the given {@link Options}, or all validators if
 * {@link Options!Validators} is empty.
 *
 * @param Options - The options for the `validate` command.
 *
 * @returns {Effect.Effect<void>} The {@link Effect.Effect | effect} that runs the validators
 * given in the {@link Options}.
 */
export function RunValidators(
    Options: Handler.Argument<typeof ValidateConfig>
): Effect.Effect<void>
{
    return Effect.gen(function* ()
    {
        const IsInOptions = (_Value: unknown, Key: Internal.Validator.Choice): boolean =>
        {
            return Options.Validators.includes(Key);
        };

        yield* Effect.all(Record.filter(Validator.Record, IsInOptions));
    });
}
