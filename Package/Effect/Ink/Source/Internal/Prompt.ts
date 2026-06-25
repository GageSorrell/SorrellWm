/**
 * Internal tooling for the {@link \@sorrell/effect-ink/Prompt | Prompt} module.
 *
 * @module @sorrell/effect-ink/Internal/Prompt
 * @internal
 */

/**
 * @file      Prompt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Arr from "effect/Array";
import { Data, Option } from "effect";
import type { DateOptions, FileOptions, MultiSelectOptions, SelectOptions, TextOptions } from "../Prompt.ts";

export interface TextOptionsInternal extends Required<TextOptions>
{
    /**
     * The type of the text option.
     */
    readonly type:
        | "Hidden"
        | "Password"
        | "Text";
}

export interface ConfirmState
{
    readonly value: boolean;
    readonly internalRepresentation: string;
}

export interface FileOptionsInternal extends Required<Omit<FileOptions, "StartingPath" | "Default">>
{
    readonly StartingPath: Option.Option<string>;
    readonly Default: Option.Option<string>;
}

export interface DatePartParams
{
    readonly token: string
    readonly locales: DateOptions["locales"]
    readonly date?: globalThis.Date
    readonly parts?: ReadonlyArray<DatePart>
}

export abstract class DatePart
{
    token: string;
    readonly date: globalThis.Date;
    readonly parts: ReadonlyArray<DatePart>;
    readonly locales: DateOptions["locales"];

    constructor(params: DatePartParams)
    {
        this.token = params.token;
        this.locales = params.locales;
        this.date = params.date || new Date();
        this.parts = params.parts || [ this ];
    }

    /**
     * Increments this date part.
     */
    abstract increment(): void;

    /**
     * Decrements this date part.
     */
    abstract decrement(): void;

    /**
     * Sets the current value of this date part to the provided value.
     */
    abstract setValue(value: string): void;

    /**
     * Returns `true` if this `DatePart` is a `Token`, `false` otherwise.
     */
    isToken(): this is Token
    {
        return false;
    }

    /**
     * Retrieves the next date part in the list of parts.
     */
    nextPart(): Option.Option<DatePart>
    {
        const currentPartIndex: number =
            Option.getOrElse(Arr.findFirstIndex(this.parts, (part: DatePart) => part === this), () => 0);
        return Arr.findFirst(this.parts.slice(currentPartIndex + 1), (part: DatePart) => !part.isToken());
    }

    /**
     * Retrieves the previous date part in the list of parts.
     */
    previousPart(): Option.Option<DatePart>
    {
        const currentPartIndex: Option.Option<number> =
            Arr.findFirstIndex(this.parts, (part: DatePart) => part === this);

        if (Option.isSome(currentPartIndex))
        {
            return Arr.findLast(
                this.parts.slice(0, currentPartIndex.value),
                (part: DatePart) => !part.isToken()
            );
        }
        return Option.none();
    }

    toString()
    {
        return String(this.date);
    }
}

export class Token extends DatePart
{
    increment(): void { }

    decrement(): void { }

    setValue(value: string): void
    {
        this.token = this.token + value;
    }

    override isToken(): this is Token
    {
        return true;
    }

    override toString()
    {
        return this.token;
    }
}

export interface DateState
{
    readonly typed: string
    readonly cursor: number
    readonly value: globalThis.Date
    readonly dateParts: ReadonlyArray<DatePart>
    readonly error: Option.Option<string>
}

export type Confirm = Data.TaggedEnum<{
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    readonly Show: { };
    readonly Hide: { };
    /* eslint-enable @typescript-eslint/no-empty-object-type */
}>;

/* eslint-disable-next-line @typescript-eslint/typedef */
export const Confirm = Data.taggedEnum<Confirm>();

export interface FileState
{
    readonly cursor: number;
    readonly files: ReadonlyArray<string>;
    readonly allFiles: ReadonlyArray<string>;
    readonly query: string;
    readonly path: Option.Option<string>;
    readonly confirm: Confirm;
}

export interface NumberState
{
    readonly cursor: number;
    readonly error: Option.Option<string>;
    readonly value: string;
}

export type SelectState = number;

export type AutoCompleteState =
    {
        readonly query: string
        readonly index: number
        readonly filtered: ReadonlyArray<number>
    };

export interface TextState
{
    readonly cursor: number;
    readonly error: Option.Option<string>;
    readonly value: string;
}

export type MultiSelectState =
    {
        index: number;
        selectedIndices: Set<number>;
        error: Option.Option<string>;
    };

export type MultiSelectOptionsInternal<A> =
    Required<SelectOptions<A>> &
    MultiSelectOptions;

export type ToggleState = boolean;
