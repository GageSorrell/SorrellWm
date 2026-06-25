/**
 * The primary module of {@link \@sorrell/effect-ink}.
 *
 * @module @sorrell/effect-ink/Prompt
 */

/**
 * @file      Prompt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable prefer-rest-params */

import * as Arr from "effect/Array";
import type * as Cause from "effect/Cause";
// import * as Console from "effect/Console";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
// import * as EffectNumber from "effect/Number";
import * as Effectable from "effect/Effectable";
import * as Event from "./Internal/Event.js";
import * as FileSystem from "effect/FileSystem";
import * as Internal from "./Internal/Prompt.ts";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as Predicate from "effect/Predicate";
import type * as Primitive from "effect/unstable/cli/Primitive";
import * as Queue from "effect/Queue";
import * as Redacted from "effect/Redacted";
import * as Runtime from "./Runtime.tsx";
import type * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import * as Terminal from "effect/Terminal";
import { dual, pipe } from "effect/Function";
import { Component } from "./index.js";
import type { Covariant } from "effect/Types";
import type { Key } from "ink";
import type { NoSuchElementError } from "effect/Cause";

const TypeId: string = "~sorrell/effect-ink/Prompt";

/**
 * Represents an interactive terminal prompt that produces an `Output` value.
 *
 * **Details**
 *
 * A `Prompt` is an `Effect` that may fail with `Terminal.QuitError` and
 * requires the prompt environment needed to render frames, read input, and
 * access files or paths when a prompt uses them.
 *
 * @category models
 * @since 1.0.0
 */
export interface Prompt<Output> extends Effect.Effect<Output, Terminal.QuitError, Environment>
{
    readonly [ TypeId ]:
    {
        readonly _Output: Covariant<Output>;
    };
}

/**
 * Returns `true` if the provided value is a `Prompt`.
 *
 * @category guards
 * @since 1.0.0
 */
export const isPrompt = (u: unknown): u is Prompt<unknown> => Predicate.hasProperty(u, TypeId);

/**
 * Represents the services available to a custom `Prompt`.
 *
 * @category models
 * @since 1.0.0
 */
export type Environment =
    | FileSystem.FileSystem
    | Path.Path
    | Event.EventBridgePubSub
    | Scope.Scope
    | Terminal.Terminal;

/**
 * Represents the action that should be taken by a `Prompt` based upon user
 * input or an external event received during the current frame.
 *
 * @category models
 * @since 1.0.0
 */
export type Action<StateType, A> = Data.TaggedEnum<{
    /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
    readonly NoOp: { };
    readonly NextFrame: { readonly State: StateType; };
    readonly Submit: { readonly value: A; };
}>;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type AnyAction = Action<any, any>;

/**
 * Type-level definition for the tagged `Prompt.Action` variants.
 *
 * **Details**
 *
 * It connects the action state and output type parameters to the `NoOp`,
 * `NextFrame`, and `Submit` action cases.
 *
 * @category models
 * @since 1.0.0
 */
export interface ActionDefinition extends Data.TaggedEnum.WithGenerics<2>
{
    readonly taggedEnum: Action<this["A"], this["B"]>
}

/**
 * Represents the input that should be processed by a `Prompt` based upon user
 * input or an external event received during the current frame.
 *
 * @category models
 * @since 1.0.0
 */
export type ProcessInput<A> = Data.TaggedEnum<{
    readonly Input: { readonly input: Terminal.UserInput; };
    readonly Event: { readonly value: A; };
}>;

export interface HandlerArgument<StateType>
{
    readonly Input: Option.Option<string>;
    readonly Key: Key;
    readonly State: StateType;
}

export interface Handler<StateType, A>
{
    (Input: HandlerArgument<StateType>): Effect.Effect<Action<StateType, A>, never, Environment>;
}

/**
 * Represents the set of handlers used by a `Prompt`.
 *
 * **Details**
 *
 * The handlers render the current frame, process user input into the next
 * `Prompt.Action`, and clear the terminal screen before the next frame.
 *
 * @category models
 * @since 1.0.0
 */
export interface Handlers<StateType, OptionsType, A>
{
    // @TODO
    // Make `UseInput` hook which wraps `ink`'s hook for handling input,
    // and make a root component that implements `UseInput`.  The components
    // that are provided by prompts should not do much with state, and shouldn't
    // mutate any state.
    //

    // readonly _tag: string;

    readonly Component: Component.Component<StateType, OptionsType>;

    // /**
    //  * A function that is called to render the current frame of the `Prompt`.
    //  */
    // readonly render: (
    //     state: StateType,
    //     action: Action<StateType, A>
    // ) => Effect.Effect<string, never, Environment>;

    /**
     * A function that is called to process user input and determine the next
     * `Prompt.Action` that should be taken.
     */
    readonly Process: (Options: Required<OptionsType>) =>
    (Input: HandlerArgument<StateType>) => Effect.Effect<Action<StateType, A>, never, Environment>;

    // /**
    //  * A function that is called to clear the terminal screen before rendering
    //  * the next frame of the `Prompt`.
    //  */
    // readonly clear: (
    //     state: StateType,
    //     action: Action<StateType, A>
    // ) => Effect.Effect<string, never, Environment>;
}

/**
 * Options for a confirmation prompt that asks the user to choose a boolean
 * yes/no value.
 *
 * @category options
 * @since 1.0.0
 */
export interface ConfirmOptions extends Options<boolean>
{
    /**
     * The label to display after a user has responded to the prompt.
     */
    readonly Label?:
    {
        /**
         * The label used if the prompt is confirmed (defaults to `"yes"`).
         */
        readonly Confirm: string;

        /**
         * The label used if the prompt is not confirmed (defaults to `"no"`).
         */
        readonly Deny: string;
    };

    /**
     * The placeholder to display when a user is responding to the prompt.
     */
    readonly Placeholder?:
    {
        /**
         * The placeholder to use if the `initial` value of the prompt is `true`
         * (defaults to `"(Y/n)"`).
         */
        readonly DefaultConfirm?: string;

        /**
         * The placeholder to use if the `initial` value of the prompt is `false`
         * (defaults to `"(y/N)"`).
         */
        readonly DefaultDeny?: string;
    }
}

/**
 * Options for a date prompt, including the displayed message, initial value,
 * format mask, validation, and locale labels.
 *
 * @category options
 * @since 1.0.0
 */
export interface DateOptions
{
    /**
     * The message to display in the prompt.
     */
    readonly message: string
    /**
     * The initial date value to display in the prompt (defaults to the current
     * date).
     */
    readonly initial?: globalThis.Date
    /**
     * The format mask of the date (defaults to `YYYY-MM-DD HH:mm:ss`).
     */
    readonly dateMask?: string
    /**
     * An effectful function that can be used to validate the value entered into
     * the prompt before final submission.
     */
    readonly validate?: (value: globalThis.Date) => Effect.Effect<globalThis.Date, string>
    /**
     * Custom locales that can be used in place of the defaults.
     */
    readonly locales?: {
    /**
     * The full names of each month of the year.
     */
        readonly months: [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
        ]
        /**
         * The short names of each month of the year.
         */
        readonly monthsShort: [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string
        ]
        /**
         * The full names of each day of the week.
         */
        readonly weekdays: [string, string, string, string, string, string, string]
        /**
         * The short names of each day of the week.
         */
        readonly weekdaysShort: [string, string, string, string, string, string, string]
    }
}

/**
 * Options for an integer prompt, including bounds, keyboard step sizes, and
 * additional validation.
 *
 * @category options
 * @since 1.0.0
 */
export interface IntegerOptions extends Options<number>
{
    /**
     * The default value of the integer prompt.
     */
    readonly Default?: number;

    /**
     * The minimum value that can be entered by the user (defaults to `-Infinity`).
     */
    readonly Min?: number;

    /**
     * The maximum value that can be entered by the user (defaults to `Infinity`).
     */
    readonly Max?: number;

    /**
     * The value that will be used to increment the prompt value when using the
     * up arrow key (defaults to `1`).
     */
    readonly IncrementBy?: number;

    /**
     * The value that will be used to decrement the prompt value when using the
     * down arrow key (defaults to `1`).
     */
    readonly DecrementBy?: number;

    /**
     * An effectful function that can be used to validate the value entered into
     * the prompt before final submission.
     */
    readonly Validate?: (value: number) => Effect.Effect<number, string>;
}

/**
 * Options for a floating-point number prompt.
 *
 * **Details**
 *
 * In addition to the numeric bounds and step settings from `IntegerOptions`,
 * the prompt can be configured with a display precision.
 *
 * @category options
 * @since 1.0.0
 */
export interface FloatOptions extends IntegerOptions
{
    /** The precision to use for the floating point value (defaults to `2`). */
    readonly Precision?: number;
}

/**
 * Options for a text prompt that returns a list of strings by splitting the
 * input on a delimiter.
 *
 * @category options
 * @since 1.0.0
 */
export interface ListOptions extends TextOptions
{
    /**
     * The delimiter that separates list entries.
     */
    readonly delimiter?: string
}

/**
 * Options for a file-system selection prompt.
 *
 * **Details**
 *
 * They control which path type can be selected, the starting directory, paging,
 * and filtering of displayed entries.
 *
 * @category options
 * @since 1.0.0
 */
export interface FileOptions extends Options<string>
{
    /**
     * The path type that will be selected, defaulting to `"file"`.
     */
    readonly type?: Primitive.PathType;

    /**
     * Where the user will initially be prompted to select files from, defaulting
     * to the current working directory.
     */
    readonly StartingPath?: string;

    /**
     * The number of choices to display at one time, defaulting to `10`.
     */
    readonly maxPerPage?: number;

