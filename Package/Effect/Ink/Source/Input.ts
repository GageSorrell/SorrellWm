/**
 * Types and functions for handling keyboard input.
 *
 * @module @sorrell/effect-ink/Input
 */

/**
 * @file      Input.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Arr from "effect/Array";
import type * as Ink from "ink";
import { Option, Record, pipe } from "effect";

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface Modifiers extends Omit<Ink.Key, "eventType"> { }

export interface Key
{
    readonly Input: Option.Option<string>;
    readonly Modifiers: Modifiers;
}

export const EmptyModifiers: Modifiers =
    {
        backspace: false,
        capsLock: false,
        ctrl: false,
        delete: false,
        downArrow: false,
        end: false,
        escape: false,
        home: false,
        hyper: false,
        leftArrow: false,
        meta: false,
        numLock: false,
        pageDown: false,
        pageUp: false,
        return: false,
        rightArrow: false,
        shift: false,
        super: false,
        tab: false,
        upArrow: false
    } as const;

export const EmptyKey: Key =
    {
        Input: Option.none(),
        Modifiers: EmptyModifiers
    } as const;

export interface KeyArgument
{
    readonly Input?: Option.Option<string>;
    readonly Modifiers?: Partial<Modifiers>;
};

export const Key = ({ Input = Option.none(), Modifiers = EmptyModifiers }: KeyArgument): Key =>
{
    return { Input, Modifiers: { ...EmptyModifiers, ...Modifiers } } as const;
};

export interface ModifierLabel
{
    readonly Long: string;
    readonly Short: string;
    readonly Symbol: string;
}

export const ModifierLabels: Record.ReadonlyRecord<keyof Modifiers, ModifierLabel> =
    {
        backspace:
        {
            Long: "Backspace",
            Short: "Bksp",
            Symbol: "⌫"
        },
        capsLock:
        {
            Long: "Caps Lock",
            Short: "CapsLock",
            Symbol: "⇪"
        },
        ctrl:
        {
            Long: "Ctrl",
            Short: "^",
            Symbol: "⎈"
        },
        delete:
        {
            Long: "Delete",
            Short: "Del",
            Symbol: "⌦"
        },
        downArrow:
        {
            Long: "Down Arrow",
            Short: "Down",
            Symbol: "↓"
        },
        end:
        {
            Long: "End",
            Short: "End",
            Symbol: "⇲"
        },
        escape:
        {
            Long: "Escape",
            Short: "Esc",
            Symbol: "⎋"
        },
        home:
        {
            Long: "Home",
            Short: "Home",
            Symbol: "⇱"
        },
        hyper:
        {
            Long: "Hyper",
            Short: "Hyper",
            Symbol: "✦"
        },
        leftArrow:
        {
            Long: "Left Arrow",
            Short: "Left",
            Symbol: "→"
        },
        meta:
        {
            Long: "Meta",
            Short: "Meta",
            Symbol: "◆"
        },
        numLock:
        {
            Long: "Num Lock",
            Short: "NumLock",
            Symbol: "⇭"
        },
        pageDown:
        {
            Long: "Page Down",
            Short: "PgDn",
            Symbol: "⇟"
        },
        pageUp:
        {
            Long: "Page Up",
            Short: "PgUp",
            Symbol: "⇞"
        },
        return:
        {
            Long: "Return",
            Short: "Enter",
            Symbol: "⏎"
        },
        rightArrow:
        {
            Long: "Right Arrow",
            Short: "Right",
            Symbol: "→"
        },
        shift:
        {
            Long: "Shift",
            Short: "Shift",
            Symbol: "⇧"
        },
        super:
        {
            Long: "Super",
            Short: "Super",
            Symbol: "❖"
        },
        tab:
        {
            Long: "Tab",
            Short: "Tab",
            Symbol: "↹"
        },
        upArrow:
        {
            Long: "Up Arrow",
            Short: "Up",
            Symbol: "↑"
        }
    } as const;

export const DefaultLabelsStrategy: Required<CustomLabelsStrategy> =
    {
        backspace: "Symbol",
        capsLock: "Symbol",
        ctrl: "Short",
        delete: "Short",
        downArrow: "Symbol",
        end: "Short",
        escape: "Short",
        home: "Short",
        hyper: "Short",
        leftArrow: "Symbol",
        meta: "Short",
        numLock: "Short",
        pageDown: "Short",
        pageUp: "Short",
        return: "Symbol",
        rightArrow: "Symbol",
        shift: "Short",
        super: "Short",
        tab: "Short",
        upArrow: "Symbol"
    } as const;

export type CustomLabelsStrategy = Partial<Record.ReadonlyRecord<keyof Modifiers, keyof ModifierLabel>>;

/* eslint-disable-next-line @typescript-eslint/typedef */
export const ModifierLabelsStrategy =
    {
        All: (Strategy: keyof ModifierLabel): Required<CustomLabelsStrategy> =>
        {
            const GetLabelByStrategy = (
                _Value: keyof ModifierLabel,
                Key: keyof Modifiers
            ) => ModifierLabels[Key][Strategy];

            return Record.map(DefaultLabelsStrategy, GetLabelByStrategy) as Required<CustomLabelsStrategy>;
        },
        Custom: (Strategy: CustomLabelsStrategy): Required<CustomLabelsStrategy> =>
            ({ ...DefaultLabelsStrategy, ...Strategy })
    } as const;

export const ModifierLabelPriorities: Arr.NonEmptyReadonlyArray<keyof Modifiers> =
    [
        "ctrl",
        "shift",
        "meta",
        "super",
        "hyper",
        "leftArrow",
        "upArrow",
        "downArrow",
        "rightArrow",
        "return",
        "home",
        "end",
        "pageUp",
        "pageDown",
        "delete",
        "tab",
        "numLock",
        "capsLock",
        "backspace",
        "escape"
    ] as const;

export const Separator: "+" = "+" as const;

export const ToString = (
    Key: Key,
    LabelsStrategy: Required<CustomLabelsStrategy> = DefaultLabelsStrategy
): string =>
{
    const IsModifierUsed = (Value: keyof Modifiers, _Index: number) => Key.Modifiers[Value];
    const GetLabel = (Value: keyof Modifiers, _Index: number) => ModifierLabels[Value][LabelsStrategy[Value]];

    const ModifiersPart: ReadonlyArray<string> =
        pipe(
            ModifierLabelPriorities,
            Arr.filter(IsModifierUsed),
            Arr.map(GetLabel)
        );

    const OutArray: ReadonlyArray<string> = Option.isSome(Key.Input)
        ? [ ...ModifiersPart, Key.Input.value ]
        : ModifiersPart;

    return Arr.join(OutArray, Separator).replace("^+", "^");
};
