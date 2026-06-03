/**
 * This extends {@link https://effect-ts.github.io/effect/docs/cli | \@effect/cli} by
 * extending some modules, including the {@link \@sorrell/effect-cli/BuiltInOptions} and
 * {@link \@sorrell/effect-cli/Prompt} modules.  Modules which are extended have summaries
 * of their modifications at the top of their respective module files.
 *
 * @module @sorrell/effect-cli
 */

/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export * as Args from "./Args.js";
export * as AutoCorrect from "./AutoCorrect.js";
export * as BuiltInOptions from "./BuiltInOptions.js";
export * as CliApp from "./CliApp.js";
export * as CliConfig from "./CliConfig.js";
export * as Command from "./Command.js";
export * as CommandDescriptor from "./CommandDescriptor.js";
export * as CommandDirective from "./CommandDirective.js";
export * as ConfigFile from "./ConfigFile.js";
export * as HelpDoc from "./HelpDoc.js";
export * as Options from "./Options.js";
export * as Primitive from "./Primitive.js";
export * as Prompt from "./Prompt.js";
export * as Span from "./Span.js";
export * as Usage from "./Usage.js";
export * as ValidationError from "./ValidationError.js";