    /**
     * A predicate or effect that keeps a file in the prompt when it returns
     * `true`, defaulting to returning all files.
     */
    readonly filter?: (file: string) => boolean | Effect.Effect<boolean, never, Environment>;
}

/**
 * Options for a prompt that asks the user to select one value from a list of
 * choices.
 *
 * @category options
 * @since 1.0.0
 */
export interface SelectOptions<A>
{
    /**
     * The message to display in the prompt.
     */
    readonly message: string
    /**
     * The choices to display to the user.
     */
    readonly choices: ReadonlyArray<SelectChoice<A>>
    /**
     * The number of choices to display at one time (defaults to `10`).
     */
    readonly maxPerPage?: number
}

/**
 * Options for an autocomplete prompt that lets the user filter selectable
 * choices by typing.
 *
 * @category options
 * @since 1.0.0
 */
export interface AutoCompleteOptions<A> extends SelectOptions<A>
{
    /**
     * The label used for the filter display (defaults to "filter").
     */
    readonly filterLabel?: string
    /**
     * The placeholder shown when the filter is empty (defaults to "type to filter").
     */
    readonly filterPlaceholder?: string
    /**
     * The message displayed when no choices match (defaults to "No matches").
     */
    readonly emptyMessage?: string
}

/**
 * Options for a multi-select prompt, including bulk-selection labels and
 * minimum or maximum selection counts.
 *
 * @category options
 * @since 1.0.0
 */
export interface MultiSelectOptions
{
    /**
     * Text for the "Select All" option (defaults to "Select All").
     */
    readonly selectAll?: string
    /**
     * Text for the "Select None" option (defaults to "Select None").
     */
    readonly selectNone?: string
    /**
     * Text for the "Inverse Selection" option (defaults to "Inverse Selection").
     */
    readonly inverseSelection?: string
    /**
     * The minimum number of choices that must be selected.
     */
    readonly min?: number
    /**
     * The maximum number of choices that can be selected.
     */
    readonly max?: number
}

/**
 * Represents one choice displayed by select, autocomplete, and multi-select
 * prompts.
 *
 * @category models
 * @since 1.0.0
 */
export interface SelectChoice<A>
{
    /**
     * The name of the select option that is displayed to the user.
     */
    readonly title: string
    /**
     * The underlying value of the select option.
     */
    readonly value: A
    /**
     * An optional description for the select option which will be displayed
     * to the user.
     */
    readonly description?: string
    /**
     * Whether or not this select option is disabled.
     */
    readonly disabled?: boolean
    /**
     * Whether this option should be selected by default (only used by MultiSelect).
     */
    readonly selected?: boolean
}

/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * Options for text-entry prompts, including the displayed message, default
 * text, and effectful validation before submission.
 *
 * @category options
 * @since 1.0.0
 */
export interface TextOptions extends Options<string>
{
}

/* eslint-enable @typescript-eslint/no-empty-object-type */

/**
 * Options for a toggle prompt that lets the user switch between active and
 * inactive boolean states.
 *
 * @category options
 * @since 1.0.0
 */
export interface ToggleOptions extends Options<boolean>
{
    /**
     * The text to display when the toggle is in the active state (defaults to
     * `on`).
     */
    readonly Active?: string;

    /**
     * The text to display when the toggle is in the inactive state (defaults to
     * `off`).
     */
    readonly Inactive?: string;
}

type Figures = Readonly<{
    arrowDown: string;
    arrowLeft: string;
    arrowRight: string;
    arrowUp: string;
    checkboxOff: string;
    checkboxOn: string;
    cross: string;
    ellipsis: string;
    line: string;
    pointer: string;
    pointerSmall: string;
    radioOff: string;
    radioOn: string;
    tick: string;
}>;

const DefaultFigures: Figures =
    {
        arrowDown: "↓",
        arrowLeft: "←",
        arrowRight: "→",
        arrowUp: "↑",
        checkboxOff: "☐",
        checkboxOn: "☒",
        cross: "✖",
        ellipsis: "…",
        line: "─",
        pointer: "❯",
        pointerSmall: "›",
        radioOff: "◯",
        radioOn: "◉",
        tick: "✔"
    };

const WindowsFigures: Figures =
    {
        arrowDown: DefaultFigures.arrowDown,
        arrowLeft: DefaultFigures.arrowLeft,
        arrowRight: DefaultFigures.arrowRight,
        arrowUp: DefaultFigures.arrowUp,
        checkboxOff: "[ ]",
        checkboxOn: "[*]",
        cross: "×",
        ellipsis: "...",
        line: "─",
        pointer: ">",
        pointerSmall: "»",
        radioOff: "( )",
        radioOn: "(*)",
        tick: "√"
    };

/** @internal */
export const PlatformFigures: Effect.Effect<Figures> =
    Effect.map(
        Effect.sync(() => process.platform === "win32"),
        (IsWindows: boolean) => IsWindows
            ? WindowsFigures
            : DefaultFigures
    );

/**
 * Type alias for any `Prompt`, regardless of its output type.
 *
 * @category utility types
 * @since 1.0.0
 */
export type Any = Prompt<unknown>;

/**
 * Namespace containing return-type helpers for `Prompt.all`.
 *
 * @since 1.0.0
 */
export declare namespace All
{
    /**
     * Computes the prompt returned by `Prompt.all` for an iterable of prompts.
     *
     * **Details**
     *
     * The resulting prompt produces an array of each prompt's output value.
     *
     * @category utility types
     * @since 1.0.0
     */
    export type ReturnIterable<T extends Iterable<Any>> =
        [ T ] extends [ Iterable<Prompt<infer A>> ]
            ? Prompt<Array<A>>
            : never;

    /**
     * Computes the prompt returned by `Prompt.all` for a readonly tuple or array
     * of prompts, preserving tuple positions in the output type.
     *
     * @category utility types
     * @since 1.0.0
     */
    export type ReturnTuple<T extends ReadonlyArray<unknown>> = Prompt<
        T[number] extends never
            ? [ ]
            : { -readonly [ K in keyof T ]: [ T[K] ] extends [ Prompt<infer _A> ]
                ? _A
                : never }
    > extends infer X
        ? X
        : never;

    /**
     * Computes the prompt returned by `Prompt.all` for a record of prompts,
     * preserving the record keys and replacing each prompt with its output type.
     *
     * @category utility types
     * @since 1.0.0
     */
    export type ReturnObject<T> = [ T ] extends [ { [ K: string ]: Any } ]
        ? Prompt<
            {
                -readonly [ K in keyof T ]: [ T[K] ] extends [ Prompt<infer _A> ]
                    ? _A
                    : never;
            }>
        : never;

    /**
     * Computes the return prompt type for `Prompt.all` based on the input
     * structure.
     *
     * @category constructors
     * @since 1.0.0
     */
    export type Return<Arg extends Iterable<Any> | Record<string, Any>> =
        [ Arg ] extends [ ReadonlyArray<Any> ]
            ? ReturnTuple<Arg>
            : [ Arg ] extends [ Iterable<Any> ]
                ? ReturnIterable<Arg>
                : [ Arg ] extends [ Record<string, Any> ]
                    ? ReturnObject<Arg>
                    : never;
}

/**
 * Runs all the provided prompts in sequence respecting the structure provided
 * in input.
 *
 * **Details**
 *
 * Supports either a tuple / iterable of prompts or a record / struct of prompts
 * as an argument.
 *
 * **Example** (Collecting prompt results)
 *
 * ```ts
 * import { Effect } from "effect"
 * import { Prompt } from "effect/unstable/cli"
 *
 * const username = Prompt.text({
 *   message: "Enter your username: "
 * })
 *
 * const password = Prompt.password({
 *   message: "Enter your password: ",
 *   validate: (value) =>
 *     value.length === 0
 *       ? Effect.fail("Password cannot be empty")
 *       : Effect.succeed(value)
 * })
 *
 * const allWithTuple = Prompt.all([username, password])
 *
 * const allWithRecord = Prompt.all({ username, password })
 * ```
 *
 * @category collecting & elements
 * @since 1.0.0
 */
export const all: <
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const Arg extends Iterable<Prompt<any>> | Record<string, Prompt<any>>
>(arg: Arg) => All.Return<Arg> = function()
{
    if (arguments.length === 1)
    {
        if (isPrompt(arguments[0]))
        {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            return map(arguments[0], (x: unknown) => [ x ]) as any;
        }
        else if (Array.isArray(arguments[0]))
        {
            return allTupled(arguments[0]) as any;
        }
        else
        {
            const entries: Array<[ string, Prompt<any> ]> =
                Object.entries(arguments[0] as Readonly<{ [ K: string ]: Prompt<any> }>);
            let result: Prompt<{ [ K: string ]: any; }> =
                map(entries[0][1], (value: any) => ({ [entries[0][0]]: value }));
            if (entries.length === 1)
            {
                return result as any;
            }
            const rest: Array<[ string, Prompt<any> ]> = entries.slice(1);
            for (const [ key, prompt ] of rest)
            {
                result = pipe(
                    result,
                    flatMap((record: Record<string, any>) =>
                        pipe(
                            prompt,
                            map((Value: any) => ({
                                ...record,
                                [ key ]: Value
                            }))
                        )
                    )
                );
            }
            return result as any;
        }
    }
    return allTupled(arguments[0]) as any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
};

/**
 * Creates a confirmation prompt that asks the user to choose a boolean yes/no
 * value.
 *
 * **When to use**
 *
 * Use to ask for a yes/no answer that can be submitted directly.
 *
 * **Details**
 *
 * `initial` defaults to `false`. Enter submits the current default, yes-style
 * input submits `true`, no-style input submits `false`, and other input beeps.
 *
 * @see {@link toggle} for an interactive switch-before-submit boolean prompt
 *
 * @category constructors
 * @since 1.0.0
 */
