/**
 * Decorative components that annotate prompts *wrt* their state and place in a composite prompt.
 *
 * @see {@link https://www.npmjs.com/package/@clack/prompts | \@clack/prompts} These components
 * are inspired by `@clack/prompts`.
 *
 * @module @sorrell/effect-ink/Component/Clack
 *
 * @file      Clack.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Arr from "effect/Array";
import type * as Color from "../Color.ts";
import * as React from "react";
import { Hash } from "effect";
import { Text } from "./Primitive/Text.tsx";

/* eslint-disable @typescript-eslint/typedef */

export const Shape =
    {
        Diamond:
        {
            Medium:
            {
                Black: "⬥",
                White: "⬦"
            }
        },
        Triangle:
        {
            Medium:
            {
                Black: "⯅"
            }
        }
    } as const;

export const Symbol =
    {
        CheckMark:
        {
            BallotBox: "☑",
            BallotBoxBold: "🗹",
            Bold: "✔",
            CheckMark: "✓",
            Light: "🗸",
            WhiteHeavyEmoji: "✅"
        },
        Cross:
        {
            Ballot: "✗",
            BallotBold: "✘",
            Bold: "🗙",
            Cross: "×",
            Emoji: "❌"

        },
        Warning: "⚠"
    } as const;

/* eslint-enable @typescript-eslint/typedef */

export type RowKind =
    | "Top"
    | "Middle"
    | "Bottom";

export interface ClackArmProps
{
    readonly GetCharacter: (RowKind: RowKind) => React.ReactNode;
    readonly GetColor: (RowKind: RowKind) => Color.Color;
    readonly GetDimColor: (RowKind: RowKind) => boolean;
    readonly Height: number;
}

interface ClackRowProps extends ClackArmProps
{
    readonly Index: number;
}

const ClackRow = ({ GetCharacter, GetColor, GetDimColor, Height, Index }: ClackRowProps): React.ReactNode =>
{
    const RowKind: RowKind = Index === 0
        ? "Top"
        : Index === Height - 1
            ? "Bottom"
            : "Middle";

    const Character: React.ReactNode = GetCharacter(RowKind);
    const color: Color.Color = GetColor(RowKind);
    const dimColor: boolean = GetDimColor(RowKind);

    return <Text
        { ...{ color, dimColor } }
        key={ Hash.array([ Character, Index, Height, RowKind, color, dimColor ]) }>
        { Character }
    </Text>;
};

export const ClackArm = (Props: ClackArmProps): React.ReactNode =>
{
    return Arr
        .range(0, Props.Height - 1)
        .map((Index: number) =>
            <ClackRow
                key={ Hash.array([ Props.Height, Index ]).toString() }
                { ...{ ...Props, Index } }
            />);
};
