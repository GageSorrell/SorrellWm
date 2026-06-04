/**
 * @file      Choice.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { Args, Options } from "@sorrell/effect/unstable/cli";
import type { ReadonlyRecord } from "effect/Record";

/**
 * For a given {@link ChoiceType} corresponding to the supported values of an argument
 * defined via {@link Args.choice} or {@link Options.choice}, define a description for
 * some (or all) of the choices.
 *
 * @template ChoiceType - The possible values of some choice argument.
 */
export type DescriptionRecord<ChoiceType extends string> =
    ReadonlyRecord<ChoiceType, string>;

export type Description<ChoiceType extends string> =
    Readonly<{
        Base: string;
        Choices: DescriptionRecord<ChoiceType>;
    }>;