export const confirm = (options: ConfirmOptions): Prompt<boolean> =>
{
    const opts: Required<ConfirmOptions> =
        {
            Default: false,
            Plain: false,
            Validate: Effect.succeed,
            ...options,
            Label: {
                Confirm: "yes",
                Deny: "no",
                ...options.Label
            },
            Placeholder:
            {
                DefaultConfirm: "(Y/n)",
                DefaultDeny: "(y/N)",
                ...options.Placeholder
            }
        };

    const initialState: Internal.ConfirmState =
        {
            internalRepresentation: opts.Default ? "Y" : "N",
            value: opts.Default
        };

    return custom(
        initialState,
        opts,
        {
            // _tag: "Confirm",

            Component: Component.Confirm,
            Process: handleConfirmProcess
        }
    );
};

/**
 * Creates a custom `Prompt` from the specified initial state and handlers.
 *
 * **Details**
 *
 * The initial state can either be a pure value or an `Effect`. This is
 * particularly useful when the initial state of the `Prompt` must be computed
 * by performing an effectful computation, such as reading data from the file
 * system. A `Prompt` runs as a render loop: `render` returns ANSI output for
 * the current frame, the `Terminal` obtains user input, `process` returns the
 * next prompt action, and `clear` returns ANSI output used to clear the previous
 * frame.
 *
 * Optionally, an external `events` dequeue can be provided as the third
 * argument. When present, the render loop will race user input against events
 * from the dequeue, allowing background events to trigger re-renders without
 * waiting for a keypress. When an event is received from the dequeue, the
 * `receive` handler is called instead of `process`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const custom = <State, OptionsType, Output>(
    initialState: State | Effect.Effect<State, never, Environment>,
    Options: Required<OptionsType>,
    handlers: Handlers<State, OptionsType, Output>
): Prompt<Output> =>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const op: any = Object.create(proto);
    op._tag = "Loop";
    op.InitialState = initialState;
    op.Process = handlers.Process(Options);
    op.Options = Options;
    // op.events = events;
    op.Component = handlers.Component;
    return op;
};

/**
 * Creates a date prompt that lets the user edit a formatted date value and
 * validates the final `Date` before submission.
 *
 * **Details**
 *
 * `initial` defaults to the current `Date`, `dateMask` defaults to
 * `YYYY-MM-DD HH:mm:ss`, mask parsing creates editable date parts plus literal
 * tokens, `locales` customizes month and weekday labels, and `validate` runs on
 * submission.
 *
 * **Gotchas**
 *
 * A supplied `initial` `Date` is edited in place during prompt interaction.
 * Date edits use JavaScript `Date` setters, so out-of-range typed values can
 * normalize before validation. If the prompt is meant to be editable,
 * `dateMask` should contain at least one editable date token.
 *
 * @category constructors
 * @since 1.0.0
 */
export const date = (options: DateOptions): Prompt<Date> =>
{
    const opts: Required<DateOptions> =
        {
            dateMask: "YYYY-MM-DD HH:mm:ss",
            initial: new Date(),
            validate: Effect.succeed,
            ...options,
            locales:
            {
                ...defaultLocales,
                ...options.locales
            }
        };
    const dateParts: Array<Internal.DatePart> = makeDateParts(opts.dateMask, opts.initial, opts.locales);
    const initialCursorPosition: number = dateParts.findIndex((part: Internal.DatePart) => !part.isToken());
    const initialState: Internal.DateState =
        {
            cursor: initialCursorPosition,
            dateParts,
            error: Option.none(),
            typed: "",
            value: opts.initial
        };

    return custom(
        initialState,
        opts,
        {
            // _tag: "Date",

            Component: Component.Date,
            Process: handleDateProcess
        }
    );
};

/**
 * Creates a file-system selection prompt and returns the selected path.
 *
 * **Details**
 *
 * The prompt can be configured to select files, directories, or either path
 * type.
 *
 * @category constructors
 * @since 1.0.0
 */
export const file = (options: FileOptions): Prompt<string> =>
{
    const opts: Required<Internal.FileOptionsInternal> =
        {
            Default: Option.fromUndefinedOr(options.Default),
            Message: options.Message ?? "Choose a file",
            Plain: options.Plain ?? false,
            StartingPath: Option.fromUndefinedOr(options.StartingPath),
            Validate: Effect.succeed,
            filter: options.filter ?? (() => Effect.succeed(true)),
            maxPerPage: options.maxPerPage ?? 10,
            type: options.type ?? "file"
        };

    const initialState: Effect.Effect<
        Internal.FileState,
        never,
        Environment
    > = Effect.gen(function*()
    {
        const currentPath: string = yield* resolveCurrentPath(Option.none(), opts);
        const path: Path.Path = yield* Path.Path;
        const defaultPath: Option.Option<string> =
            Option.map(opts.Default, (DefaultValue: string) => path.resolve(currentPath, DefaultValue));
        const initialPath: string = Option.match(defaultPath, {
            onNone: () => currentPath,
            onSome: (defaultPath: string) => path.dirname(defaultPath)
        });
        const files: Array<string> = yield* getFileList(initialPath, opts);
        const cursor: number = Option.match(defaultPath, {
            onNone: () => 0,
            onSome: (defaultPath: string) =>
            {
                const index: number = files.indexOf(path.basename(defaultPath));
                return index === -1 ? 0 : index;
            }
        });
        const confirm: Internal.Confirm = Internal.Confirm.Hide();
        return {
            allFiles: files,
            confirm,
            cursor,
            files,
            path: Option.map(defaultPath, path.dirname),
            query: ""
        };
    });

    return custom(
        initialState,
        opts,
        {
            // _tag: "File",

            Component: Component.File,
            Process: handleFileProcess
        }
    );
};

/**
 * Composes prompts by using the output of this prompt to create the next prompt.
 *
 * @category combinators
 * @since 1.0.0
 */
export const flatMap: {
    <Output, Output2>(
        f: (output: Output) => Prompt<Output2>
    ): (self: Prompt<Output>) => Prompt<Output2>
    <Output, Output2>(
        self: Prompt<Output>,
        f: (output: Output) => Prompt<Output2>
    ): Prompt<Output2>
} = dual(2, <Output, Output2>(
    self: Prompt<Output>,
    f: (output: Output) => Prompt<Output2>
) =>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const op: any = Object.create(proto);
    op._tag = "OnSuccess";
    op.Prompt = self;
    op.OnSuccess = f;
    return op;
});

/**
 * Creates a floating-point number prompt.
 *
 * **Details**
 *
 * The prompt supports minimum and maximum bounds, keyboard step sizes, display
 * precision, and additional validation before submission.
 *
 * @category constructors
 * @since 1.0.0
 */
export const float = (options: FloatOptions): Prompt<number> =>
{
    const opts: Required<FloatOptions> =
        {
            DecrementBy: 1,
            Default: 0,
            IncrementBy: 1,
            Max: Number.POSITIVE_INFINITY,
            Min: Number.NEGATIVE_INFINITY,
            Plain: false,
            Precision: 2,
            Validate: (n: number) =>
            {
                if (n < opts.Min)
                {
                    return Effect.fail(`${ n } must be greater than or equal to ${ opts.Min }`);
                }
                if (n > opts.Max)
                {
                    return Effect.fail(`${ n } must be less than or equal to ${ opts.Max }`);
                }
                return Effect.succeed(n);
            },
            ...options
        };
    const initialValue: string = options.Default === undefined ? "" : `${ opts.Default }`;
    const initialState: Internal.NumberState =
        {
            cursor: initialValue.length,
            error: Option.none(),
            value: initialValue
        };
    return custom(
        initialState,
        opts,
        {
            // _tag: "Float",

            Component: Component.Float,
            Process: handleProcessFloat
        }
    );
};
/**
 * Creates a text prompt that does not echo typed input and returns the
 * submitted value wrapped in `Redacted`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const hidden = (options: TextOptions): Prompt<Redacted.Redacted> =>
    pipe(
        basePrompt(options, "Hidden"),
        map(Redacted.make)
    );

/**
 * Creates an integer prompt.
 *
 * **Details**
 *
 * The prompt supports minimum and maximum bounds, keyboard step sizes, and
 * additional validation before submission.
 *
 * @category constructors
 * @since 1.0.0
 */
export const integer = (options: IntegerOptions): Prompt<number> =>
{
    const opts: Required<IntegerOptions> =
        {
            DecrementBy: 1,
            Default: 0,
            IncrementBy: 1,
            Max: Number.POSITIVE_INFINITY,
            Min: Number.NEGATIVE_INFINITY,
            Plain: false,
            Validate: (n: number) =>
            {
                if (n < opts.Min)
                {
                    return Effect.fail(`${ n } must be greater than or equal to ${ opts.Min }`);
                }
                if (n > opts.Max)
                {
                    return Effect.fail(`${ n } must be less than or equal to ${ opts.Max }`);
                }
                return Effect.succeed(n);
            },
            ...options
        };

    const initialValue: string = options.Default === undefined ? "" : `${ opts.Default }`;
    const initialState: Internal.NumberState =
        {
            cursor: initialValue.length,
            error: Option.none(),
            value: initialValue
        };

    return custom(
        initialState,
        opts,
        {
            // _tag: "Integer",

            Component: Component.Integer,
            Process: handleProcessInteger
        }
    );
};

/**
 * Creates a text prompt that returns an array of strings by splitting the
 * submitted input on the configured delimiter.
 *
 * @category constructors
 * @since 1.0.0
 */
export const list = (options: ListOptions): Prompt<Array<string>> =>
    pipe(
        text(options),
        map((output: string) => output.split(options.delimiter || ","))
    );

/**
 * Transforms the output value produced by a prompt.
 *
 * @category combinators
 * @since 1.0.0
 */
