/**
 *
 *
 * @module @sorrell/effect-ink/Component/Prose
 *
 * @file      Prose.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Atom from "../Atom.tsx";
import * as Color from "../../Color.ts";
import type * as Internal from "../../Internal/index.ts";
import type * as React from "react";
import type { Clack } from "../index.ts";
import CliBoxes from "cli-boxes";
import type { Data } from "effect";

export interface Props<in out TagType extends Internal.Prose.Prose["_tag"]>
{
    readonly Content: Data.TaggedEnum.Value<Internal.Prose.Prose, TagType>;
}

export interface Component<in out TagType extends Internal.Prose.Prose["_tag"]>
    extends React.FC<Props<TagType>> { }

export interface Prose<TagType extends Internal.Prose.Prose["_tag"]> extends Props<TagType>
{
    readonly Component: Component<TagType>;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const Prose = ({ Component, Content }: Prose<any>): React.ReactNode =>
{
    const GetCharacter = (_RowKind: Clack.RowKind): React.ReactNode =>
        _RowKind === "Top"
            ? Content._tag === "Header"
                ? CliBoxes.single.topLeft
                : Content._tag === "Outro"
                    ? CliBoxes.single.bottomLeft
                    : "├"
            : CliBoxes.single.left;

    const GetColor = (_RowKind: Clack.RowKind): Color.Color => Color.Chalk[Color.Undefined];

    const GetDimColor = (_RowKind: Clack.RowKind) => false;

    return (
        <Atom.Atom { ...{ GetCharacter, GetColor, GetDimColor } }>
            <Component { ...{ Content } } />
        </Atom.Atom>
    );
};
