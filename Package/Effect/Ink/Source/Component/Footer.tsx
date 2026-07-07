/**
 *
 *
 * @module @sorrell/effect-ink/Component/Footer
 *
 * @file      Footer.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as Input from "../Input.js";
import type * as Prompt from "../Prompt.ts";
import * as React from "react";
import * as Record from "effect/Record";
import { Hash } from "effect";

interface KeybindsProps
{
    readonly Keybinds: Prompt.Keybinds | undefined;
}

interface KeybindProps
{
    readonly Name: string;
    readonly Key: Input.Key;
}

const Keybind = ({ Key, Name }: KeybindProps): React.ReactNode =>
{
    return (
        <Ink.Box
            flexDirection="row"
            gap={ 1 }>
            <Ink.Text inverse>{ Input.ToString(Key) }</Ink.Text>
            <Ink.Text>{ Name }</Ink.Text>
        </Ink.Box>
    );
};

export const KeybindsFooter = ({ Keybinds }: KeybindsProps): React.ReactNode =>
{
    const ToKeybind = (Key: Input.Key, Name: string) =>
        <Keybind
            { ...{ Key, Name } }
            key={ Hash.array([ Key, Name ]).toString() }
        />;

    if (Keybinds === undefined || Record.size(Keybinds) === 0)
    {
        return undefined;
    }

    return (
        <Ink.Box
            borderBottom={ false }
            borderDimColor
            borderLeft={ false }
            borderRight={ false }
            borderStyle="single"
            borderTop
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-around"
            minHeight={ 1 }>
            { Record.values(Record.map(Keybinds, ToKeybind)) }
        </Ink.Box>
    );
};
