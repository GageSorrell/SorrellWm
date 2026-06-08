/**
 * @file      Choice.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Array, Record, pipe } from "@sorrell/effect";
import { Argument } from "@sorrell/effect/unstable/cli";

/* eslint-disable jsdoc/require-example */

/**
 * Equip a {@link Base | base description} (of some choice argument) with a
 * styled list that describes each possible choice.
 *
 * @template A - The union of choice types.
 *
 * @param Base - The description of the argument.
 * @param Choices - The {@link Record.ReadonlyRecord} that maps each choice to
 * a description of that choice.
 * @returns {string} The styled concatenation of the {@link Base | base description} with
 * the {@link Choices | choice descriptions}.
 */
function AssembleDescription<A extends string>(
    Base: string,
    Choices: Record.ReadonlyRecord<A, string>
): string
{
    const ParagraphSep: "\n\n" = "\n\n" as const;

    /* eslint-disable-next-line jsdoc/require-jsdoc */
    function MakeChoiceDescription(
        [ Key, Value ]: [ A, string ],
        _Index: number
    ): string
    {
        return `${ Key }: ${ Value }`;
    }

    const ValuesSubHeader: "VALUES" = "VALUES" as const;

    const ChoiceDescriptions: string = pipe(
        Choices,
        Record.toEntries,
        Array.map(MakeChoiceDescription),
        Array.join(ParagraphSep)
    );

    return [ Base, ValuesSubHeader, ChoiceDescriptions ].join(ParagraphSep);
}

export function withDescription<A>(description: string): (self: Argument.Argument<A>) => Argument.Argument<A>;
export function withDescription<A>(self: Argument.Argument<A>, description: string): Argument.Argument<A>;

/**
 * Equip a choice argument with a {@link baseDescription} as well as a styled list
 * that describes {@link choiceDescriptions | each possible choice} for that argument.
 *
 * @template A - The `string` union of possible choices.
 *
 * @param baseDescription - The description of the argument.
 * @param choiceDescriptions - The {@link Record.ReadonlyRecord} that maps each choice to
 * a description of that choice.
 *
 * @returns {(self: Argument.Argument<A>) => Argument.Argument<A>} A function that equips a
 * choice argument with the resulting description.
 */
export function withDescription<A extends string>(
    baseDescription: string,
    choiceDescriptions: Record.ReadonlyRecord<A, string>
): (self: Argument.Argument<A>) => Argument.Argument<A>;

/**
 * Equip a choice argument with a {@link baseDescription} as well as a styled list
 * that describes {@link choiceDescriptions | each possible choice} for that argument.
 *
 * @template A - The `string` union of possible choices.
 *
 * @param self - The choice argument with which the resulting description will be equipped.
 * @param baseDescription - The description of the argument.
 * @param choiceDescriptions - The {@link Record.ReadonlyRecord} that maps each choice to
 * a description of that choice.
 *
 * @returns {Argument.Argument<A>} The {@link self | given choice argument}, equipped with
 * the resulting description.
 */
export function withDescription<A extends string>(
    self: Argument.Argument<A>,
    baseDescription: string,
    choiceDescriptions: Record.ReadonlyRecord<A, string>
): Argument.Argument<A>;

export function withDescription<A>(
    One:
        | Argument.Argument<A>
        | string,
    Two?:
        | Record.ReadonlyRecord<A extends string ? A : never, string>
        | string,
    Three?: Record.ReadonlyRecord<A extends string ? A : never, string>
): (
    | Argument.Argument<A>
    | ((self: Argument.Argument<A>) => Argument.Argument<A>)
)
{
    switch (arguments.length)
    {
        case 1:
            return Argument.withDescription(One as string);
        case 2:
            if (typeof One !== "string" && typeof Two === "string")
            {
                return Argument.withDescription(One, Two);
            }
            else
            {
                return Argument.withDescription(AssembleDescription(
                    One as string,
                    Two as unknown as Record.ReadonlyRecord<string, string>)
                );
            }
        case 3:
            return Argument.withDescription(
                One as Argument.Argument<A>,
                AssembleDescription(
                    Two as string,
                    Three as unknown as Record.ReadonlyRecord<string, string>
                )
            );
        default:
            throw new Error(
                "Argument.Choice.withDescription could not match the given arguments " +
                "to the correct underlying \"withDescription\" call."
            );
    }
}
