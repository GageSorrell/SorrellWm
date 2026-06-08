/**
 * @file      Validate.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Argument, Command, Flag } from "@sorrell/effect/unstable/cli";
import { Effect, Record, pipe } from "effect";
/* eslint-disable @typescript-eslint/typedef */
export /** The validators to run as part of the `validate` command. */ const Choices = [
    "config-not-missing-providers",
    "has-config",
    "has-providers",
    "no-collisions",
    "no-ignored-providers"
];
/** Validate the consumer's config file. */
const HasConfig = Effect.gen(function* () {
    return true;
});
/** Determine whether the consumer has any providers currently installed. */
const HasProviders = Effect.gen(function* () {
    return true;
});
/** Determine whether the consumer's config has an entry for every installed provider. */
const ConfigNotMissingProviders = Effect.gen(function* () {
    return true;
});
const AllValidators = Effect.gen(function* () {
    return Effect.all(Record.values(ValidatorRecord));
});
/**
 * Determine whether any augmented interface would have more than one
 * property of the same key, if the `generate` command were run.
 */
const NoCollisions = Effect.gen(function* () {
    return true;
});
/**
 * Determine whether there is an installed provider that is not currently used
 * in the consumer's codebase--that is, for any installed provider, whether
 * there are any types exported in the consumer's codebase that are defined
 * with that provider's generic type, with which the generated module augments
 * that provider's interface.
 */
const NoIgnoredProviders = Effect.gen(function* () {
    return true;
});
/** The validators that the `validate` command can run. */
const ValidatorRecord = {
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
};
/* eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/typedef */
export const ValidateConfig = {
    Fix: pipe(Flag.choice("fix", ["all", ...Choices]), Flag.atLeast(0), Flag.withDescription("@TODO Write description, with a description for each choice.")),
    Validators: pipe(Argument.choiceWithValue("validators", Record.toEntries(ValidatorRecord)), Argument.withDescription("The validators to run when calling this command.  " +
        "Specifying none will cause all validators to run.  \n" +
        "Please note that some validators check for recommended " +
        "usage of code-auger, and these recommendations are not required." +
        "\n\n@TODO Add descriptions of each choice."), Argument.variadic())
};
/* eslint-disable-next-line jsdoc/require-jsdoc */
function HandleValidate(Options) {
    return Effect.all(Options.Validators);
}
export /** The `validate` command, which validates the consumer's project setup *wrt* `code-auger`. */ const ValidateCommand = Command.make("validate", ValidateConfig, HandleValidate);
//# sourceMappingURL=Validate.Command.js.map