export const map: {
    <Output, Output2>(
        f: (output: Output) => Output2
    ): (self: Prompt<Output>) => Prompt<Output2>
    <Output, Output2>(
        self: Prompt<Output>,
        f: (output: Output) => Output2
    ): Prompt<Output2>
} = dual(2, <Output, Output2>(
    self: Prompt<Output>,
    f: (output: Output) => Output2
) => flatMap(self, (a: Output) => succeed(f(a))));

/**
 * Creates a password prompt that masks typed input and returns the submitted
 * value wrapped in `Redacted`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const password = (options: TextOptions): Prompt<Redacted.Redacted> =>
    pipe(
        basePrompt(options, "Password"),
        map(Redacted.make)
    );

// const IsInkInputEvent = (Value: unknown): Value is Event.InputEvent =>
// {
//     return (
//         typeof Value === "object" &&
//         Value !== null &&
//         "_tag" in Value &&
//         Value._tag === "InputEvent"
//     );
// };

// const SubscribeToInputEvents = (
//     EventPubSub: PubSub.PubSub<Event.InkEvent>
// ): Effect.Effect<Queue.Dequeue<Event.InputEvent>, never, Scope.Scope> =>
//     Effect.gen(function* ()
//     {
//         const Subscription: PubSub.Subscription<Event.InkEvent> = yield* PubSub.subscribe(EventPubSub);
//         const FilteredQueue: Queue.Queue<Event.InputEvent> = yield* Queue.unbounded<Event.InputEvent>();

//         const input: Queue.Dequeue<Event.InkEvent, Cause.Done<void>> =
//             // SubscribeToInputEvents(Event.EventBridgePubSub.Service.Subscribe);
//             yield* Stream.toQueue(
//                 Event.EventBridgePubSub.Service.Subscribe,
//                 { capacity: "unbounded" }
//             );

//         yield* Effect.addFinalizer(() => Queue.shutdown(FilteredQueue));

//         yield* pipe(
//             PubSub.take(Subscription),
//             Effect.flatMap((EventValue: Event.InkEvent) =>
//                 IsInkInputEvent(EventValue)
//                     ? Queue.offer(FilteredQueue, EventValue).pipe(Effect.asVoid)
//                     : Effect.void
//             ),
//             Effect.forever,
//             Effect.forkScoped
//         );

//         return FilteredQueue;
//     });

/**
 * Runs a prompt by reading terminal input and rendering prompt frames until the
 * prompt submits a value.
 *
 * **Gotchas**
 *
 * The returned effect may fail with `Terminal.QuitError` if terminal input ends
 * or the prompt is quit.
 *
 * @category execution
 * @since 1.0.0
 */
export const run: <Output>(
    self: Prompt<Output>
) => Effect.Effect<
    Output,
    Terminal.QuitError,
    Environment
> = Effect.fnUntraced(
    function*<Output>(self: Prompt<Output>)
    {
        return yield* pipe(
            Effect.gen(function* ()
            {
                yield* EnsureInk;

                // /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                // const ThePubSub: PubSub.PubSub<AnyAction> = yield* PubSub.make<AnyAction>({
                //     atomicPubSub: () => PubSub.makeAtomicBounded(100),
                //     strategy: () => new PubSub.BackPressureStrategy()
                // });

                // const terminal: Terminal.Terminal = yield* Terminal.Terminal;
                // const input: Queue.Dequeue<Terminal.UserInput, Cause.Done<void>> =
                //     Event.EventBridgePubSub.Service.Publish();

                // const input: Queue.Dequeue<Event.InkEvent, Cause.Done<void>> =
                //     // SubscribeToInputEvents(Event.EventBridgePubSub.Service.Subscribe);
                //     yield* Stream.toQueue(
                //         Event.EventBridgePubSub.Service.Subscribe,
                //         { capacity: "unbounded" }
                //     );

                const pubSub: Event.EventBridgePubSubImpl = yield* Event.EventBridgePubSub;

                const input: Queue.Dequeue<Event.InputEvent, Cause.Done<void>> =
                    yield* Stream.toQueue(
                        pubSub.Input.Stream,
                        { capacity: "unbounded" }
                    );

                return yield* pipe(
                    runWithInput(self, input),
                    // runWithInput(self, input),
                    Effect.scoped
                );
            }),
            Effect.scoped
        );
    },
    Effect.mapError(() => new Terminal.QuitError({ }))
);

const getSelectInitialIndex = <A>(choices: ReadonlyArray<SelectChoice<A>>): number =>
{
    let initialIndex: number = 0;
    let seenSelected: number = -1;
    for (let i: number = 0; i < choices.length; i++)
    {
        const choice: SelectChoice<A> = choices[i] as SelectChoice<A>;
        if (choice.selected === true)
        {
            if (seenSelected !== -1)
            {
                throw new Error(
                    "InvalidArgumentException: only a single choice can be selected " +
                    "by default for Prompt.select"
                );
            }
            seenSelected = i;
        }
    }
    if (seenSelected !== -1)
    {
        initialIndex = seenSelected;
    }
    return initialIndex;
};

/**
 * Creates a prompt that lets the user select a single value from a list of
 * choices.
 *
 * **Gotchas**
 *
 * At most one choice may be marked as selected by default.
 *
 * @category constructors
 * @since 1.0.0
 */
export const select = <const A>(options: SelectOptions<A>): Prompt<A> =>
{
    const opts: SelectOptionsReq<A> =
        {
            maxPerPage: 10,
            ...options
        };
    const initialIndex: number = getSelectInitialIndex(opts.choices);
    return custom(
        initialIndex,
        opts,
        {
            // _tag: "Select",

            Component: Component.Select,
            Process: handleSelectProcess
        }
    );
};

/**
 * Creates a prompt that lets users filter select choices by typing.
 *
 * **Example** (Filtering choices with autocomplete)
 *
 * ```ts
 * import { Prompt } from "effect/unstable/cli"
 *
 * const language = Prompt.autoComplete({
 *   message: "Choose a language",
 *   choices: [
 *     { title: "TypeScript", value: "ts" },
 *     { title: "Rust", value: "rs" },
 *     { title: "Kotlin", value: "kt" }
 *   ]
 * })
 * ```
 *
 * @category constructors
 * @since 1.0.0
 */
export const autoComplete = <const A>(options: AutoCompleteOptions<A>): Prompt<A> =>
{
    const opts: AutoCompleteOptionsReq<A> =
        {
            emptyMessage: "No matches",
            filterLabel: "filter",
            filterPlaceholder: "type to filter",
            maxPerPage: 10,
            ...options
        };

    const initialIndex: number = getSelectInitialIndex(opts.choices);
    const filtered: Array<number> = filterAutoCompleteChoices(opts.choices, "");
    const index: number = filtered.length === 0
        ? 0
        : filtered.includes(initialIndex)
            ? initialIndex
            : filtered[0];

    const initialState: Internal.AutoCompleteState =
        {
            filtered,
            index,
            query: ""
        };

    return custom(
        initialState,
        opts,
        {
            // _tag: "AutoComplete",

            Component: Component.AutoComplete,
            Process: handleAutoCompleteProcess
        }
    );
};

/**
 * Creates a prompt that lets the user select multiple choices and returns their
 * values as an array.
 *
 * **Details**
 *
 * The prompt supports default selected choices, bulk-selection commands, and
 * minimum or maximum selection counts.
 *
 * @category constructors
 * @since 1.0.0
 */
export const multiSelect = <const A>(
    options: SelectOptions<A> & MultiSelectOptions
): Prompt<Array<A>> =>
{
    const opts: Required<Internal.MultiSelectOptionsInternal<A>> =
        {
            inverseSelection: "Invert Selection",
            max: Infinity,
            maxPerPage: 10,
            min: -Infinity,
            selectAll: "Select All",
            selectNone: "Select None",
            ...options
        };

    // Seed initial selection from choices marked as selected: true
    const initialSelected: Set<number> = new Set<number>();
    for (let i: number = 0; i < opts.choices.length; i++)
    {
        const choice: SelectChoice<A> = opts.choices[i] as SelectChoice<A>;
        if (choice.selected === true)
        {
            initialSelected.add(i);
        }
    }
    const initialState: Internal.MultiSelectState =
        {
            error: Option.none(),
            index: 0,
            selectedIndices: initialSelected
        };

    return custom(
        initialState,
        opts,
        {
            // _tag: "MultiSelect",

            Component: Component.MultiSelect,
            Process: handleMultiSelectProcess
        }
    );
};

/**
 * Creates a `Prompt` which immediately succeeds with the specified value.
 *
 * **Details**
 *
 * This prompt does not attempt to obtain user input or render anything to the
 * screen.
 *
 * @category constructors
 * @since 1.0.0
 */
export const succeed = <A>(value: A): Prompt<A> =>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const op: any = Object.create(proto);
    op._tag = "Succeed";
    op.value = value;
    return op;
};

/**
 * Creates a text-entry prompt that echoes input and returns the submitted
 * string after validation.
 *
 * @category constructors
 * @since 1.0.0
 */
export const text = (
    options: TextOptions
): Prompt<string> => basePrompt(options, "Text");

/**
 * Creates a toggle prompt that lets the user switch between active and inactive
 * states and returns the selected boolean value.
 *
 * @category constructors
 * @since 1.0.0
 */
export const toggle = (options: ToggleOptions): Prompt<boolean> =>
{
    const opts: ToggleOptionsReq =
        {
            Active: "on",
            Default: false,
            Inactive: "off",
            Plain: false,
            Validate: Effect.succeed,
            ...options
        };
    return custom(
        opts.Default,
        opts,
        {
            // _tag: "Toggle",

            Component: Component.Toggle,
            Process: handleToggleProcess
        }
    );
};

export interface Options<in out A>
{
    /** Whether formatting (*e.g.*, colors, bold, *etc.*) should be suppressed. */
    readonly Plain?: boolean;

