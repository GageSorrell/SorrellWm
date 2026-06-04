/**
 * @file      Validate.Command.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
/* eslint-disable @typescript-eslint/no-namespace */
import { Effect, Record } from "effect";
/* eslint-disable @typescript-eslint/typedef */
export /** The validators to run as part of the `validate` command. */ const Choices = [
    "config-not-missing-providers",
    "has-config",
    "has-providers",
    "no-collisions",
    "no-ignored-providers"
];
/* eslint-enable @typescript-eslint/typedef */
var Validator;
(function (Validator) {
    Validator.HasConfig = Effect.gen(function* () {
        return true;
    });
    Validator.HasProviders = Effect.gen(function* () {
        return true;
    });
    Validator.ConfigNotMissingProviders = Effect.gen(function* () {
        return true;
    });
    Validator.NoCollisions = Effect.gen(function* () {
        return true;
    });
    Validator.NoIgnoredProviders = Effect.gen(function* () {
        return true;
    });
    Validator.Record = {
        "config-not-missing-providers": Validator.ConfigNotMissingProviders,
        "has-config": Validator.HasConfig,
        "has-providers": Validator.HasProviders,
        "no-collisions": Validator.NoCollisions,
        "no-ignored-providers": Validator.NoIgnoredProviders
    };
})(Validator || (Validator = {}));
/**
 * Run the validators specified in the given {@link Options}, or all validators if
 * {@link Options!Validators} is empty.
 *
 * @param Options - The options for the `validate` command.
 *
 * @returns {Effect.Effect<void>} The {@link Effect.Effect | effect} that runs the validators
 * given in the {@link Options}.
 */
export function RunValidators(Options) {
    return Effect.gen(function* () {
        const IsInOptions = (_Value, Key) => {
            return Options.Validators.includes(Key);
        };
        yield* Effect.all(Record.filter(Validator.Record, IsInOptions));
    });
}
//# sourceMappingURL=Validate.Command.Internal.js.map