    /** The message to display in the prompt. */
    readonly Message: string;

    /**
     * The default value of the text option.
     */
    readonly Default?: A;

    /**
     * An effectful function that can be used to validate the value entered into
     * the prompt before final submission.
     */
    readonly Validate?: (Value: A) => Effect.Effect<A, string>;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const proto: any =
    {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        ...Effectable.Prototype<Prompt<any>>({
            evaluate()
            {
                return run(this);
            },
            label: "InkPrompt"
        }),
        [ TypeId ]:
        {
            _Output: (_: never) => _
        }
    };

/* eslint-disable @typescript-eslint/no-empty-object-type */

type Op<Tag extends string, Body = { }> =
    Prompt<never> &
    Body &
    {
        readonly _tag: Tag;
    };

type PromptPrimitive = Loop | OnSuccess | Succeed;

interface Loop extends
    Op<"Loop", {
        readonly InitialState: unknown | Effect.Effect<unknown, never, Environment>;
        // readonly render: Handlers<unknown, unknown>["render"];
        // readonly Process: (
        //     Input: unknown,
        //     State: unknown
        // ) => Effect.Effect<Action<unknown, unknown>, never, Environment>;
        // readonly clear: Handlers<unknown, unknown>["clear"];
        readonly Component: Component.Component<unknown, unknown>;
        readonly Options: unknown;
        readonly events: Queue.Dequeue<unknown, never> | undefined;
        readonly Process: ReturnType<Handlers<unknown, unknown, unknown>["Process"]>;
    }>
{ }

/** @internal */
export interface OnSuccess extends
    Op<"OnSuccess", {
        readonly Prompt: PromptPrimitive;
        readonly OnSuccess: (value: unknown) => Prompt<unknown>;
    }>
{ }

interface Succeed extends
    Op<"Succeed", {
        readonly value: unknown
    }>
{ }

/* eslint-enable @typescript-eslint/no-empty-object-type */

/* eslint-disable @typescript-eslint/no-explicit-any */
const allTupled = <const T extends ArrayLike<Prompt<any>>>(arg: T): Prompt<{
    [ K in keyof T ]: [ T[K] ] extends [  Prompt<infer A> ] ? A : never;
}> =>
{
    if (arg.length === 0)
    {
        return succeed([ ]) as any;
    }
    if (arg.length === 1)
    {
        return map(arg[0], (x: any) => [ x ]) as any;
    }
    let result: Prompt<Array<any>> = map(arg[0], (x: any) => [ x ]);
    for (let i: number = 1; i < arg.length; i++)
    {
        const curr: Prompt<any> = arg[i];
        result = flatMap(result, (tuple: Array<any>) => map(curr, (a: any) => [ ...tuple, a ]));
    }
    return result as any;
};

/* eslint-enable @typescript-eslint/no-explicit-any */

const EnsureInk: Effect.Effect<
    void,
    Runtime.InkRuntimeError,
    | Event.EventBridgePubSub
    | Scope.Scope
> = Runtime.Runtime.defaultValue().Run(Component.RootComponent);

const runWithInput = <A>(
    prompt: Prompt<A>,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    // pubSub: PubSub.PubSub<AnyAction>,
    // terminal: Terminal.Terminal,
    input: Queue.Dequeue<Event.InputEvent, Cause.Done<void>>
): Effect.Effect<A, NoSuchElementError | Runtime.InkRuntimeError, Environment | Scope.Scope> =>
    Effect.suspend(() =>
    {
        const op: PromptPrimitive = prompt as PromptPrimitive;

        // Effect.runSync(Console.dir(prompt));

        switch (op._tag)
        {
            case "Loop":
            {
                return runLoop(op, input);
            }
            case "OnSuccess":
            {
                return Effect.flatMap(
                    runWithInput(op.Prompt, input),
                    (a: never) => runWithInput(op.OnSuccess(a), input)
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                ) as any;
            }
            case "Succeed":
            {
                return Effect.succeed(op.value);
            }
        }
    });

const runLoop: {
    (loop: Loop,
    //     /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    //     pubSub: PubSub.PubSub<AnyAction>,
        input: Queue.Dequeue<Event.InputEvent, Cause.Done<void>>
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ): Effect.Effect<unknown, any, any>;
} = Effect.fnUntraced(
    function*(
        loop: Loop,
        input: Queue.Dequeue<Event.InputEvent, Cause.Done<void>>
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        // pubSub: PubSub.PubSub<AnyAction>,
        // input: Queue.Dequeue<Terminal.UserInput, Cause.Done>
    )
    {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        // pubSub.pubsub.publish(undefined as any);
        // pubSub.pubsub.publish({
        //     _tag: "BeginRunLoop",
        //     Payload:
        //     {

        //     }
        // });

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        let state: any = Effect.isEffect(loop.InitialState)
            ? yield* loop.InitialState
            : loop.InitialState;

        let action: Action<unknown, unknown> = Action.NextFrame({ State: state });

        const pubSub: Event.EventBridgePubSubImpl = yield* Event.EventBridgePubSub;

        // yield* Console.dir(loop.Component);

        yield* pubSub.ActionOptions.Publish(Event.BeginPromptEvent({
            Component: loop.Component,
            Options: loop.Options
        }));

        while (true)
        {
            // @TODO Where to pick back up:
            //
            // The `Action` `Part` should be extended to also allow for submitting options
            // and the Component, which should correspond to the root component creating
            // a new instance of that component, and updating its state on subsequent publishes
            // of a new event type that belongs to the `Action` `Part`.

            yield* pubSub.ActionOptions.Publish(action);
            const { _tag, ...Tail }: Event.InputEvent = yield* Queue.take(input);
            action = yield* loop.Process({ ...Tail, State: state });
            // // const msg: string = yield* loop.render(state, action);
            // /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            // // yield* Effect.orDie(terminal.display(msg));
            // if (loop.events)
            // {
            //     // type InputEffect = Effect.Effect<{
            //     //     _tag: "Input";
            //     //     input: Terminal.UserInput;
            //     // }, Cause.Done<void>, never>;

            //     // const takeInput: InputEffect = pipe(
            //     //     Queue.take(input),
            //     //     Effect.map((input: Terminal.UserInput) => ({ _tag: "Input" as const, input }))
            //     // );
            //     // const result: (
            //     //     | {
            //     //         _tag: "Input";
            //     //         input: Terminal.UserInput;
            //     //     }
            //     //     | {
            //     //         _tag: "Event";
            //     //         value: unknown;
            //     //     }
            //     // ) = yield* Effect.raceFirst(
            //     //     takeInput,
            //     //     pipe(
            //     //         Queue.take(loop.events),
            //     //         Effect.map((value: unknown) => ({ _tag: "Event" as const, value }))
            //     //     )
            //     // );

            //     // action = yield* loop.Process(value, state);
            // }
            // else
            // {
            //     // const result: Terminal.UserInput = yield* Queue.take(input);
            //     action = yield* loop.Process(input, state);
            // }
            // yield* Console.log("Foo");
            switch (action._tag)
            {
                case "NoOp":
                    continue;
                case "NextFrame":
                {
                    // yield* Effect.orDie(terminal.display(yield* loop.clear(state, action)));
                    state = action.State;
                    yield* pubSub.ActionOptions.Publish(state);
                    continue;
                }
                case "Submit":
                {
                    // yield* Effect.orDie(terminal.display(yield* loop.clear(state, action)));
                    // const msg: string = yield* loop.render(state, action);
                    // yield* Effect.orDie(terminal.display(msg));
                    return action.value;
                }
            }
        }
    });

/* eslint-disable-next-line @typescript-eslint/typedef */
const Action = Data.taggedEnum<ActionDefinition>();

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface ConfirmOptionsReq extends Required<ConfirmOptions> { }

const TRUE_VALUE_REGEXP: RegExp = /^y|t$/;
const FALSE_VALUE_REGEXP: RegExp = /^n|f$/;

const handleConfirmProcess = (_Options: Required<ConfirmOptions>) =>
{
    return ({
        Key
    }: HandlerArgument<Internal.ConfirmState>): Effect.Effect<Action<Internal.ConfirmState, boolean>> =>
    {
        // const value: string = Option.getOrElse(input.input, () => "");
        const value: string = "";
        if (Key.return)
        {
            return Effect.succeed(Action.Submit({ value: true }));
        }
        if (TRUE_VALUE_REGEXP.test(value.toLowerCase()))
        {
            return Effect.succeed(Action.Submit({ value: true }));
        }
        if (FALSE_VALUE_REGEXP.test(value.toLowerCase()))
        {
            return Effect.succeed(Action.Submit({ value: false }));
        }
        return Effect.succeed(Action.NoOp());
    };
};

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
interface DateOptionsReq extends Required<DateOptions> { }

const defaultLocales: DateOptionsReq["locales"] =
    {
        months:
        [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        monthsShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
        weekdays: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
        weekdaysShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
    };

const handleDateProcess = (_options: Required<DateOptions>) =>
{
    return (_Input: HandlerArgument<Internal.DateState>): Effect.Effect<Action<Internal.DateState, Date>> =>
    {
        return Effect.succeed(Action.Submit({ value: new Date() }));
        // switch (input.key.name)
        // {
        //     case "left":
        //     {
        //         return Effect.succeed(processDateCursorLeft(state));
        //     }
        //     case "right":
        //     {
        //         return Effect.succeed(processDateCursorRight(state));
        //     }
        //     case "k":
        //     case "up":
        //     {
        //         return Effect.succeed(processUp(state));
        //     }
        //     case "j":
        //     case "down":
        //     {
        //         return Effect.succeed(processDown(state));
        //     }
        //     case "tab":
        //     {
        //         return Effect.succeed(processDateNext(state));
        //     }
        //     case "enter":
        //     case "return": {
        //         return Effect.match(options.validate(state.value), {
        //             onFailure: (error: string) =>
        //                 Action.NextFrame({
        //                     State:
        //                     {
        //                         ...state,
        //                         error: Option.some(error)
        //                     }
        //                 }),
        //             onSuccess: (value: Date) => Action.Submit({ value: value })
        //         });
        //     }
        //     default:
        //     {
        //         return Effect.succeed(defaultDateProcessor(
        //             Option.getOrElse(input.input, () => ""), state)
        //         );
        //     }
        // }
    };
};

const DATE_PART_REGEXP: RegExp =
    /* eslint-disable-next-line @stylistic/max-len */
    /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;

const regExpGroups: Record<number, (params: Internal.DatePartParams) => Internal.DatePart> =
    {
        1: ({ token, ...opts }: Internal.DatePartParams) =>
            new Internal.Token({ token: token.replace(/\\(.)/g, "$1"), ...opts }),
        2: (opts: Internal.DatePartParams) => new Day(opts),
        3: (opts: Internal.DatePartParams) => new Month(opts),
        4: (opts: Internal.DatePartParams) => new Year(opts),
        5: (opts: Internal.DatePartParams) => new Meridiem(opts),
        6: (opts: Internal.DatePartParams) => new Hours(opts),
        7: (opts: Internal.DatePartParams) => new Minutes(opts),
        8: (opts: Internal.DatePartParams) => new Seconds(opts),
        9: (opts: Internal.DatePartParams) => new Milliseconds(opts)
    };

const makeDateParts = (
    dateMask: string,
    date: globalThis.Date,
    locales: DateOptions["locales"]
) =>
{
    const parts: Array<Internal.DatePart> = [ ];
    let result: RegExpExecArray | null = null;
    /* eslint-disable-next-line no-cond-assign */
    while (result = DATE_PART_REGEXP.exec(dateMask))
    {
        const match: string | undefined = result.shift();
        const index: number = result.findIndex((group: string) => group !== undefined);
        if (index in regExpGroups)
        {
            const token: string = (result[index] || match)!;
            parts.push(regExpGroups[index]({ date, locales, parts, token }));
        }
        else
        {
            parts.push(new Internal.Token({ date, locales, parts, token: (result[index] || match)! }));
        }
    }
    const orderedParts: Array<Internal.DatePart> = parts.reduce((
        array: Array<Internal.DatePart>,
        element: Internal.DatePart
    ) =>
    {
        const lastElement: Internal.DatePart = array[array.length - 1];
        if (element.isToken() && lastElement !== undefined && lastElement.isToken())
        {
            lastElement.setValue(element.token);
        }
        else
        {
            array.push(element);
        }
        return array;
    }, Arr.empty<Internal.DatePart>());

    parts.splice(0, parts.length, ...orderedParts);

    return parts;
};

class Milliseconds extends Internal.DatePart
{
    increment(): void
    {
        this.date.setMilliseconds(this.date.getMilliseconds() + 1);
    }

    decrement(): void
    {
        this.date.setMilliseconds(this.date.getMilliseconds() - 1);
    }

    setValue(value: string): void
    {
        this.date.setMilliseconds(Number.parseInt(value.slice(-this.token.length)));
    }

    override toString()
    {
        const millis: string = `${ this.date.getMilliseconds() }`;
        return millis.padStart(4, "0").substring(0, this.token.length);
    }
}

class Seconds extends Internal.DatePart
{
    increment(): void
    {
        this.date.setSeconds(this.date.getSeconds() + 1);
    }

    decrement(): void
    {
        this.date.setSeconds(this.date.getSeconds() - 1);
    }

    setValue(value: string): void
    {
        this.date.setSeconds(Number.parseInt(value.slice(-2)));
    }

    override toString()
    {
        const seconds: string = `${ this.date.getSeconds() }`;
        return this.token.length > 1
            ? seconds.padStart(2, "0")
            : seconds;
    }
}

class Minutes extends Internal.DatePart
{
    increment(): void
    {
        this.date.setMinutes(this.date.getMinutes() + 1);
    }

    decrement(): void
    {
        this.date.setMinutes(this.date.getMinutes() - 1);
    }

    setValue(value: string): void
    {
        this.date.setMinutes(Number.parseInt(value.slice(-2)));
    }

    override toString()
    {
        const minutes: string = `${ this.date.getMinutes() }`;
        return this.token.length > 1
            ? minutes.padStart(2, "0") :
            minutes;
    }
}

class Hours extends Internal.DatePart
{
    increment(): void
    {
        this.date.setHours(this.date.getHours() + 1);
    }

    decrement(): void
    {
        this.date.setHours(this.date.getHours() - 1);
    }

    setValue(value: string): void
    {
        this.date.setHours(Number.parseInt(value.slice(-2)));
    }

    override toString()
    {
        const hours: number = /h/.test(this.token)
            ? this.date.getHours() % 12 || 12
            : this.date.getHours();

        return this.token.length > 1
            ? `${ hours }`.padStart(2, "0")
            : `${ hours }`;
    }
}

class Day extends Internal.DatePart
{
    increment(): void
    {
        this.date.setDate(this.date.getDate() + 1);
    }

    decrement(): void
    {
        this.date.setDate(this.date.getDate() - 1);
    }

    setValue(value: string): void
    {
        this.date.setDate(Number.parseInt(value.slice(-2)));
    }

    override toString()
    {
        const date: number = this.date.getDate();
        const day: number = this.date.getDay();
        switch (this.token)
        {
            case "DD":
                return `${ date }`.padStart(2, "0");
            case "Do":
                return `${ date }${ this.ordinalIndicator(date) }`;
            case "d":
                return `${ day + 1 }`;
            case "ddd":
                return this.locales!.weekdaysShort[day]!;
            case "dddd":
                return this.locales!.weekdays[day]!;
            default:
                return `${ date }`;
        }
    }

    private ordinalIndicator(day: number): string
    {
        switch (day % 10)
        {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    }
}

class Month extends Internal.DatePart
{
    increment(): void
    {
        this.date.setMonth(this.date.getMonth() + 1);
    }

    decrement(): void
    {
        this.date.setMonth(this.date.getMonth() - 1);
    }

    setValue(value: string): void
    {
        const month: number = Number.parseInt(value.slice(-2)) - 1;
        this.date.setMonth(month < 0 ? 0 : month);
    }

    override toString()
    {
        const month: number = this.date.getMonth();
        switch (this.token.length)
        {
            case 2:
                return `${ month + 1 }`.padStart(2, "0");
            case 3:
                return this.locales!.monthsShort[month]!;
            case 4:
                return this.locales!.months[month]!;
            default:
                return `${ month + 1 }`;
        }
    }
}

class Year extends Internal.DatePart
{
    increment(): void
    {
        this.date.setFullYear(this.date.getFullYear() + 1);
    }

    decrement(): void
    {
        this.date.setFullYear(this.date.getFullYear() - 1);
    }

    setValue(value: string): void
    {
        this.date.setFullYear(Number.parseInt(value.slice(-4)));
    }

    override toString()
    {
        const year: string = `${ this.date.getFullYear() }`.padStart(4, "0");
        return this.token.length === 2
            ? year.substring(-2)
            : year;
    }
}

class Meridiem extends Internal.DatePart
{
    increment(): void
    {
        this.date.setHours((this.date.getHours() + 12) % 24);
    }

    decrement(): void
    {
        this.increment();
    }

    setValue(_value: string): void { }

    override toString()
    {
        const meridiem: string = this.date.getHours() > 12 ? "pm" : "am";
        return /A/.test(this.token)
            ? meridiem.toUpperCase()
            : meridiem;
    }
}

// const CONFIRM_MESSAGE: string =
//     "The selected directory contains files. Would you like to traverse the selected directory?";
// const FILE_FILTER_LABEL: string = "filter";
// const FILE_FILTER_PLACEHOLDER: string = "type to filter";
// const FILE_EMPTY_MESSAGE: string = "No matches";

// const showConfirmation: (u: unknown) => u is { readonly _tag: "Show"; } = Internal.Confirm.$is("Show");

const resolveCurrentPath = (
    path: Option.Option<string>,
    options: Internal.FileOptionsInternal
): Effect.Effect<string, never, FileSystem.FileSystem> =>
{
    if (Option.isSome(path))
    {
        return Effect.succeed(path.value);
    }
    if (Option.isSome(options.StartingPath))
    {
        const startingPath: string = options.StartingPath.value;
        return Effect.flatMap(FileSystem.FileSystem, (fs: FileSystem.FileSystem) =>
        // Ensure the user provided starting path exists
            pipe(
                Effect.orDie(fs.exists(startingPath)),
                Effect.flatMap((exists: boolean) =>
                    exists ? Effect.void : Effect.die(
                        `The provided starting path '${ startingPath }' does not exist`
                    )
                ),
                Effect.as(startingPath)
            ));
    }
    return Effect.sync(() => process.cwd());
};

const getFileList: {
    (directory: string,
        options: Internal.FileOptionsInternal): Effect.Effect<Array<string>, never, Environment>;
} = Effect.fnUntraced(function*(directory: string, options: Internal.FileOptionsInternal)
{
    const fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
    const path: Path.Path = yield* Path.Path;
    const files: Array<string> = yield* pipe(
        Effect.orDie(fs.readDirectory(directory)),
        // Always prepend the `".."` option to the file list but allow it
        // to be filtered out if the user so desires
        Effect.map((files: Array<string>) => [ "..", ...files ])
    );
    return yield* Effect.filter(files, (file: string) =>
    {
        const result: boolean | Effect.Effect<boolean, never, Environment> = options.filter(file);
        const userDefinedFilter: Effect.Effect<boolean, never, Environment> = Effect.isEffect(result)
            ? result
            : Effect.succeed(result);
        const directoryFilter: Effect.Effect<boolean, never, never> = options.type === "directory"
            ? Effect.map(
                Effect.orDie(fs.stat(path.join(directory, file))),
                (info: FileSystem.File.Info) => info.type === "Directory"
            )
            : Effect.succeed(true);
        return Effect.zipWith(userDefinedFilter, directoryFilter, (a: boolean, b: boolean) => a && b);
    }, { concurrency: files.length });
});

const handleFileProcess = (_Options: Required<Internal.FileOptionsInternal>) =>
{
    /* eslint-disable-next-line no-empty-pattern */
    return Effect.fnUntraced(function*({ }: HandlerArgument<Internal.FileState>)
    {
        return Action.NoOp();
        // if (input.key.ctrl)
        // {
        //     if (input.key.name === "u")
        //     {
        //         if (showConfirmation(state.confirm))
        //         {
        //             return Action.NoOp();
        //         }
        //         return yield* processFileClear(state);
        //     }
        //     return Action.NoOp();
        // }
        // switch (input.key.name)
        // {
        //     case "k":
        //     case "up":
        //     {
        //         return yield* processFileCursorUp(state);
        //     }
        //     case "j":
        //     case "down":
        //     case "tab":
        //     {
        //         return yield* processFileCursorDown(state);
        //     }
        //     case "backspace":
        //     {
        //         if (showConfirmation(state.confirm))
        //         {
        //             return Action.NoOp();
        //         }
        //         return yield* processFileBackspace(state);
        //     }
        //     case "enter":
        //     case "return":
        //     {
        //         return yield* processSelection(state, options);
        //     }
        //     case "y":
        //     case "t":
        //     {
        //         if (showConfirmation(state.confirm))
        //         {
        //             const path: Path.Path = yield* Path.Path;
        //             const currentPath: string = yield* resolveCurrentPath(state.path, options);
        //             const selectedPath: string = state.files[state.cursor];
        //             const resolvedPath: string = path.resolve(currentPath, selectedPath);
        //             const files: Array<string> = yield* getFileList(resolvedPath, options);
        //             return Action.NextFrame({
        //                 State:
        //                 {
        //                     allFiles: files,
        //                     confirm: Internal.Confirm.Hide(),
        //                     cursor: 0,
        //                     files,
        //                     path: Option.some(resolvedPath),
        //                     query: ""
        //                 }
        //             });
        //         }
        //         return yield* processFileInput(Option.getOrElse(input.input, () => ""), state);
        //     }
        //     case "n":
        //     case "f":
        //     {
        //         if (showConfirmation(state.confirm))
        //         {
        //             const path: Path.Path = yield* Path.Path;
        //             const currentPath: string = yield* resolveCurrentPath(state.path, options);
        //             const selectedPath: string = state.files[state.cursor];
        //             const resolvedPath: string = path.resolve(currentPath, selectedPath);
        //             return Action.Submit({ value: resolvedPath });
        //         }
        //         return yield* processFileInput(Option.getOrElse(input.input, () => ""), state);
        //     }
        //     default:
        //     {
        //         if (showConfirmation(state.confirm))
        //         {
        //             return Action.NoOp();
        //         }
        //         return yield* processFileInput(Option.getOrElse(input.input, () => ""), state);
        //     }
        // }
    });
};

const handleMultiSelectProcess = <A>(_Options: Required<Internal.MultiSelectOptionsInternal<A>>) =>
{
    /* eslint-disable-next-line no-empty-pattern */
    return ({ }: HandlerArgument<Internal.MultiSelectState>) =>
    {
        return Effect.succeed(Action.NoOp());
        // const totalChoices: number = options.choices.length + metaOptionsCount;
        // switch (input.key.name)
        // {
        //     case "k":
        //     case "up":
        //     {
        //         return processMultiSelectCursorUp({ ...state, error: Option.none() }, totalChoices);
        //     }
        //     case "j":
        //     case "down":
        //     case "tab":
        //     {
        //         return processMultiSelectCursorDown({ ...state, error: Option.none() }, totalChoices);
        //     }
        //     case "space":
        //     {
        //         return processSpace(state, options);
        //     }
        //     case "enter":
        //     case "return":
        //     {
        //         const selectedCount: number = state.selectedIndices.size;
        //         if (options.min !== undefined && selectedCount < options.min)
        //         {
        //             return Effect.succeed(
        //                 Action.NextFrame({
        //                     State:
        //                     {
        //                         ...state,
        //                         error: Option.some(`At least ${ options.min } are required`)
        //                     }
        //                 })
        //             );
        //         }
        //         if (options.max !== undefined && selectedCount > options.max)
        //         {
        //             return Effect.succeed(
        //                 Action.NextFrame({
        //                     State:
        //                     {
        //                         ...state,
        //                         error: Option.some(`At most ${ options.max } choices are allowed`)
        //                     }
        //                 })
        //             );
        //         }
        //         const selectedValues: Array<A> = Array.from(state.selectedIndices)
        //             .sort(EffectNumber.Order)
        //             .map((index: number) =>
        //                 options.choices[index].value
        //             );
        //         return Effect.succeed(Action.Submit({ value: selectedValues }));
        //     }
        //     default:
        //     {
        //         return Effect.succeed(Action.NoOp());
        //     }
        // }
    };
};

const handleProcessInteger = (_Options: Required<IntegerOptions>) =>
{
    /* eslint-disable-next-line no-empty-pattern */
    return ({ }: HandlerArgument<Internal.NumberState>) =>
    {
        return Effect.succeed(Action.NoOp());
        // if (input.key.ctrl && input.key.name === "u")
        // {
        //     return processNumberClear(state);
        // }
        // switch (input.key.name)
        // {
        //     case "backspace":
        //     {
        //         return processNumberBackspace(state);
        //     }
        //     case "k":
        //     case "up":
        //     {
        //         return Effect.succeed(Action.NextFrame({
        //             State:
        //             {
        //                 ...state,
        //                 error: Option.none(),
        //                 value: state.value === "" || state.value === "-"
        //                     ? `${options.IncrementBy}`
        //                     : `${Number.parseInt(state.value) + options.IncrementBy}`
        //             }
        //         }));
        //     }
        //     case "j":
        //     case "down":
        //     {
        //         return Effect.succeed(Action.NextFrame({
        //             State:
        //             {
        //                 ...state,
        //                 error: Option.none(),
        //                 value: state.value === "" || state.value === "-"
        //                     ? `-${ options.DecrementBy }`
        //                     : `${ Number.parseInt(state.value) - options.DecrementBy }`
        //             }
        //         }));
        //     }
        //     case "enter":
        //     case "return":
        //     {
        //         const parsed: number = Number.parseInt(state.value);
        //         if (Number.isNaN(parsed))
        //         {
        //             return Effect.succeed(Action.NextFrame({
        //                 State:
        //                 {
        //                     ...state,
        //                     error: Option.some("Must provide an integer value")
        //                 }
        //             }));
        //         }
        //         else
        //         {
        //             return Effect.match(options.Validate(parsed), {
        //                 onFailure: (error: string) =>
        //                     Action.NextFrame({
        //                         State:
        //                         {
        //                             ...state,
        //                             error: Option.some(error)
        //                         }
        //                     }),
        //                 onSuccess: (value: number) => Action.Submit({ value: value })
        //             });
        //         }
        //     }
        //     default:
        //     {
        //         return defaultIntProcessor(Option.getOrElse(input.input, () => ""), state);
        //     }
        // }
    };
};

const handleProcessFloat = (_Options: Required<FloatOptions>) =>
{
    /* eslint-disable-next-line no-empty-pattern */
    return ({ }: HandlerArgument<Internal.NumberState>) =>
    {
        return Effect.succeed(Action.NoOp());
        // if (input.key.ctrl && input.key.name === "u")
        // {
        //     return processNumberClear(state);
        // }
        // switch (input.key.name)
        // {
        //     case "backspace":
        //     {
        //         return processNumberBackspace(state);
        //     }
        //     case "k":
        //     case "up":
        //     {
        //         return Effect.succeed(Action.NextFrame({
        //             State:
        //             {
        //                 ...state,
        //                 error: Option.none(),
        //                 value: state.value === "" || state.value === "-"
        //                     ? `${ options.IncrementBy }`
        //                     : `${ Number.parseFloat(state.value) + options.IncrementBy }`
        //             }
        //         }));
        //     }
        //     case "j":
        //     case "down":
        //     {
        //         return Effect.succeed(Action.NextFrame({
        //             State:
        //             {
        //                 ...state,
        //                 error: Option.none(),
        //                 value: state.value === "" || state.value === "-"
        //                     ? `-${ options.DecrementBy }`
        //                     : `${ Number.parseFloat(state.value) - options.DecrementBy }`
        //             }
        //         }));
        //     }
        //     case "enter":
        //     case "return":
        //     {
        //         const parsed: number = Number.parseFloat(state.value);
        //         if (Number.isNaN(parsed))
        //         {
        //             return Effect.succeed(Action.NextFrame({
        //                 State:
        //                 {
        //                     ...state,
        //                     error: Option.some("Must provide a floating point value")
        //                 }
        //             }));
        //         }
        //         else
        //         {
        //             return Effect.flatMap(
        //                 Effect.sync(() => EffectNumber.round(parsed, options.Precision)),
        //                 (rounded: number) =>
        //                     Effect.match(options.Validate(rounded), {
        //                         onFailure: (error: string) =>
        //                             Action.NextFrame({
        //                                 State:
        //                                 {
        //                                     ...state,
        //                                     error: Option.some(error)
        //                                 }
        //                             }),
        //                         onSuccess: (value: number) => Action.Submit({ value: value })
        //                     })
        //             );
        //         }
        //     }
        //     default:
        //     {
        //         return defaultFloatProcessor(Option.getOrElse(input.input, () => ""), state);
        //     }
        // }
    };
};

/* eslint-disable @typescript-eslint/no-empty-object-type */

interface SelectOptionsReq<A> extends Required<SelectOptions<A>> { }
interface AutoCompleteOptionsReq<A> extends Required<AutoCompleteOptions<A>> { }

/* eslint-enable @typescript-eslint/no-empty-object-type */

const filterAutoCompleteChoices = <A>(choices: ReadonlyArray<SelectChoice<A>>, query: string) =>
{
    const normalizedQuery: string = query.toLowerCase();
    const indices: Array<number> = [ ];
    for (let i: number = 0; i < choices.length; i++)
    {
        if (choices[i].title.toLowerCase().includes(normalizedQuery))
        {
            indices.push(i);
        }
    }

    return indices;
};

const handleSelectProcess = <A>(_Options: Required<SelectOptions<A>>) =>
{
    /* eslint-disable-next-line no-empty-pattern */
    return ({ }: HandlerArgument<Internal.SelectState>) =>
    {
        return Effect.succeed(Action.NoOp());
        // switch (input.key.name)
        // {
        //     case "k":
        //     case "up":
        //     {
        //         return processSelectCursorUp(state, options.choices);
        //     }
        //     case "j":
        //     case "down":
        //     {
        //         return processSelectCursorDown(state, options.choices);
        //     }
        //     case "tab":
        //     {
        //         return processSelectNext(state, options.choices);
        //     }
        //     case "enter":
        //     case "return":
        //     {
        //         const selected: SelectChoice<A> = options.choices[state];
        //         if (selected.disabled)
        //         {
        //             return Effect.succeed(Action.NoOp());
        //         }
        //         return Effect.succeed(Action.Submit({ value: selected.value }));
        //     }
        //     default:
        //     {
        //         return Effect.succeed(Action.NoOp());
        //     }
        // }
    };
};

const handleAutoCompleteProcess = <A>(_Options: Required<AutoCompleteOptionsReq<A>>) =>
{
    /* eslint-disable-next-line no-empty-pattern */
    return ({ }: HandlerArgument<Internal.AutoCompleteState>) =>
    {
        return Effect.succeed(Action.NoOp());
        // if (input.key.ctrl)
        // {
        //     if (input.key.name === "u")
        //     {
        //         return processAutoCompleteClear(state, options);
        //     }
        //     return Effect.succeed(Action.NoOp());
        // }
        // switch (input.key.name)
        // {
        //     case "k":
        //     case "up":
        //     {
        //         return processAutoCompleteCursorUp(state);
        //     }
        //     case "j":
        //     case "down":
        //     {
        //         return processAutoCompleteCursorDown(state);
        //     }
        //     case "tab":
        //     {
        //         return processAutoCompleteNext(state);
        //     }
        //     case "backspace":
        //     {
        //         return processAutoCompleteBackspace(state, options);
        //     }
        //     case "enter":
        //     case "return":
        //     {
        //         if (state.filtered.length === 0)
        //         {
        //             return Effect.succeed(Action.NoOp());
        //         }
        //         const selected: SelectChoice<A> = options.choices[state.index];
        //         if (selected.disabled)
        //         {
        //             return Effect.succeed(Action.NoOp());
        //         }
        //         return Effect.succeed(Action.Submit({ value: selected.value }));
        //     }
        //     default:
        //     {
        //         return processAutoCompleteInput(Option.getOrElse(input.input, () => ""), state, options);
        //     }
        // }
    };
};

const processTextBackspace = (state: Internal.TextState) =>
{
    if (state.cursor <= 0)
    {
        return Effect.succeed(Action.NoOp());
    }
    const beforeCursor: string = state.value.slice(0, state.cursor - 1);
    const afterCursor: string = state.value.slice(state.cursor);
    const cursor: number = state.cursor - 1;
    const value: string = `${ beforeCursor }${ afterCursor }`;
    return Effect.succeed(
        Action.NextFrame({
            State:
            {
                ...state,
                cursor,
                error: Option.none(),
                value
            }
        })
    );
};

const processTextClear = (state: Internal.TextState) =>
    Effect.succeed(
        Action.NextFrame({
            State:
            {
                ...state,
                cursor: 0,
                error: Option.none(),
                value: ""
            }
        })
    );

const processTextCursorLeft = (state: Internal.TextState) =>
{
    if (state.cursor <= 0)
    {
        return Effect.succeed(Action.NoOp());
    }
    const cursor: number = state.cursor - 1;
    return Effect.succeed(
        Action.NextFrame({
            State:
            {
                ...state,
                cursor,
                error: Option.none()
            }
        })
    );
};

const processTextCursorRight = (state: Internal.TextState) =>
{
    if (state.cursor >= state.value.length)
    {
        return Effect.succeed(Action.NoOp());
    }
    const cursor: number = Math.min(state.cursor + 1, state.value.length);
    return Effect.succeed(
        Action.NextFrame({
            State:
            {
                ...state,
                cursor,
                error: Option.none()
            }
        })
    );
};

const processTextCursorStart = (state: Internal.TextState) =>
    Effect.succeed(
        Action.NextFrame({
            State:
            {
                ...state,
                cursor: 0,
                error: Option.none()
            }
        })
    );

const processTextCursorEnd = (state: Internal.TextState) =>
    Effect.succeed(
        Action.NextFrame({
            State:
            {
                ...state,
                cursor: state.value.length,
                error: Option.none()
            }
        })
    );

const processTab = (state: Internal.TextState, options: Required<Internal.TextOptionsInternal>) =>
{
    if (state.value === options.Default)
    {
        return Effect.succeed(Action.NoOp());
    }
    const value: string = state.value.length === 0 ? options.Default : state.value;
    return Effect.succeed(
        Action.NextFrame({
            State:
            {
                ...state,
                cursor: value.length,
                error: Option.none(),
                value
            }
        })
    );
};

const defaultTextProcessor = (input: Option.Option<string>, _key: Key, state: Internal.TextState) =>
{
    const beforeCursor: string = state.value.slice(0, state.cursor);
    const afterCursor: string = state.value.slice(state.cursor);
    const value: string = `${ beforeCursor }${ input.valueOrUndefined }${ afterCursor }`;
    const cursor: number = state.cursor + (Option.isSome(input) ? input.value.length : 0);
    return Effect.succeed(
        Action.NextFrame({
            State:
            {
                ...state,
                cursor,
                error: Option.none(),
                value
            }
        })
    );
};

const handleTextProcess = (options: Required<Internal.TextOptionsInternal>) =>
{
    return ({ Input: input, Key: key, State: state }: HandlerArgument<Internal.TextState>) =>
    {
        if (key.ctrl && Option.isSome(input))
        {
            switch (input.value)
            {
                case "u":
                {
                    return processTextClear(state);
                }
                case "a":
                {
                    return processTextCursorStart(state);
                }
                case "e":
                {
                    return processTextCursorEnd(state);
                }
                default:
                {
                    return Effect.succeed(Action.NoOp());
                }
            }
        }

        if (key.backspace)
        {
            return processTextBackspace(state);
        }
        else if (key.leftArrow)
        {
            return processTextCursorLeft(state);
        }
        else if (key.rightArrow)
        {
            return processTextCursorRight(state);
        }
        else if (key.home)
        {
            return processTextCursorStart(state);
        }
        else if (key.end)
        {
            return processTextCursorEnd(state);
        }
        else if (key.return)
        {
            const value: string = state.value;
            return Effect.match(options.Validate(value), {
                onFailure: (error: string) =>
                    Action.NextFrame({
                        State:
                        {
                            ...state,
                            error: Option.some(error),
                            value
                        }
                    }),
                onSuccess: (value: string) => Action.Submit({ value: value })
            });
        }
        else if (key.tab)
        {
            return processTab(state, options);
        }
        else
        {
            return defaultTextProcessor(input, key, state);
        }
    };
};

// const handleTextClear = (options: TextOptionsReq) =>
// {
//     return (state: Internal.TextState, _: Action<Internal.TextState, string>) =>
//     {
//         return renderClearScreen(state, options);
//     };
// };

const basePrompt = (
    options: TextOptions,
    type: Internal.TextOptionsInternal["type"]
): Prompt<string> =>
{
    const opts: Required<Internal.TextOptionsInternal> =
        {
            Default: "",
            Plain: false,
            Validate: Effect.succeed,
            type,
            ...options
        };

    const initialState: Internal.TextState =
        {
            cursor: opts.Default.length,
            error: Option.none(),
            value: opts.Default
        };

    return custom(
        initialState,
        opts,
        {
            // _tag: type,

            Component: Component.Text,
            Process: handleTextProcess
        }
    );
};

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
interface ToggleOptionsReq extends Required<ToggleOptions> { }

const handleToggleProcess = (_Options: Required<ToggleOptions>) =>
{
    /* eslint-disable-next-line no-empty-pattern */
    return ({ }: HandlerArgument<Internal.ToggleState>) =>
    {
        return Effect.succeed(Action.NoOp());
        // switch (input.key.name)
        // {
        //     case "0":
        //     case "j":
        //     case "delete":
        //     case "right":
        //     case "down":
        //     {
        //         return deactivate;
        //     }
        //     case "1":
        //     case "k":
        //     case "left":
        //     case "up":
        //     {
        //         return activate;
        //     }
        //     case " ":
        //     case "tab":
        //     {
        //         return state ? deactivate : activate;
        //     }
        //     case "enter":
        //     case "return":
        //     {
        //         return Effect.succeed(Action.Submit({ value: state }));
        //     }
        //     default:
        //     {
        //         return Effect.succeed(Action.NoOp());
        //     }
        // }
    };
};
