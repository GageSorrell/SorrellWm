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
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as EffectNumber from "effect/Number";
import * as Effectable from "effect/Effectable";
import * as FileSystem from "effect/FileSystem";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as Predicate from "effect/Predicate";
import type * as Primitive from "effect/unstable/cli/Primitive";
import * as Queue from "effect/Queue";
import * as Redacted from "effect/Redacted";
import * as Terminal from "effect/Terminal";
import { dual, pipe } from "effect/Function";
import type { Covariant } from "effect/Types";
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
export type Environment = FileSystem.FileSystem | Path.Path | Terminal.Terminal;

/**
 * Represents the action that should be taken by a `Prompt` based upon user
 * input or an external event received during the current frame.
 *
 * @category models
 * @since 1.0.0
 */
export type Action<State, Output> = Data.TaggedEnum<{
    /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
    readonly NoOp: { };
    readonly NextFrame: { readonly State: State; };
    readonly Submit: { readonly value: Output; };
}>;

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
    readonly Input: { readonly input: Terminal.UserInput }
    readonly Event: { readonly value: A }
}>;

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
export interface Handlers<State, Output, Input = Terminal.UserInput>
{
    /**
     * A function that is called to render the current frame of the `Prompt`.
     */
    readonly render: (
        state: State,
        action: Action<State, Output>
    ) => Effect.Effect<string, never, Environment>
    /**
     * A function that is called to process user input and determine the next
     * `Prompt.Action` that should be taken.
     */
    readonly process: (
        input: Input,
        state: State
    ) => Effect.Effect<Action<State, Output>, never, Environment>
    /**
     * A function that is called to clear the terminal screen before rendering
     * the next frame of the `Prompt`.
     */
    readonly clear: (
        state: State,
        action: Action<State, Output>
    ) => Effect.Effect<string, never, Environment>
}

/**
 * Options for a confirmation prompt that asks the user to choose a boolean
 * yes/no value.
 *
 * @category options
 * @since 1.0.0
 */
export interface ConfirmOptions
{
    /**
     * The message to display in the prompt.
     */
    readonly message: string
    /**
     * The initial value of the confirm prompt (defaults to `false`).
     */
    readonly initial?: boolean
    /**
     * The label to display after a user has responded to the prompt.
     */
    readonly label?: {
    /**
     * The label used if the prompt is confirmed (defaults to `"yes"`).
     */
        readonly confirm: string
        /**
         * The label used if the prompt is not confirmed (defaults to `"no"`).
         */
        readonly deny: string
    }
    /**
     * The placeholder to display when a user is responding to the prompt.
     */
    readonly placeholder?: {
    /**
     * The placeholder to use if the `initial` value of the prompt is `true`
     * (defaults to `"(Y/n)"`).
     */
        readonly defaultConfirm?: string
        /**
         * The placeholder to use if the `initial` value of the prompt is `false`
         * (defaults to `"(y/N)"`).
         */
        readonly defaultDeny?: string
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
export interface IntegerOptions
{
    /**
     * The message to display in the prompt.
     */
    readonly message: string
    /**
     * The default value of the integer prompt.
     */
    readonly default?: number
    /**
     * The minimum value that can be entered by the user (defaults to `-Infinity`).
     */
    readonly min?: number
    /**
     * The maximum value that can be entered by the user (defaults to `Infinity`).
     */
    readonly max?: number
    /**
     * The value that will be used to increment the prompt value when using the
     * up arrow key (defaults to `1`).
     */
    readonly incrementBy?: number
    /**
     * The value that will be used to decrement the prompt value when using the
     * down arrow key (defaults to `1`).
     */
    readonly decrementBy?: number
    /**
     * An effectful function that can be used to validate the value entered into
     * the prompt before final submission.
     */
    readonly validate?: (value: number) => Effect.Effect<number, string>
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
    /**
     * The precision to use for the floating point value (defaults to `2`).
     */
    readonly precision?: number
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
export interface FileOptions
{
    /**
     * The path type that will be selected, defaulting to `"file"`.
     */
    readonly type?: Primitive.PathType
    /**
     * The message to display in the prompt, defaulting to `"Choose a file"`.
     */
    readonly message?: string
    /**
     * Where the user will initially be prompted to select files from, defaulting
     * to the current working directory.
     */
    readonly startingPath?: string
    /**
     * The default path to select when the prompt is first displayed.
     */
    readonly default?: string
    /**
     * The number of choices to display at one time, defaulting to `10`.
     */
    readonly maxPerPage?: number
    /**
     * A predicate or effect that keeps a file in the prompt when it returns
     * `true`, defaulting to returning all files.
     */
    readonly filter?: (file: string) => boolean | Effect.Effect<boolean, never, Environment>
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

/**
 * Options for text-entry prompts, including the displayed message, default
 * text, and effectful validation before submission.
 *
 * @category options
 * @since 1.0.0
 */
export interface TextOptions
{
    /**
     * The message to display in the prompt.
     */
    readonly message: string
    /**
     * The default value of the text option.
     */
    readonly default?: string
    /**
     * An effectful function that can be used to validate the value entered into
     * the prompt before final submission.
     */
    readonly validate?: (value: string) => Effect.Effect<string, string>
}

/**
 * Options for a toggle prompt that lets the user switch between active and
 * inactive boolean states.
 *
 * @category options
 * @since 1.0.0
 */
export interface ToggleOptions
{
    /**
     * The message to display in the prompt.
     */
    readonly message: string
    /**
     * The initial value of the toggle prompt (defaults to `false`).
     */
    readonly initial?: boolean
    /**
     * The text to display when the toggle is in the active state (defaults to
     * `on`).
     */
    readonly active?: string
    /**
     * The text to display when the toggle is in the inactive state (defaults to
     * `off`).
     */
    readonly inactive?: string
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

// const annotateLine = (line: string): string => Ansi.annotate(line, Ansi.bold);
// const annotateErrorLine = (line: string): string =>
//     Ansi.annotate(line, Ansi.combine(Ansi.italicized, Ansi.red));

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
            initial: false,
            ...options,
            label: {
                confirm: "yes",
                deny: "no",
                ...options.label
            },
            placeholder:
            {
                defaultConfirm: "(Y/n)",
                defaultDeny: "(y/N)",
                ...options.placeholder
            }
        };

    const initialState: ConfirmState = { value: opts.initial };
    return custom(initialState, {
        clear: handleConfirmClear(opts),
        process: (input: Terminal.UserInput) => handleConfirmProcess(input, opts.initial),
        render: handleConfirmRender(opts)
    });
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
export const custom: {
    <State, Output>(
        initialState: State | Effect.Effect<State, never, Environment>,
        handlers: Handlers<State, Output>
    ): Prompt<Output>
    <State, Output, A>(
        initialState: State | Effect.Effect<State, never, Environment>,
        events: Queue.Dequeue<A, never>,
        handlers: Handlers<State, Output, ProcessInput<A>>
    ): Prompt<Output>
} = <State, Output, A>(
    initialState: State | Effect.Effect<State, never, Environment>,
    ...args:
    | [handlers: Handlers<State, Output, Terminal.UserInput>]
    | [events: Queue.Dequeue<A, never>, handlers: Handlers<State, Output, ProcessInput<A>>]
): Prompt<Output> =>
{
    const [ events, handlers ] = args.length === 1
        ? [ undefined, args[0] ] as const
        : [ args[0], args[1] ] as const;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const op: any = Object.create(proto);
    op._tag = "Loop";
    op.initialState = initialState;
    op.render = handlers.render;
    op.process = handlers.process;
    op.clear = handlers.clear;
    op.events = events;
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
            locales: {
                ...defaultLocales,
                ...options.locales
            }
        };
    const dateParts: Array<DatePart> = makeDateParts(opts.dateMask, opts.initial, opts.locales);
    const initialCursorPosition: number = dateParts.findIndex((part: DatePart) => !part.isToken());
    const initialState: DateState =
        {
            cursor: initialCursorPosition,
            dateParts,
            error: Option.none(),
            typed: "",
            value: opts.initial
        };
    return custom(initialState, {
        clear: handleDateClear(opts),
        process: handleDateProcess(opts),
        render: handleDateRender(opts)
    });
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
export const file = (options: FileOptions = { }): Prompt<string> =>
{
    const opts: FileOptionsReq =
        {
            default: Option.fromUndefinedOr(options.default),
            filter: options.filter ?? (() => Effect.succeed(true)),
            maxPerPage: options.maxPerPage ?? 10,
            message: options.message ?? "Choose a file",
            startingPath: Option.fromUndefinedOr(options.startingPath),
            type: options.type ?? "file"
        };

    const initialState: Effect.Effect<
        FileState,
        never,
        Environment
    > = Effect.gen(function*()
    {
        const currentPath: string = yield* resolveCurrentPath(Option.none(), opts);
        const path: Path.Path = yield* Path.Path;
        const defaultPath: Option.Option<string> =
            Option.map(opts.default, (DefaultValue: string) => path.resolve(currentPath, DefaultValue));
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
        const confirm: Confirm = Confirm.Hide();
        return {
            allFiles: files,
            confirm,
            cursor,
            files,
            path: Option.map(defaultPath, path.dirname),
            query: ""
        };
    });

    return custom(initialState, {
        clear: handleFileClear(opts),
        process: handleFileProcess(opts),
        render: handleFileRender(opts)
    });
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
    op.prompt = self;
    op.onSuccess = f;
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
    const opts: FloatOptionsReq =
        {
            decrementBy: 1,
            default: 0,
            incrementBy: 1,
            max: Number.POSITIVE_INFINITY,
            min: Number.NEGATIVE_INFINITY,
            precision: 2,
            validate: (n: number) =>
            {
                if (n < opts.min)
                {
                    return Effect.fail(`${n} must be greater than or equal to ${opts.min}`);
                }
                if (n > opts.max)
                {
                    return Effect.fail(`${n} must be less than or equal to ${opts.max}`);
                }
                return Effect.succeed(n);
            },
            ...options
        };
    const initialValue: string = options.default === undefined ? "" : `${ opts.default }`;
    const initialState: NumberState =
        {
            cursor: initialValue.length,
            error: Option.none(),
            value: initialValue
        };
    return custom(initialState, {
        clear: handleNumberClear(opts),
        process: handleProcessFloat(opts),
        render: handleRenderFloat(opts)
    });
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
        basePrompt(options, "hidden"),
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
    const opts: IntegerOptionsReq =
        {
            decrementBy: 1,
            default: 0,
            incrementBy: 1,
            max: Number.POSITIVE_INFINITY,
            min: Number.NEGATIVE_INFINITY,
            validate: (n: number) =>
            {
                if (n < opts.min)
                {
                    return Effect.fail(`${ n } must be greater than or equal to ${ opts.min }`);
                }
                if (n > opts.max)
                {
                    return Effect.fail(`${ n } must be less than or equal to ${ opts.max }`);
                }
                return Effect.succeed(n);
            },
            ...options
        };

    const initialValue: string = options.default === undefined ? "" : `${ opts.default }`;
    const initialState: NumberState =
        {
            cursor: initialValue.length,
            error: Option.none(),
            value: initialValue
        };

    return custom(initialState, {
        clear: handleNumberClear(opts),
        process: handleProcessInteger(opts),
        render: handleRenderInteger(opts)
    });
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
        basePrompt(options, "password"),
        map(Redacted.make)
    );

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
        const terminal: Terminal.Terminal = yield* Terminal.Terminal;
        const input: Queue.Dequeue<Terminal.UserInput, Cause.Done<void>> = yield* terminal.readInput;
        return yield* runWithInput(self, terminal, input);
    },
    Effect.mapError(() => new Terminal.QuitError({ })),
    Effect.scoped
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
    return custom(initialIndex, {
        clear: handleSelectClear(opts),
        process: handleSelectProcess(opts),
        render: handleSelectRender(opts)
    });
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
    const initialState: AutoCompleteState =
        {
            filtered,
            index,
            query: ""
        };
    return custom(initialState, {
        clear: handleAutoCompleteClear(opts),
        process: handleAutoCompleteProcess(opts),
        render: handleAutoCompleteRender(opts)
    });
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
    const opts: SelectOptionsReq<A> & MultiSelectOptionsReq =
        {
            maxPerPage: 10,
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
    const initialState: MultiSelectState =
        {
            error: Option.none(),
            index: 0,
            selectedIndices: initialSelected
        };
    return custom(initialState, {
        clear: handleMultiSelectClear(opts),
        process: handleMultiSelectProcess(opts),
        render: handleMultiSelectRender(opts)
    });
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
): Prompt<string> => basePrompt(options, "text");

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
            active: "on",
            inactive: "off",
            initial: false,
            ...options
        };
    return custom(opts.initial, {
        clear: () => handleToggleClear(opts),
        process: handleToggleProcess,
        render: handleToggleRender(opts)
    });
};

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
        [TypeId]: {
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
        readonly initialState: unknown | Effect.Effect<unknown, never, Environment>
        readonly render: Handlers<unknown, unknown>["render"]
        readonly process: (
            input: unknown,
            state: unknown
        ) => Effect.Effect<Action<unknown, unknown>, never, Environment>
        readonly clear: Handlers<unknown, unknown>["clear"]
        readonly events: Queue.Dequeue<unknown, never> | undefined
    }>
{ }

/** @internal */
export interface OnSuccess extends
    Op<"OnSuccess", {
        readonly prompt: PromptPrimitive
        readonly onSuccess: (value: unknown) => Prompt<unknown>
    }>
{ }

interface Succeed extends
    Op<"Succeed", {
        readonly value: unknown
    }>
{ }

/* eslint-enable @typescript-eslint/no-empty-object-type */

/* eslint-disable @typescript-eslint/no-explicit-any */
const allTupled = <const T extends ArrayLike<Prompt<any>>>(arg: T): Prompt<
    {
        [K in keyof T]: [T[K]] extends [Prompt<infer A>] ? A : never
    }
> =>
{
    if (arg.length === 0)
    {
        return succeed([]) as any;
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

const runWithInput = <Output>(
    prompt: Prompt<Output>,
    terminal: Terminal.Terminal,
    input: Queue.Dequeue<Terminal.UserInput, Cause.Done>
): Effect.Effect<Output, NoSuchElementError, Environment> =>
    Effect.suspend(() =>
    {
        const op: PromptPrimitive = prompt as PromptPrimitive;
        switch (op._tag)
        {
            case "Loop": {
                return runLoop(op, terminal, input);
            }
            case "OnSuccess": {
                return Effect.flatMap(
                    runWithInput(op.prompt, terminal, input),
                    (a: never) => runWithInput(op.onSuccess(a), terminal, input)
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                ) as any;
            }
            case "Succeed": {
                return Effect.succeed(op.value);
            }
        }
    });

const runLoop: {
    (loop: Loop,
        terminal: Terminal.Terminal,
        input: Queue.Dequeue<Terminal.UserInput, Cause.Done<void>>
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ): Effect.Effect<unknown, any, any>;
} = Effect.fnUntraced(
    function*(
        loop: Loop,
        terminal: Terminal.Terminal,
        input: Queue.Dequeue<Terminal.UserInput, Cause.Done>
    )
    {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        let state: any = Effect.isEffect(loop.initialState)
            ? yield* loop.initialState
            : loop.initialState;

        let action: Action<unknown, unknown> = Action.NextFrame({ State: state });
        while (true)
        {
            const msg: string = yield* loop.render(state, action);
            yield* Effect.orDie(terminal.display(msg));
            if (loop.events)
            {
                type InputEffect = Effect.Effect<{
                    _tag: "Input";
                    input: Terminal.UserInput;
                }, Cause.Done<void>, never>;

                const takeInput: InputEffect = pipe(
                    Queue.take(input),
                    Effect.map((input: Terminal.UserInput) => ({ _tag: "Input" as const, input }))
                );
                const result: (
                    | {
                        _tag: "Input";
                        input: Terminal.UserInput;
                    }
                    | {
                        _tag: "Event";
                        value: unknown;
                    }
                ) = yield* Effect.raceFirst(
                    takeInput,
                    pipe(
                        Queue.take(loop.events),
                        Effect.map((value: unknown) => ({ _tag: "Event" as const, value }))
                    )
                );

                action = yield* loop.process(result, state);
            }
            else
            {
                const result: Terminal.UserInput = yield* Queue.take(input);
                action = yield* loop.process(result, state);
            }
            switch (action._tag)
            {
                case "NoOp":
                    continue;
                case "NextFrame": {
                    yield* Effect.orDie(terminal.display(yield* loop.clear(state, action)));
                    state = action.State;
                    continue;
                }
                case "Submit": {
                    yield* Effect.orDie(terminal.display(yield* loop.clear(state, action)));
                    const msg: string = yield* loop.render(state, action);
                    yield* Effect.orDie(terminal.display(msg));
                    return action.value;
                }
            }
        }
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    (effect: Effect.Effect<unknown, any, any>, _: Loop, terminal: Terminal.Terminal) => Effect.ensuring(
        effect,
        Effect.orDie(terminal.display(""))
        // Effect.orDie(terminal.display(Ansi.cursorShow))
    )
    // (effect, _, terminal) => Effect.ensuring(effect, Effect.orDie(terminal.display(Ansi.cursorShow)))
);

/* eslint-disable-next-line @typescript-eslint/typedef */
const Action = Data.taggedEnum<ActionDefinition>();

/**
 * Clears all lines taken up by the specified `text`.
 */
const eraseText = (_text: string, columns: number): string =>
{
    if (columns === 0)
    {
        return "";
        // return Ansi.eraseLine + Ansi.cursorTo(0);
    }
    // let rows: number = 0;
    // const lines: Array<string> = text.split(NEWLINE_REGEXP);
    // for (const line of lines)
    // {
    //     rows += 1 + Math.floor(Math.max(line.length - 1, 0) / columns);
    // }
    return "";
    // return Ansi.eraseLines(rows);
};

// const lines = (prompt: string, columns: number): number =>
// {
//     const lines: Array<string> = prompt.split(NEWLINE_REGEXP);
//     return columns === 0
//         ? lines.length
//         : pipe(
//             Arr.map(lines, (line: string) => Math.ceil(line.length / columns)),
//             Arr.reduce(0, (left: number, right: number) => left + right)
//         );
// };

const clearOutputWithError = (outputText: string, columns: number, errorText?: string): string =>
{
    if (errorText !== undefined && errorText.length > 0)
    {
        return "";
    //     return Ansi.cursorDown(lines(errorText, columns))
    //   + eraseText(`\n${errorText}`, columns)
    //   + eraseText(outputText, columns);
    }

    return eraseText(outputText, columns);
};

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
interface ConfirmOptionsReq extends Required<ConfirmOptions> { }

interface ConfirmState {
    readonly value: boolean
}

const renderNoOp: string = ""; // = Ansi.beep;

const NEWLINE_REGEXP: RegExp = /\r?\n/;

const handleConfirmClear = (options: ConfirmOptionsReq) =>
{
    return Effect.fnUntraced(function*(state: ConfirmState, _: Action<ConfirmState, boolean>)
    {
        const terminal: Terminal.Terminal = yield* Terminal.Terminal;
        const columns: number = yield* terminal.columns;
        const figures: Figures = yield* PlatformFigures;
        const confirmMessage: string = state.value
            ? options.placeholder.defaultConfirm!
            : options.placeholder.defaultDeny!;
        const promptText: string = renderConfirmOutput(
            confirmMessage,
            "?",
            figures.pointerSmall,
            options,
            { plain: true }
        );
        const clearOutput: string = eraseText(promptText, columns);
        const resetCurrentLine: string = ""; // = Ansi.eraseLine + Ansi.cursorLeft;
        return clearOutput + resetCurrentLine;
    });
};

const renderConfirmOutput = (
    confirm: string,
    leadingSymbol: string,
    trailingSymbol: string,
    options: ConfirmOptionsReq,
    renderOptions?: RenderOptions | undefined
) => renderPrompt(confirm, options.message, leadingSymbol, trailingSymbol, renderOptions);

const renderConfirmNextFrame: {
    (state: ConfirmState,
        options: ConfirmOptionsReq
    ): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*(state: ConfirmState, options: ConfirmOptionsReq)
{
    const figures: Figures = yield* PlatformFigures;
    const leadingSymbol: string = "?"; // = Ansi.annotate("?", Ansi.cyanBright);
    const trailingSymbol: string = figures.pointerSmall;
    // = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
    // Marking these explicitly as present with `!` because they always will be
    // and there is really no value in adding a `DeepRequired` type helper just
    // for these internal cases
    const confirmMessage: string = state.value
        ? options.placeholder.defaultConfirm!
        : options.placeholder.defaultDeny!;
    const confirm: string = confirmMessage; // = Ansi.annotate(confirmMessage, Ansi.blackBright);
    const promptMsg: string = renderConfirmOutput(confirm, leadingSymbol, trailingSymbol, options);
    return promptMsg;
    // return Ansi.cursorHide + promptMsg;
});

const renderConfirmSubmission: {
    (value: boolean,
        options: ConfirmOptionsReq): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*(value: boolean, options: ConfirmOptionsReq)
{
    const figures: Figures = yield* PlatformFigures;
    const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
    const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
    const confirmMessage: string = value ? options.label.confirm : options.label.deny;
    const promptMsg: string = renderConfirmOutput(confirmMessage, leadingSymbol, trailingSymbol, options);
    return promptMsg + "\n";
});

const handleConfirmRender = (options: ConfirmOptionsReq) =>
{
    return (_: ConfirmState, action: Action<ConfirmState, boolean>) =>
    {
        return Action.$match(action, {
            NextFrame: ({ State: state }: { State: ConfirmState; }) => renderConfirmNextFrame(state, options),
            NoOp: () => Effect.succeed(renderNoOp),
            Submit: ({ value: value }: { value: boolean; }) => renderConfirmSubmission(value, options)
        });
    };
};

const TRUE_VALUE_REGEXP: RegExp = /^y|t$/;
const FALSE_VALUE_REGEXP: RegExp = /^n|f$/;

const handleConfirmProcess = (input: Terminal.UserInput, defaultValue: boolean) =>
{
    const value: string = Option.getOrElse(input.input, () => "");
    if (input.key.name === "enter" || input.key.name === "return")
    {
        return Effect.succeed(Action.Submit({ value: defaultValue }));
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

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
interface DateOptionsReq extends Required<DateOptions> { }

interface DateState
{
    readonly typed: string
    readonly cursor: number
    readonly value: globalThis.Date
    readonly dateParts: ReadonlyArray<DatePart>
    readonly error: Option.Option<string>
}

const handleDateClear = (options: DateOptionsReq) =>
{
    return Effect.fnUntraced(function*(state: DateState, _: Action<DateState, globalThis.Date>)
    {
        const terminal: Terminal.Terminal = yield* Terminal.Terminal;
        const columns: number = yield* terminal.columns;
        const figures: Figures = yield* PlatformFigures;
        const resetCurrentLine: string = "";// = Ansi.eraseLine + Ansi.cursorLeft;
        const parts: string = Arr.reduce(
            state.dateParts,
            "",
            (doc: string, part: DatePart) => doc + part.toString()
        );
        const promptText: string = renderDateOutput(
            "?",
            figures.pointerSmall,
            parts,
            options,
            { plain: true }
        );
        const errorText: string = Option.isSome(state.error)
            ? Arr.match(state.error.value.split(NEWLINE_REGEXP), {
                onEmpty: () => "",
                onNonEmpty: (errorLines: Arr.NonEmptyReadonlyArray<string>) =>
                    `${ figures.pointerSmall } ${ errorLines.join("\n") }`
            })
            : "";
        const clearOutput: string = clearOutputWithError(promptText, columns, errorText);
        return clearOutput + resetCurrentLine;
    });
};

const renderDateError = (state: DateState, _pointer: string): string =>
{
    if (Option.isSome(state.error))
    {
        const errorLines: Array<string> = state.error.value.split(NEWLINE_REGEXP);
        if (Arr.isReadonlyArrayNonEmpty(errorLines))
        {
            const prefix: string = ""; // = Ansi.annotate(pointer, Ansi.red) + " ";
            const lines: Arr.NonEmptyArray<string> =
                Arr.map(errorLines, (str: string) => str); // annotateErrorLine(str));
            return "\n" + prefix + lines.join("\n");
            // return Ansi.cursorSavePosition + "\n" + prefix + lines.join("\n") + Ansi.cursorRestorePosition;
        }
    }
    return "";
};

const renderParts = (state: DateState, submitted: boolean = false) =>
{
    return Arr.reduce(
        state.dateParts,
        "",
        (doc: string, part: DatePart, currentIndex: number) =>
        {
            const partDoc: string = part.toString();
            if (currentIndex === state.cursor && !submitted)
            {
                // const annotation: string = Ansi.combine(Ansi.underlined, Ansi.cyanBright);
                // return doc + Ansi.annotate(partDoc, annotation);
                return doc;
            }
            return doc + partDoc;
        }
    );
};

const renderDateOutput = (
    leadingSymbol: string,
    trailingSymbol: string,
    parts: string,
    options: DateOptionsReq,
    renderOptions?: RenderOptions | undefined
) => renderPrompt(parts, options.message, leadingSymbol, trailingSymbol, renderOptions);

const renderDateNextFrame: {
    (state: DateState,
        options: DateOptionsReq): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*(state: DateState, options: DateOptionsReq)
{
    const figures: Figures = yield* PlatformFigures;
    const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
    const trailingSymbol: string = figures.pointerSmall;
    // = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
    const parts: string = renderParts(state);
    const promptMsg: string = renderDateOutput(leadingSymbol, trailingSymbol, parts, options);
    const errorMsg: string = renderDateError(state, figures.pointerSmall);
    return promptMsg + errorMsg;
    // return Ansi.cursorHide + promptMsg + errorMsg;
});

const renderDateSubmission: {
    (state: DateState,
        options: DateOptionsReq): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*(state: DateState, options: DateOptionsReq)
{
    const figures: Figures = yield* PlatformFigures;
    const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
    const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
    const parts: string = renderParts(state, true);
    const promptMsg: string = renderDateOutput(leadingSymbol, trailingSymbol, parts, options);
    return promptMsg + "\n";
});

const processUp = (state: DateState) =>
{
    state.dateParts[state.cursor].increment();
    return Action.NextFrame({
        State:
        {
            ...state,
            typed: ""
        }
    });
};

const processDown = (state: DateState) =>
{
    state.dateParts[state.cursor].decrement();
    return Action.NextFrame({
        State:
        {
            ...state,
            typed: ""
        }
    });
};

const processDateCursorLeft = (state: DateState) =>
{
    const previous: Option.Option<DatePart> = state.dateParts[state.cursor].previousPart();
    if (Option.isSome(previous))
    {
        return Action.NextFrame({
            State:
            {
                ...state,
                cursor: state.dateParts.indexOf(previous.value),
                typed: ""
            }
        });
    }

    return Action.NoOp();
};

const processDateCursorRight = (state: DateState) =>
{
    const next: Option.Option<DatePart> = state.dateParts[state.cursor].nextPart();
    if (Option.isSome(next))
    {
        return Action.NextFrame({
            State:
            {
                ...state,
                cursor: state.dateParts.indexOf(next.value),
                typed: ""
            }
        });
    }

    return Action.NoOp();
};

const processDateNext = (state: DateState) =>
{
    const next: Option.Option<DatePart> = state.dateParts[state.cursor].nextPart();
    const cursor: number = Option.match(next, {
        onNone: () => state.dateParts.findIndex((part: DatePart) => !part.isToken()),
        onSome: (next: DatePart) => state.dateParts.indexOf(next)
    });
    return Action.NextFrame({
        State:
        {
            ...state,
            cursor
        }
    });
};

const defaultDateProcessor = (value: string, state: DateState) =>
{
    if (/\d/.test(value))
    {
        const typed: string = state.typed + value;
        state.dateParts[state.cursor].setValue(typed);
        return Action.NextFrame({
            State:
            {
                ...state,
                typed
            }
        });
    }
    return Action.NoOp();
};

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

const handleDateRender = (options: DateOptionsReq) =>
{
    return (state: DateState, action: Action<DateState, globalThis.Date>) =>
    {
        return Action.$match(action, {
            NextFrame: ({ State: state }: { State: DateState }) => renderDateNextFrame(state, options),
            NoOp: () => Effect.succeed(renderNoOp),
            Submit: () => renderDateSubmission(state, options)
        });
    };
};

const handleDateProcess = (options: DateOptionsReq) =>
{
    return (input: Terminal.UserInput, state: DateState) =>
    {
        switch (input.key.name)
        {
            case "left":
            {
                return Effect.succeed(processDateCursorLeft(state));
            }
            case "right":
            {
                return Effect.succeed(processDateCursorRight(state));
            }
            case "k":
            case "up":
            {
                return Effect.succeed(processUp(state));
            }
            case "j":
            case "down":
            {
                return Effect.succeed(processDown(state));
            }
            case "tab":
            {
                return Effect.succeed(processDateNext(state));
            }
            case "enter":
            case "return": {
                return Effect.match(options.validate(state.value), {
                    onFailure: (error: string) =>
                        Action.NextFrame({
                            State:
                            {
                                ...state,
                                error: Option.some(error)
                            }
                        }),
                    onSuccess: (value: Date) => Action.Submit({ value: value })
                });
            }
            default: {
                return Effect.succeed(defaultDateProcessor(Option.getOrElse(input.input, () => ""), state));
            }
        }
    };
};

const DATE_PART_REGEXP: RegExp =
    /* eslint-disable-next-line @stylistic/max-len */
    /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;

const regExpGroups: Record<number, (params: DatePartParams) => DatePart> =
    {
        1: ({ token, ...opts }: DatePartParams) =>
            new Token({ token: token.replace(/\\(.)/g, "$1"), ...opts }),
        2: (opts: DatePartParams) => new Day(opts),
        3: (opts: DatePartParams) => new Month(opts),
        4: (opts: DatePartParams) => new Year(opts),
        5: (opts: DatePartParams) => new Meridiem(opts),
        6: (opts: DatePartParams) => new Hours(opts),
        7: (opts: DatePartParams) => new Minutes(opts),
        8: (opts: DatePartParams) => new Seconds(opts),
        9: (opts: DatePartParams) => new Milliseconds(opts)
    };

const makeDateParts = (
    dateMask: string,
    date: globalThis.Date,
    locales: DateOptions["locales"]
) =>
{
    const parts: Array<DatePart> = [];
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
            parts.push(new Token({ date, locales, parts, token: (result[index] || match)! }));
        }
    }
    const orderedParts: Array<DatePart> = parts.reduce((array: Array<DatePart>, element: DatePart) =>
    {
        const lastElement: DatePart = array[array.length - 1];
        if (element.isToken() && lastElement !== undefined && lastElement.isToken())
        {
            lastElement.setValue(element.token);
        }
        else
        {
            array.push(element);
        }
        return array;
    }, Arr.empty<DatePart>());
    parts.splice(0, parts.length, ...orderedParts);
    return parts;
};

interface DatePartParams {
    readonly token: string
    readonly locales: DateOptions["locales"]
    readonly date?: globalThis.Date
    readonly parts?: ReadonlyArray<DatePart>
}

abstract class DatePart
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

class Token extends DatePart
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

class Milliseconds extends DatePart
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

class Seconds extends DatePart
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

class Minutes extends DatePart
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

class Hours extends DatePart
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

class Day extends DatePart
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

class Month extends DatePart
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

class Year extends DatePart
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

class Meridiem extends DatePart
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

interface FileOptionsReq extends Required<Omit<FileOptions, "startingPath" | "default">>
{
    readonly startingPath: Option.Option<string>
    readonly default: Option.Option<string>
}

interface FileState {
    readonly cursor: number
    readonly files: ReadonlyArray<string>
    readonly allFiles: ReadonlyArray<string>
    readonly query: string
    readonly path: Option.Option<string>
    readonly confirm: Confirm
}

const CONFIRM_MESSAGE: string =
    "The selected directory contains files. Would you like to traverse the selected directory?";
const FILE_FILTER_LABEL: string = "filter";
const FILE_FILTER_PLACEHOLDER: string = "type to filter";
const FILE_EMPTY_MESSAGE: string = "No matches";
type Confirm = Data.TaggedEnum<{
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    readonly Show: { };
    readonly Hide: { };
    /* eslint-enable @typescript-eslint/no-empty-object-type */
}>;

/* eslint-disable-next-line @typescript-eslint/typedef */
const Confirm = Data.taggedEnum<Confirm>();

const showConfirmation: (u: unknown) => u is {
    readonly _tag: "Show";
} = Confirm.$is("Show");

const resolveCurrentPath = (
    path: Option.Option<string>,
    options: FileOptionsReq
): Effect.Effect<string, never, FileSystem.FileSystem> =>
{
    if (Option.isSome(path))
    {
        return Effect.succeed(path.value);
    }
    if (Option.isSome(options.startingPath))
    {
        const startingPath: string = options.startingPath.value;
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
        options: FileOptionsReq): Effect.Effect<Array<string>, never, Environment>;
} = Effect.fnUntraced(function*(directory: string, options: FileOptionsReq)
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

const filterFiles = (files: ReadonlyArray<string>, query: string) =>
{
    if (query.length === 0)
    {
        return files;
    }
    const normalizedQuery: string = query.toLowerCase();
    const filtered: Array<string> = [ ];
    for (let index: number = 0; index < files.length; index++)
    {
        if (files[index].toLowerCase().includes(normalizedQuery))
        {
            filtered.push(files[index]);
        }
    }
    return filtered;
};

const updateFileState = (
    state: FileState,
    query: string,
    allFiles: ReadonlyArray<string> = state.allFiles
): FileState =>
{
    const files: ReadonlyArray<string> = filterFiles(allFiles, query);
    if (files.length === 0)
    {
        return { ...state, allFiles, cursor: 0, files, query };
    }
    const selected: string = state.files[state.cursor];
    const cursor: number = selected === undefined ? 0 : files.indexOf(selected);
    return {
        ...state,
        allFiles,
        cursor: cursor === -1 ? 0 : cursor,
        files,
        query
    };
};

const handleFileClear = (options: FileOptionsReq) =>
{
    return Effect.fnUntraced(function*(state: FileState, _: Action<FileState, string>)
    {
        const terminal: Terminal.Terminal = yield* Terminal.Terminal;
        const columns: number = yield* terminal.columns;
        const path: Path.Path = yield* Path.Path;
        const figures: Figures = yield* PlatformFigures;
        const currentPath: string = yield* resolveCurrentPath(state.path, options);
        const selectedPath: string = state.files[state.cursor];
        const resolvedPath: string = selectedPath === undefined
            ? currentPath
            : path.resolve(currentPath, selectedPath);
        const resolvedPathText: string = `${figures.pointerSmall} ${resolvedPath}`;
        const isConfirming: boolean = showConfirmation(state.confirm);
        const promptText: string = isConfirming
            ? renderPrompt("(Y/n)", CONFIRM_MESSAGE, "?", figures.pointerSmall, { plain: true })
            : renderPrompt(
                renderFileFilter(state, { plain: true }),
                options.message,
                figures.tick,
                figures.ellipsis,
                { plain: true }
            );
        const filesText: string = isConfirming
            ? ""
            : renderFiles(state, state.files, figures, options, { plain: true });
        const outputText: string = isConfirming
            ? `${ promptText }\n${ resolvedPathText }`
            : `${ promptText }\n${ resolvedPathText }\n${ filesText }`;
        const clearOutput: string = eraseText(outputText, columns);
        // const resetCurrentLine: string = Ansi.eraseLine + Ansi.cursorLeft;
        const resetCurrentLine: string = "";
        return clearOutput + resetCurrentLine;
    });
};

type RenderOptions =
    {
        readonly plain?: boolean
    };

const renderPrompt = (
    confirm: string,
    message: string,
    leadingSymbol: string,
    trailingSymbol: string,
    _options?: RenderOptions | undefined
) =>
{
    const prefix: string = leadingSymbol + " ";
    const annotate = (line: string) => line;
    // const annotate: typeof annotateLine = options?.plain === true
    //     ? (line: string) => line
    //     : annotateLine;
    return Arr.match(message.split(NEWLINE_REGEXP), {
        onEmpty: () => prefix + " " + trailingSymbol + " " + confirm,
        onNonEmpty: (promptLines: ReadonlyArray<string>) =>
        {
            const lines: ReadonlyArray<string> = Arr.map(promptLines, (line: string) => annotate(line));
            return prefix + lines.join("\n") + " " + trailingSymbol + " " + confirm;
        }
    });
};

const renderPrefix = (
    state: FileState,
    toDisplay: { readonly startIndex: number; readonly endIndex: number },
    currentIndex: number,
    length: number,
    figures: Effect.Success<typeof PlatformFigures>,
    _renderOptions?: RenderOptions | undefined
) =>
{
    let prefix: string = " ";
    if (currentIndex === toDisplay.startIndex && toDisplay.startIndex > 0)
    {
        prefix = figures.arrowUp;
    }
    else if (currentIndex === toDisplay.endIndex - 1 && toDisplay.endIndex < length)
    {
        prefix = figures.arrowDown;
    }

    if (state.cursor === currentIndex)
    {
        return figures.pointer + prefix;
        // return renderOptions?.plain === true
        //     ? figures.pointer + prefix
        //     : Ansi.annotate(figures.pointer, Ansi.cyanBright) + prefix;
    }

    return prefix + " ";
};

const renderFileName = (file: string, _isSelected: boolean, _renderOptions?: RenderOptions | undefined) =>
{
    return file;
    // if (renderOptions?.plain === true)
    // {
    //     return file;
    // }
    // return isSelected
    //     ? Ansi.annotate(file, Ansi.combine(Ansi.underlined, Ansi.cyanBright))
    //     : file;
};

const renderFileFilter = (state: FileState, _renderOptions?: RenderOptions | undefined) =>
{
    // const filterValue = state.query.length === 0
    //     ? renderOptions?.plain === true
    //         ? FILE_FILTER_PLACEHOLDER
    //         : Ansi.annotate(FILE_FILTER_PLACEHOLDER, Ansi.blackBright)
    //     : renderOptions?.plain === true
    //         ? state.query
    //         : Ansi.annotate(state.query, Ansi.combine(Ansi.underlined, Ansi.cyanBright));
    const filterValue: string = state.query.length === 0
        ? FILE_FILTER_PLACEHOLDER
        : state.query;

    return `[${ FILE_FILTER_LABEL }: ${ filterValue }]`;
};

const renderFiles = (
    state: FileState,
    files: ReadonlyArray<string>,
    figures: Effect.Success<typeof PlatformFigures>,
    options: FileOptionsReq,
    renderOptions?: RenderOptions | undefined
) =>
{
    const length: number = files.length;
    if (length === 0)
    {
        return FILE_EMPTY_MESSAGE;
        // return renderOptions?.plain === true
        //     ? FILE_EMPTY_MESSAGE
        //     : Ansi.annotate(FILE_EMPTY_MESSAGE, Ansi.blackBright);
    }

    const toDisplay: { endIndex: number; startIndex: number; }  =
        entriesToDisplay(state.cursor, length, options.maxPerPage);

    const documents: Array<string> = [ ];

    for (let index: number = toDisplay.startIndex; index < toDisplay.endIndex; index++)
    {
        const isSelected: boolean = state.cursor === index;
        const prefix: string = renderPrefix(state, toDisplay, index, length, figures, renderOptions);
        const fileName: string = renderFileName(files[index], isSelected, renderOptions);
        documents.push(prefix + fileName);
    }

    return documents.join("\n");
};

const renderFileNextFrame: {
    (state: FileState,
        options: FileOptionsReq): Effect.Effect<string, never, FileSystem.FileSystem | Path.Path>;
} = Effect.fnUntraced(function*(state: FileState, options: FileOptionsReq)
{
    const path: Path.Path = yield* Path.Path;
    const figures: Figures = yield* PlatformFigures;
    const currentPath: string = yield* resolveCurrentPath(state.path, options);
    const selectedPath: string = state.files[state.cursor];
    const resolvedPath: string = selectedPath === undefined
        ? currentPath
        : path.resolve(currentPath, selectedPath);
    const resolvedPathMsg: string = figures.pointerSmall + " " + resolvedPath;
    // const resolvedPathMsg: string =
    //     Ansi.annotate(figures.pointerSmall + " " + resolvedPath, Ansi.blackBright);

    if (showConfirmation(state.confirm))
    {
        const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
        const trailingSymbol: string = figures.pointerSmall;
        //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
        const confirm: string = "(Y/n)";// = Ansi.annotate("(Y/n)", Ansi.blackBright);
        const promptMsg: string = renderPrompt(confirm, CONFIRM_MESSAGE, leadingSymbol, trailingSymbol);
        return promptMsg + "\n" + resolvedPathMsg;
        // return Ansi.cursorHide + promptMsg + "\n" + resolvedPathMsg;
    }

    const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
    const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
    const promptMsg: string =
        renderPrompt(renderFileFilter(state), options.message, leadingSymbol, trailingSymbol);
    const files: string = renderFiles(state, state.files, figures, options);
    return promptMsg + "\n" + resolvedPathMsg + "\n" + files;
    // return Ansi.cursorHide + promptMsg + "\n" + resolvedPathMsg + "\n" + files;
});

const renderFileSubmission: {
    (state: FileState,
        value: string,
        options: FileOptionsReq
    ): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*(state: FileState, value: string, options: FileOptionsReq)
{
    const figures: Figures = yield* PlatformFigures;
    const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
    const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
    const promptMsg: string =
        renderPrompt(renderFileFilter(state), options.message, leadingSymbol, trailingSymbol);
    return promptMsg + " " + value + "\n";
    // return promptMsg + " " + Ansi.annotate(value, Ansi.white) + "\n";
});

const handleFileRender = (options: FileOptionsReq) =>
{
    return (
        state: FileState,
        action: Action<FileState, string>
    ): Effect.Effect<string, never, Path.Path | FileSystem.FileSystem> =>
    {
        return Action.$match(action, {
            NextFrame: ({ State: state }: { State: FileState; }) => renderFileNextFrame(state, options),
            NoOp: () => Effect.succeed(renderNoOp),
            Submit: ({ value: value }: { value: string; }) => renderFileSubmission(state, value, options)
        });
    };
};

const processFileCursorUp = (state: FileState) =>
{
    if (state.files.length === 0)
    {
        return Effect.succeed(Action.NoOp());
    }
    const cursor: number = state.cursor - 1;
    return Effect.succeed(Action.NextFrame({
        State:
        {
            ...state,
            cursor: cursor < 0 ? state.files.length - 1 : cursor
        }
    }));
};

const processFileCursorDown = (state: FileState) =>
{
    if (state.files.length === 0)
    {
        return Effect.succeed(Action.NoOp());
    }

    return Effect.succeed(Action.NextFrame({
        State:
        {
            ...state,
            cursor: (state.cursor + 1) % state.files.length
        }
    }));
};

const processFileBackspace = (state: FileState) =>
{
    if (state.query.length === 0)
    {
        return Effect.succeed(Action.NoOp());
    }
    const query: string = state.query.slice(0, state.query.length - 1);
    return Effect.succeed(Action.NextFrame({ State: updateFileState(state, query) }));
};

const processFileClear = (state: FileState) =>
{
    return Effect.succeed(Action.NextFrame({ State: updateFileState(state, "") }));
};

const processFileInput = (input: string, state: FileState) =>
{
    if (input.length === 0)
    {
        return Effect.succeed(Action.NoOp());
    }
    const query: string = state.query + input;
    return Effect.succeed(Action.NextFrame({ State: updateFileState(state, query) }));
};

const processSelection: {
    (state: FileState,
        options: FileOptionsReq): Effect.Effect<Action<FileState, string>, never, Environment>;
} = Effect.fnUntraced(function*(state: FileState, options: FileOptionsReq)
{
    if (state.files.length === 0)
    {
        return Action.NoOp();
    }

    const fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
    const path: Path.Path = yield* Path.Path;
    const currentPath: string = yield* resolveCurrentPath(state.path, options);
    const selectedPath: string = state.files[state.cursor];
    const resolvedPath: string = path.resolve(currentPath, selectedPath);
    const info: FileSystem.File.Info = yield* Effect.orDie(fs.stat(resolvedPath));
    if (info.type === "Directory")
    {
        const files: Array<string> = yield* getFileList(resolvedPath, options);
        const filesWithoutParent: Array<string> = files.filter((file: string) => file !== "..");
        // If the user selected a directory AND the prompt type can result with
        // a directory, we must confirm:
        //  - If the selected directory has any files
        //  - Confirm whether or not the user wants to traverse those files
        if (options.type === "directory" || options.type === "either")
        {
            return filesWithoutParent.length === 0
            // Directory is empty so it's safe to select it
                ? Action.Submit({ value: resolvedPath })
            // Directory has contents - show confirmation to user
                : Action.NextFrame({
                    State:
                    {
                        ...state,
                        confirm: Confirm.Show()
                    }
                });
        }

        return Action.NextFrame({
            State:
            {

                allFiles: files,
                confirm: Confirm.Hide(),
                cursor: 0,
                files,
                path: Option.some(resolvedPath),
                query: ""
            }
        });
    }

    return Action.Submit({ value: resolvedPath });
});

const handleFileProcess = (options: FileOptionsReq) =>
{
    return Effect.fnUntraced(function*(input: Terminal.UserInput, state: FileState)
    {
        if (input.key.ctrl)
        {
            if (input.key.name === "u")
            {
                if (showConfirmation(state.confirm))
                {
                    return Action.NoOp();
                }
                return yield* processFileClear(state);
            }
            return Action.NoOp();
        }
        switch (input.key.name)
        {
            case "k":
            case "up":
            {
                return yield* processFileCursorUp(state);
            }
            case "j":
            case "down":
            case "tab":
            {
                return yield* processFileCursorDown(state);
            }
            case "backspace":
            {
                if (showConfirmation(state.confirm))
                {
                    return Action.NoOp();
                }
                return yield* processFileBackspace(state);
            }
            case "enter":
            case "return":
            {
                return yield* processSelection(state, options);
            }
            case "y":
            case "t":
            {
                if (showConfirmation(state.confirm))
                {
                    const path: Path.Path = yield* Path.Path;
                    const currentPath: string = yield* resolveCurrentPath(state.path, options);
                    const selectedPath: string = state.files[state.cursor];
                    const resolvedPath: string = path.resolve(currentPath, selectedPath);
                    const files: Array<string> = yield* getFileList(resolvedPath, options);
                    return Action.NextFrame({
                        State:
                        {
                            allFiles: files,
                            confirm: Confirm.Hide(),
                            cursor: 0,
                            files,
                            path: Option.some(resolvedPath),
                            query: ""
                        }
                    });
                }
                return yield* processFileInput(Option.getOrElse(input.input, () => ""), state);
            }
            case "n":
            case "f":
            {
                if (showConfirmation(state.confirm))
                {
                    const path: Path.Path = yield* Path.Path;
                    const currentPath: string = yield* resolveCurrentPath(state.path, options);
                    const selectedPath: string = state.files[state.cursor];
                    const resolvedPath: string = path.resolve(currentPath, selectedPath);
                    return Action.Submit({ value: resolvedPath });
                }
                return yield* processFileInput(Option.getOrElse(input.input, () => ""), state);
            }
            default:
            {
                if (showConfirmation(state.confirm))
                {
                    return Action.NoOp();
                }
                return yield* processFileInput(Option.getOrElse(input.input, () => ""), state);
            }
        }
    });
};

/* eslint-disable @typescript-eslint/no-empty-object-type */

interface SelectOptionsReq<A> extends Required<SelectOptions<A>> { }
interface MultiSelectOptionsReq extends MultiSelectOptions { }

/* eslint-enable @typescript-eslint/no-empty-object-type */

type MultiSelectState =
    {
        index: number
        selectedIndices: Set<number>
        error: Option.Option<string>
    };

const renderMultiSelectError = (
    state: MultiSelectState,
    pointer: string,
    renderOptions?: RenderOptions | undefined
): string =>
{
    if (Option.isSome(state.error))
    {
        return Arr.match(state.error.value.split(NEWLINE_REGEXP), {
            onEmpty: () => "",
            onNonEmpty: (errorLines: readonly [ string, ...ReadonlyArray<string> ]) =>
            {
                if (renderOptions?.plain === true)
                {
                    return `${pointer} ${errorLines.join("\n")}`;
                }
                const prefix: string = pointer;
                // const prefix = Ansi.annotate(pointer, Ansi.red) + " ";
                // const lines = Arr.map(errorLines, (str) => annotateErrorLine(str));
                return "\n" + prefix + errorLines.join("\n");
                // return Ansi.cursorSavePosition + "\n" + prefix +
                //     lines.join("\n") + Ansi.cursorRestorePosition;
            }
        });
    }
    return "";
};

const renderChoiceDescription = <A>(
    choice: SelectChoice<A>,
    isActive: boolean,
    _renderOptions?: RenderOptions | undefined
) =>
{
    if (!choice.disabled && choice.description && isActive)
    {
        return "- " + choice.description;
        // return renderOptions?.plain === true
        //     ? "- " + choice.description
        //     : Ansi.annotate("- " + choice.description, Ansi.blackBright);
    }
    return "";
};

const metaOptionsCount: number = 2;

const renderMultiSelectTitle = (
    title: string,
    _isHighlighted: boolean,
    _renderOptions?: RenderOptions | undefined
) =>
{
    return title;
    // if (renderOptions?.plain === true || !isHighlighted)
    // {
    //     return title;
    // }

    // return Ansi.annotate(title, Ansi.combine(Ansi.underlined, Ansi.cyanBright));
};

const renderMultiSelectChoices = <A>(
    state: MultiSelectState,
    options: SelectOptionsReq<A> & MultiSelectOptionsReq,
    figures: Effect.Success<typeof PlatformFigures>,
    renderOptions?: RenderOptions | undefined
) =>
{
    const choices: ReadonlyArray<SelectChoice<A>> = options.choices;
    const totalChoices: number = choices.length;
    const selectedCount: number = state.selectedIndices.size;
    const allSelected: boolean = selectedCount === totalChoices;

    const selectAllText: string = allSelected
        ? options?.selectNone ?? "Select None"
        : options?.selectAll ?? "Select All";

    const inverseSelectionText: string = options?.inverseSelection ?? "Inverse Selection";

    const metaOptions: Array<{ title: string; }> =
        [
            { title: selectAllText },
            { title: inverseSelectionText }
        ];

    const allChoices: Array<SelectChoice<A> | { title: string; }> = [ ...metaOptions, ...choices ];
    const toDisplay: { endIndex: number; startIndex: number; } =
        entriesToDisplay(state.index, allChoices.length, options.maxPerPage);
    const documents: Array<string> = [ ];
    for (let index: number = toDisplay.startIndex; index < toDisplay.endIndex; index++)
    {
        const choice: SelectChoice<A> | { title: string; } = allChoices[index];
        const isHighlighted: boolean = state.index === index;
        let prefix: string = " ";
        if (index === toDisplay.startIndex && toDisplay.startIndex > 0)
        {
            prefix = figures.arrowUp;
        }
        else if (index === toDisplay.endIndex - 1 && toDisplay.endIndex < allChoices.length)
        {
            prefix = figures.arrowDown;
        }
        if (index < metaOptions.length)
        {
            // Meta options
            const title: string = renderMultiSelectTitle(choice.title, isHighlighted, renderOptions);
            documents.push(prefix + " " + title);
        }
        else
        {
            // Regular choices
            const choiceIndex: number = index - metaOptions.length;
            const isSelected: boolean = state.selectedIndices.has(choiceIndex);
            const checkbox: string = isSelected ? figures.checkboxOn : figures.checkboxOff;
            const annotatedCheckbox: string = checkbox;
            // const annotatedCheckbox = isHighlighted && renderOptions?.plain !== true
            //     ? Ansi.annotate(checkbox, Ansi.cyanBright)
            //     : checkbox;
            const title: string = renderMultiSelectTitle(choice.title, isHighlighted, renderOptions);
            const description: string = renderChoiceDescription(
                choice as SelectChoice<A>,
                isHighlighted,
                renderOptions
            );
            documents.push(prefix + " " + annotatedCheckbox + " " + title + " " + description);
        }
    }
    return documents.join("\n");
};

const renderMultiSelectNextFrame: {
    <A>(state: MultiSelectState, options: SelectOptionsReq<A>): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(
    function*<A>(state: MultiSelectState, options: SelectOptionsReq<A>)
    {
        const figures: Figures = yield* PlatformFigures;
        const choices: string = renderMultiSelectChoices(state, options, figures);
        const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
        const trailingSymbol: string = figures.pointerSmall;
        //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
        const promptMsg: string = renderSelectOutput(leadingSymbol, trailingSymbol, options);
        const error: string = renderMultiSelectError(state, figures.pointer);
        return promptMsg + "\n" + choices + error;
        // return Ansi.cursorHide + promptMsg + "\n" + choices + error;
    }
);

const renderMultiSelectSubmission: {
    <A>(state: MultiSelectState, options: SelectOptionsReq<A>): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(
    function*<A>(state: MultiSelectState, options: SelectOptionsReq<A>)
    {
        const figures: Figures = yield* PlatformFigures;
        const selectedChoices: Array<string> =
            Array.from(state.selectedIndices).sort(EffectNumber.Order).map((index: number) =>
                options.choices[index].title
            );
        const selectedText: string = selectedChoices.join(", ");
        const leadingSymbol: string = figures.tick;
        const trailingSymbol: string = figures.ellipsis;
        // const leadingSymbol: string = Ansi.annotate(figures.tick, Ansi.green);
        // const trailingSymbol: string = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
        const promptMsg: string = renderSelectOutput(leadingSymbol, trailingSymbol, options);
        return promptMsg + " " + selectedText;
        // return promptMsg + " " + Ansi.annotate(selectedText, Ansi.white) + "\n";
    }
);

const processMultiSelectCursorUp = (state: MultiSelectState, totalChoices: number) =>
{
    const newIndex: number = state.index === 0 ? totalChoices - 1 : state.index - 1;
    return Effect.succeed(Action.NextFrame({ State: { ...state, index: newIndex } }));
};

const processMultiSelectCursorDown = (state: MultiSelectState, totalChoices: number) =>
{
    const newIndex: number = (state.index + 1) % totalChoices;
    return Effect.succeed(Action.NextFrame({ State: { ...state, index: newIndex } }));
};

const processSpace = <A>(
    state: MultiSelectState,
    options: SelectOptionsReq<A>
) =>
{
    const selectedIndices: Set<number> = new Set(state.selectedIndices);
    if (state.index === 0)
    {
        if (state.selectedIndices.size === options.choices.length)
        {
            selectedIndices.clear();
        }
        else
        {
            for (let i: number = 0; i < options.choices.length; i++)
            {
                selectedIndices.add(i);
            }
        }
    }
    else if (state.index === 1)
    {
        for (let i: number = 0; i < options.choices.length; i++)
        {
            if (state.selectedIndices.has(i))
            {
                selectedIndices.delete(i);
            }
            else
            {
                selectedIndices.add(i);
            }
        }
    }
    else
    {
        const choiceIndex: number = state.index - metaOptionsCount;
        if (selectedIndices.has(choiceIndex))
        {
            selectedIndices.delete(choiceIndex);
        }
        else
        {
            selectedIndices.add(choiceIndex);
        }
    }
    return Effect.succeed(Action.NextFrame({ State: { ...state, selectedIndices } }));
};

const handleMultiSelectClear = <A>(options: SelectOptionsReq<A>) =>
    Effect.fnUntraced(function*(state: MultiSelectState, _: Action<MultiSelectState, Array<A>>)
    {
        const terminal: Terminal.Terminal = yield* Terminal.Terminal;
        const columns: number = yield* terminal.columns;
        const figures: Figures = yield* PlatformFigures;
        // const clearPrompt = Ansi.eraseLine + Ansi.cursorLeft;
        const promptText: string = renderSelectOutput("?", figures.pointerSmall, options, { plain: true });
        const choicesText: string = renderMultiSelectChoices(state, options, figures, { plain: true });
        const errorText: string = renderMultiSelectError(state, figures.pointer, { plain: true });
        const clearOutput: string =
            clearOutputWithError(`${ promptText }\n${ choicesText }`, columns, errorText);
        return clearOutput; // + clearPrompt;
    });

const handleMultiSelectProcess = <A>(options: SelectOptionsReq<A> & MultiSelectOptionsReq) =>
{
    return (input: Terminal.UserInput, state: MultiSelectState) =>
    {
        const totalChoices: number = options.choices.length + metaOptionsCount;
        switch (input.key.name)
        {
            case "k":
            case "up":
            {
                return processMultiSelectCursorUp({ ...state, error: Option.none() }, totalChoices);
            }
            case "j":
            case "down":
            case "tab":
            {
                return processMultiSelectCursorDown({ ...state, error: Option.none() }, totalChoices);
            }
            case "space":
            {
                return processSpace(state, options);
            }
            case "enter":
            case "return":
            {
                const selectedCount: number = state.selectedIndices.size;
                if (options.min !== undefined && selectedCount < options.min)
                {
                    return Effect.succeed(
                        Action.NextFrame({
                            State:
                            {
                                ...state,
                                error: Option.some(`At least ${ options.min } are required`)
                            }
                        })
                    );
                }
                if (options.max !== undefined && selectedCount > options.max)
                {
                    return Effect.succeed(
                        Action.NextFrame({
                            State:
                            {
                                ...state,
                                error: Option.some(`At most ${ options.max } choices are allowed`)
                            }
                        })
                    );
                }
                const selectedValues: Array<A> = Array.from(state.selectedIndices)
                    .sort(EffectNumber.Order)
                    .map((index: number) =>
                        options.choices[index].value
                    );
                return Effect.succeed(Action.Submit({ value: selectedValues }));
            }
            default:
            {
                return Effect.succeed(Action.NoOp());
            }
        }
    };
};

const handleMultiSelectRender = <A>(options: SelectOptionsReq<A>) =>
{
    return (state: MultiSelectState, action: Action<MultiSelectState, Array<A>>) =>
    {
        return Action.$match(action, {
            NextFrame: ({ State: state }: { State: MultiSelectState; }) =>
                renderMultiSelectNextFrame(state, options),
            NoOp: () => Effect.succeed(renderNoOp),
            Submit: () => renderMultiSelectSubmission(state, options)
        });
    };
};

/* eslint-disable @typescript-eslint/no-empty-object-type */

interface IntegerOptionsReq extends Required<IntegerOptions> { }
interface FloatOptionsReq extends Required<FloatOptions> { }

/* eslint-enable @typescript-eslint/no-empty-object-type */

interface NumberState
{
    readonly cursor: number;
    readonly error: Option.Option<string>;
    readonly value: string;
}

const handleNumberClear = (options: IntegerOptionsReq) =>
{
    return Effect.fnUntraced(function*(state: NumberState, _: Action<NumberState, number>)
    {
        const terminal: Terminal.Terminal = yield* Terminal.Terminal;
        const columns: number = yield* terminal.columns;
        const figures: Figures = yield* PlatformFigures;
        const resetCurrentLine: string = "";// = Ansi.eraseLine + Ansi.cursorLeft;
        const errorText: string = renderNumberError(state, figures.pointerSmall, { plain: true });
        const promptText: string =
            renderNumberOutput(state, "?", figures.pointerSmall, options, { plain: true });
        const clearOutput: string = clearOutputWithError(promptText, columns, errorText);
        return clearOutput + resetCurrentLine;
    });
};

const renderNumberInput = (
    state: NumberState,
    submitted: boolean,
    renderOptions?: RenderOptions | undefined
): string =>
{
    const value: string = state.value === "" ? "" : `${ state.value }`;
    if (submitted || renderOptions?.plain === true)
    {
        return value;
    }

    return value;

    // const annotation = Option.isSome(state.error)
    //     ? Ansi.red
    //     : Ansi.combine(Ansi.underlined, Ansi.cyanBright);
    // return Ansi.annotate(value, annotation);
};

const renderNumberError = (
    state: NumberState,
    pointer: string,
    _renderOptions?: RenderOptions | undefined
) =>
{
    if (Option.isSome(state.error))
    {
        return Arr.match(state.error.value.split(NEWLINE_REGEXP), {
            onEmpty: () => "",
            onNonEmpty: (errorLines: Arr.NonEmptyReadonlyArray<string>) =>
            {
                return `${ pointer } ${ errorLines.join("\n") }`;
                // if (renderOptions?.plain === true)
                // {
                //     return `${pointer} ${errorLines.join("\n")}`;
                // }
                // const prefix: string = pointer;// = Ansi.annotate(pointer, Ansi.red) + " ";
                // const lines = Arr.map(errorLines, (str: string) => annotateErrorLine(str));
                // return Ansi.cursorSavePosition + "\n" +
                //     prefix + lines.join("\n") + Ansi.cursorRestorePosition;
            }
        });
    }
    return "";
};

const renderNumberOutput = (
    state: NumberState,
    leadingSymbol: string,
    trailingSymbol: string,
    options: IntegerOptionsReq,
    renderOptions?: RenderOptions | undefined,
    submitted: boolean = false
) =>
{
    const value: string = renderNumberInput(state, submitted, renderOptions);
    return renderPrompt(value, options.message, leadingSymbol, trailingSymbol, renderOptions);
};

const renderNumberNextFrame: {
    (state: NumberState, options: IntegerOptionsReq): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*(state: NumberState, options: IntegerOptionsReq)
{
    const figures: Figures = yield* PlatformFigures;
    const leadingSymbol: string = "?";//= Ansi.annotate("?", Ansi.cyanBright);
    const trailingSymbol: string = figures.pointerSmall;
    //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
    const errorMsg: string = renderNumberError(state, figures.pointerSmall);
    const promptMsg: string = renderNumberOutput(state, leadingSymbol, trailingSymbol, options);
    return promptMsg + errorMsg;
});

const renderNumberSubmission: {
    (nextState: NumberState, options: IntegerOptionsReq): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*(nextState: NumberState, options: IntegerOptionsReq)
{
    const figures: Figures = yield* PlatformFigures;
    const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
    const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
    const promptMsg: string =
        renderNumberOutput(nextState, leadingSymbol, trailingSymbol, options, undefined, true);
    return promptMsg + "\n";
});

const processNumberBackspace = (state: NumberState) =>
{
    if (state.value.length <= 0)
    {
        return Effect.succeed(Action.NoOp());
    }
    const value: string = state.value.slice(0, state.value.length - 1);
    return Effect.succeed(Action.NextFrame({
        State:
        {
            ...state,
            error: Option.none(),
            value
        }
    }));
};

const processNumberClear = (state: NumberState) =>
    Effect.succeed(Action.NextFrame({
        State:
        {
            ...state,
            cursor: 0,
            error: Option.none(),
            value: ""
        }
    }));

const defaultIntProcessor = (input: string, state: NumberState) =>
{
    if (state.value.length === 0 && input === "-")
    {
        return Effect.succeed(Action.NextFrame({
            State:
            {
                ...state,
                error: Option.none(),
                value: "-"
            }
        }));
    }

    const parsed: number = Number.parseInt(state.value + input);
    if (Number.isNaN(parsed))
    {
        return Effect.succeed(Action.NoOp());
    }
    else
    {
        return Effect.succeed(Action.NextFrame({
            State:
            {
                ...state,
                error: Option.none(),
                value: `${ parsed }`
            }
        }));
    }
};

const defaultFloatProcessor = (input: string, state: NumberState) =>
{
    if (input === "." && state.value.includes("."))
    {
        return Effect.succeed(Action.NoOp());
    }
    if (state.value.length === 0 && input === "-")
    {
        return Effect.succeed(Action.NextFrame({
            State:
{

    ...state,
    error: Option.none(),
    value: "-"
}
        }));
    }

    const parsed: number = Number.parseFloat(state.value + input);
    if (Number.isNaN(parsed))
    {
        return Effect.succeed(Action.NoOp());
    }
    else
    {
        return Effect.succeed(Action.NextFrame({
            State:
            {
                ...state,
                error: Option.none(),
                value: input === "." ? `${ parsed }.` : `${ parsed }`
            }
        }));
    }
};

const handleRenderInteger = (options: IntegerOptionsReq) =>
{
    return (state: NumberState, action: Action<NumberState, number>) =>
    {
        return Action.$match(action, {
            NextFrame: ({ State: state }: { State: NumberState; }) => renderNumberNextFrame(state, options),
            NoOp: () => Effect.succeed(renderNoOp),
            Submit: () => renderNumberSubmission(state, options)
        });
    };
};

const handleProcessInteger = (options: IntegerOptionsReq) =>
{
    return (input: Terminal.UserInput, state: NumberState) =>
    {
        if (input.key.ctrl && input.key.name === "u")
        {
            return processNumberClear(state);
        }
        switch (input.key.name)
        {
            case "backspace":
            {
                return processNumberBackspace(state);
            }
            case "k":
            case "up":
            {
                return Effect.succeed(Action.NextFrame({
                    State:
                    {
                        ...state,
                        error: Option.none(),
                        value: state.value === "" || state.value === "-"
                            ? `${options.incrementBy}`
                            : `${Number.parseInt(state.value) + options.incrementBy}`
                    }
                }));
            }
            case "j":
            case "down":
            {
                return Effect.succeed(Action.NextFrame({
                    State:
                    {
                        ...state,
                        error: Option.none(),
                        value: state.value === "" || state.value === "-"
                            ? `-${ options.decrementBy }`
                            : `${ Number.parseInt(state.value) - options.decrementBy }`
                    }
                }));
            }
            case "enter":
            case "return":
            {
                const parsed: number = Number.parseInt(state.value);
                if (Number.isNaN(parsed))
                {
                    return Effect.succeed(Action.NextFrame({
                        State:
                        {
                            ...state,
                            error: Option.some("Must provide an integer value")
                        }
                    }));
                }
                else
                {
                    return Effect.match(options.validate(parsed), {
                        onFailure: (error: string) =>
                            Action.NextFrame({
                                State:
                                {
                                    ...state,
                                    error: Option.some(error)
                                }
                            }),
                        onSuccess: (value: number) => Action.Submit({ value: value })
                    });
                }
            }
            default:
            {
                return defaultIntProcessor(Option.getOrElse(input.input, () => ""), state);
            }
        }
    };
};

const handleRenderFloat = (options: FloatOptionsReq) =>
{
    return (state: NumberState, action: Action<NumberState, number>) =>
    {
        return Action.$match(action, {
            NextFrame: ({ State: state }: { State: NumberState; }) => renderNumberNextFrame(state, options),
            NoOp: () => Effect.succeed(renderNoOp),
            Submit: () => renderNumberSubmission(state, options)
        });
    };
};

const handleProcessFloat = (options: FloatOptionsReq) =>
{
    return (input: Terminal.UserInput, state: NumberState) =>
    {
        if (input.key.ctrl && input.key.name === "u")
        {
            return processNumberClear(state);
        }
        switch (input.key.name)
        {
            case "backspace": {
                return processNumberBackspace(state);
            }
            case "k":
            case "up": {
                return Effect.succeed(Action.NextFrame({
                    State:
                    {
                        ...state,
                        error: Option.none(),
                        value: state.value === "" || state.value === "-"
                            ? `${ options.incrementBy }`
                            : `${ Number.parseFloat(state.value) + options.incrementBy }`
                    }
                }));
            }
            case "j":
            case "down":
            {
                return Effect.succeed(Action.NextFrame({
                    State:
                    {
                        ...state,
                        error: Option.none(),
                        value: state.value === "" || state.value === "-"
                            ? `-${ options.decrementBy }`
                            : `${ Number.parseFloat(state.value) - options.decrementBy }`
                    }
                }));
            }
            case "enter":
            case "return":
            {
                const parsed: number = Number.parseFloat(state.value);
                if (Number.isNaN(parsed))
                {
                    return Effect.succeed(Action.NextFrame({
                        State:
                        {
                            ...state,
                            error: Option.some("Must provide a floating point value")
                        }
                    }));
                }
                else
                {
                    return Effect.flatMap(
                        Effect.sync(() => EffectNumber.round(parsed, options.precision)),
                        (rounded: number) =>
                            Effect.match(options.validate(rounded), {
                                onFailure: (error: string) =>
                                    Action.NextFrame({
                                        State:
                                        {
                                            ...state,
                                            error: Option.some(error)
                                        }
                                    }),
                                onSuccess: (value: number) => Action.Submit({ value: value })
                            })
                    );
                }
            }
            default:
            {
                return defaultFloatProcessor(Option.getOrElse(input.input, () => ""), state);
            }
        }
    };
};

type SelectState = number;

type AutoCompleteState =
    {
        readonly query: string
        readonly index: number
        readonly filtered: ReadonlyArray<number>
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

const updateAutoCompleteState = <A>(
    state: AutoCompleteState,
    options: AutoCompleteOptionsReq<A>,
    query: string
): AutoCompleteState =>
{
    const filtered: Array<number> = filterAutoCompleteChoices(options.choices, query);
    if (filtered.length === 0)
    {
        return {
            ...state,
            filtered,
            index: 0,
            query
        };
    }
    if (filtered.includes(state.index))
    {
        return {
            ...state,
            filtered,
            query
        };
    }

    return {
        ...state,
        filtered,
        index: filtered[0],
        query
    };
};

const autoCompleteCursor = (state: AutoCompleteState) =>
    Option.getOrElse(Arr.findFirstIndex(state.filtered, (index: number) => index === state.index), () => 0);

const renderSelectOutput = <A>(
    leadingSymbol: string,
    trailingSymbol: string,
    options: SelectOptionsReq<A>,
    renderOptions?: RenderOptions | undefined
) => renderPrompt("", options.message, leadingSymbol, trailingSymbol, renderOptions);

const renderAutoCompleteFilter = <A>(
    state: AutoCompleteState,
    options: AutoCompleteOptionsReq<A>,
    _renderOptions?: RenderOptions | undefined
) =>
{
    const filterValue: string = state.query.length === 0
        ? options.filterPlaceholder
        : state.query;
    //     ? renderOptions?.plain === true
    //         ? options.filterPlaceholder
    //         : Ansi.annotate(options.filterPlaceholder, Ansi.blackBright)
    //     : renderOptions?.plain === true
    //         ? state.query
    //         : Ansi.annotate(state.query, Ansi.combine(Ansi.underlined, Ansi.cyanBright));
    return `[${ options.filterLabel }: ${ filterValue }]`;
};

const renderAutoCompleteOutput = <A>(
    state: AutoCompleteState,
    leadingSymbol: string,
    trailingSymbol: string,
    options: AutoCompleteOptionsReq<A>,
    renderOptions?: RenderOptions | undefined
) =>
{
    const filter: string = renderAutoCompleteFilter(state, options, renderOptions);
    return renderPrompt(filter, options.message, leadingSymbol, trailingSymbol, renderOptions);
};

const renderChoicePrefix = <A>(
    state: SelectState,
    choices: SelectOptionsReq<A>["choices"],
    toDisplay: { readonly startIndex: number; readonly endIndex: number },
    currentIndex: number,
    figures: Effect.Success<typeof PlatformFigures>,
    renderOptions?: RenderOptions | undefined
) =>
{
    let prefix: string = " ";
    if (currentIndex === toDisplay.startIndex && toDisplay.startIndex > 0)
    {
        prefix = figures.arrowUp;
    }
    else if (currentIndex === toDisplay.endIndex - 1 && toDisplay.endIndex < choices.length)
    {
        prefix = figures.arrowDown;
    }
    if (renderOptions?.plain === true)
    {
        return state === currentIndex
            ? figures.pointer + prefix
            : prefix + " ";
    }
    if (choices[currentIndex].disabled)
    {
        // const annotation: string = Ansi.combine(Ansi.bold, Ansi.blackBright);
        return state === currentIndex
            ? figures.pointer + prefix
            // ? Ansi.annotate(figures.pointer, annotation) + prefix
            : prefix + " ";
    }
    return state === currentIndex
        ? figures.pointer + prefix
        // ? Ansi.annotate(figures.pointer, Ansi.cyanBright) + prefix
        : prefix + " ";
};

const renderAutoCompleteChoicePrefix = <A>(
    state: AutoCompleteState,
    options: AutoCompleteOptionsReq<A>,
    toDisplay: { readonly startIndex: number; readonly endIndex: number },
    currentIndex: number,
    figures: Effect.Success<typeof PlatformFigures>,
    renderOptions?: RenderOptions | undefined
) =>
{
    let prefix: string = " ";
    if (currentIndex === toDisplay.startIndex && toDisplay.startIndex > 0)
    {
        prefix = figures.arrowUp;
    }
    else if (currentIndex === toDisplay.endIndex - 1 && toDisplay.endIndex < state.filtered.length)
    {
        prefix = figures.arrowDown;
    }
    const choiceIndex: number = state.filtered[currentIndex];
    if (renderOptions?.plain === true)
    {
        return state.index === choiceIndex
            ? figures.pointer + prefix
            : prefix + " ";
    }
    const choice: SelectChoice<A> = options.choices[choiceIndex];
    if (choice.disabled)
    {
        // const annotation = Ansi.combine(Ansi.bold, Ansi.blackBright);
        return state.index === choiceIndex
            ? figures.pointer + prefix
            // ? Ansi.annotate(figures.pointer, annotation) + prefix
            : prefix + " ";
    }
    return state.index === choiceIndex
        ? figures.pointer + prefix
        // ? Ansi.annotate(figures.pointer, Ansi.cyanBright) + prefix
        : prefix + " ";
};

const renderChoiceTitle = <A>(
    choice: SelectChoice<A>,
    _isSelected: boolean,
    renderOptions?: RenderOptions | undefined
) =>
{
    if (renderOptions?.plain === true)
    {
        return choice.title;
    }
    const title: string = choice.title;
    return title;
    // if (isSelected)
    // {
    //     return choice.disabled
    //         ? Ansi.annotate(title, Ansi.combine(Ansi.underlined, Ansi.blackBright))
    //         : Ansi.annotate(title, Ansi.combine(Ansi.underlined, Ansi.cyanBright));
    // }
    // return choice.disabled
    //     ? Ansi.annotate(title, Ansi.combine(Ansi.strikethrough, Ansi.blackBright))
    //     : title;
};

const renderSelectChoices = <A>(
    state: SelectState,
    options: SelectOptionsReq<A>,
    figures: Effect.Success<typeof PlatformFigures>,
    renderOptions?: RenderOptions | undefined
) =>
{
    const choices: ReadonlyArray<SelectChoice<A>> = options.choices;
    const toDisplay: { endIndex: number; startIndex: number; } =
        entriesToDisplay(state, choices.length, options.maxPerPage);
    const documents: Array<string> = [ ];
    for (let index: number = toDisplay.startIndex; index < toDisplay.endIndex; index++)
    {
        const choice: SelectChoice<A> = choices[index];
        const isSelected: boolean = state === index;
        const prefix: string = renderChoicePrefix(state, choices, toDisplay, index, figures, renderOptions);
        const title: string = renderChoiceTitle(choice, isSelected, renderOptions);
        const description: string = renderChoiceDescription(choice, isSelected, renderOptions);
        documents.push(prefix + title + " " + description);
    }
    return documents.join("\n");
};

const renderAutoCompleteChoices = <A>(
    state: AutoCompleteState,
    options: AutoCompleteOptionsReq<A>,
    figures: Effect.Success<typeof PlatformFigures>,
    renderOptions?: RenderOptions | undefined
) =>
{
    if (state.filtered.length === 0)
    {
        return options.emptyMessage;
        // return renderOptions?.plain === true
        //     ? options.emptyMessage
        //     : Ansi.annotate(options.emptyMessage, Ansi.blackBright);
    }
    const cursor: number = autoCompleteCursor(state);
    const toDisplay: { endIndex: number; startIndex: number; } =
        entriesToDisplay(cursor, state.filtered.length, options.maxPerPage);
    const documents: Array<string> = [ ];
    for (let index: number = toDisplay.startIndex; index < toDisplay.endIndex; index++)
    {
        const choiceIndex: number = state.filtered[index];
        const choice: SelectChoice<A> = options.choices[choiceIndex];
        const isSelected: boolean = state.index === choiceIndex;
        const prefix: string =
            renderAutoCompleteChoicePrefix(state, options, toDisplay, index, figures, renderOptions);
        const title: string = renderChoiceTitle(choice, isSelected, renderOptions);
        const description: string = renderChoiceDescription(choice, isSelected, renderOptions);
        documents.push(prefix + title + " " + description);
    }
    return documents.join("\n");
};

const renderSelectNextFrame: {
    <A>(state: number, options: SelectOptionsReq<A>): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*<A>(state: SelectState, options: SelectOptionsReq<A>)
{
    const figures: Figures = yield* PlatformFigures;
    const choices: string = renderSelectChoices(state, options, figures);
    const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
    const trailingSymbol: string = figures.pointerSmall;
    //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
    const promptMsg: string = renderSelectOutput(leadingSymbol, trailingSymbol, options);
    return promptMsg + "\n" + choices;
    // return Ansi.cursorHide + promptMsg + "\n" + choices;
});

const renderAutoCompleteNextFrame: {
    <A>(state: AutoCompleteState, options: AutoCompleteOptionsReq<A>): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*<A>(
    state: AutoCompleteState,
    options: AutoCompleteOptionsReq<A>
)
{
    const figures: Figures = yield* PlatformFigures;
    const choices: string = renderAutoCompleteChoices(state, options, figures);
    const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
    const trailingSymbol: string = figures.pointerSmall;
    //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
    const promptMsg: string = renderAutoCompleteOutput(state, leadingSymbol, trailingSymbol, options);
    return promptMsg + "\n" + choices;
    // return Ansi.cursorHide + promptMsg + "\n" + choices;
});

const renderSelectSubmission: {
    <A>(state: number, options: SelectOptionsReq<A>): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*<A>(state: SelectState, options: SelectOptionsReq<A>)
{
    const figures: Figures = yield* PlatformFigures;
    const selected: string = options.choices[state].title;
    const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
    const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
    const promptMsg: string = renderSelectOutput(leadingSymbol, trailingSymbol, options);
    return promptMsg + " " + selected + "\n";
    // return promptMsg + " " + Ansi.annotate(selected, Ansi.white) + "\n";
});

const renderAutoCompleteSubmission: {
    <A>(state: AutoCompleteState, options: AutoCompleteOptionsReq<A>): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*<A>(
    state: AutoCompleteState,
    options: AutoCompleteOptionsReq<A>
)
{
    const figures: Figures = yield* PlatformFigures;
    const selected: string = options.choices[state.index].title;
    const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
    const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
    const promptMsg: string = renderAutoCompleteOutput(state, leadingSymbol, trailingSymbol, options);
    return promptMsg + " " + selected + "\n";
    // return promptMsg + " " + Ansi.annotate(selected, Ansi.white) + "\n";
});

const processSelectCursorUp = <A>(state: SelectState, choices: SelectOptionsReq<A>["choices"]) =>
{
    if (state === 0)
    {
        return Effect.succeed(Action.NextFrame({ State: choices.length - 1 }));
    }
    return Effect.succeed(Action.NextFrame({ State: state - 1 }));
};

const processSelectCursorDown = <A>(state: SelectState, choices: SelectOptionsReq<A>["choices"]) =>
{
    if (state === choices.length - 1)
    {
        return Effect.succeed(Action.NextFrame({ State: 0 }));
    }
    return Effect.succeed(Action.NextFrame({ State: state + 1 }));
};

const processSelectNext = <A>(state: SelectState, choices: SelectOptionsReq<A>["choices"]) =>
{
    return Effect.succeed(Action.NextFrame({ State: (state + 1) % choices.length }));
};

const processAutoCompleteCursorUp = (state: AutoCompleteState) =>
{
    if (state.filtered.length === 0)
    {
        return Effect.succeed(Action.NoOp());
    }
    const cursor: number = autoCompleteCursor(state);
    const nextCursor: number = cursor === 0 ? state.filtered.length - 1 : cursor - 1;
    return Effect.succeed(Action.NextFrame({ State: { ...state, index: state.filtered[nextCursor] } }));
};

const processAutoCompleteCursorDown = (state: AutoCompleteState) =>
{
    if (state.filtered.length === 0)
    {
        return Effect.succeed(Action.NoOp());
    }
    const cursor: number = autoCompleteCursor(state);
    const nextCursor: number = (cursor + 1) % state.filtered.length;
    return Effect.succeed(Action.NextFrame({ State: { ...state, index: state.filtered[nextCursor] } }));
};

const processAutoCompleteNext = (state: AutoCompleteState) => processAutoCompleteCursorDown(state);

const processAutoCompleteBackspace = <A>(state: AutoCompleteState, options: AutoCompleteOptionsReq<A>) =>
{
    if (state.query.length === 0)
    {
        return Effect.succeed(Action.NoOp());
    }
    const query: string = state.query.slice(0, state.query.length - 1);
    return Effect.succeed(Action.NextFrame({ State: updateAutoCompleteState(state, options, query) }));
};

const processAutoCompleteClear = <A>(state: AutoCompleteState, options: AutoCompleteOptionsReq<A>) =>
    Effect.succeed(Action.NextFrame({ State: updateAutoCompleteState(state, options, "") }));

const processAutoCompleteInput: {
    <A>(
        input: string,
        state: AutoCompleteState,
        options: AutoCompleteOptionsReq<A>
    ): Effect.Effect<Action<AutoCompleteState, A>>;
} = <A>(input: string, state: AutoCompleteState, options: AutoCompleteOptionsReq<A>) =>
{
    if (input.length === 0)
    {
        return Effect.succeed(Action.NoOp());
    }
    const query: string = state.query + input;
    return Effect.succeed(Action.NextFrame({ State: updateAutoCompleteState(state, options, query) }));
};

const handleSelectRender = <A>(options: SelectOptionsReq<A>) =>
{
    return (state: SelectState, action: Action<SelectState, A>) =>
    {
        return Action.$match(action, {
            NextFrame: ({ State: state }: { State: SelectState; }) => renderSelectNextFrame(state, options),
            NoOp: () => Effect.succeed(renderNoOp),
            Submit: () => renderSelectSubmission(state, options)
        });
    };
};

const handleAutoCompleteRender = <A>(options: AutoCompleteOptionsReq<A>) =>
{
    return (state: AutoCompleteState, action: Action<AutoCompleteState, A>) =>
    {
        return Action.$match(action, {
            NextFrame: ({ State: state }: { State: AutoCompleteState; }) =>
                renderAutoCompleteNextFrame(state, options),
            NoOp: () => Effect.succeed(renderNoOp),
            Submit: () => renderAutoCompleteSubmission(state, options)
        });
    };
};

const handleSelectClear = <A>(options: SelectOptionsReq<A>) =>
    Effect.fnUntraced(function*(state: SelectState, _: Action<SelectState, A>)
    {
        const terminal: Terminal.Terminal = yield* Terminal.Terminal;
        const columns: number = yield* terminal.columns;
        const figures: Figures = yield* PlatformFigures;
        const clearPrompt: string = "";// = Ansi.eraseLine + Ansi.cursorLeft;
        const promptText: string = renderSelectOutput("?", figures.pointerSmall, options, { plain: true });
        const choicesText: string = renderSelectChoices(state, options, figures, { plain: true });
        const clearOutput: string = eraseText(`${ promptText }\n${ choicesText }`, columns);
        return clearOutput + clearPrompt;
    });

const handleAutoCompleteClear = <A>(options: AutoCompleteOptionsReq<A>) =>
    Effect.fnUntraced(function*(state: AutoCompleteState, _: Action<AutoCompleteState, A>)
    {
        const terminal: Terminal.Terminal = yield* Terminal.Terminal;
        const columns: number = yield* terminal.columns;
        const figures: Figures = yield* PlatformFigures;
        const clearPrompt: string = "";// = Ansi.eraseLine + Ansi.cursorLeft;
        const promptText: string =
            renderAutoCompleteOutput(state, "?", figures.pointerSmall, options, { plain: true });
        const choicesText: string = renderAutoCompleteChoices(state, options, figures, { plain: true });
        const clearOutput: string = eraseText(`${promptText}\n${choicesText}`, columns);
        return clearOutput + clearPrompt;
    });

const handleSelectProcess = <A>(options: SelectOptionsReq<A>) =>
{
    return (input: Terminal.UserInput, state: SelectState) =>
    {
        switch (input.key.name)
        {
            case "k":
            case "up":
            {
                return processSelectCursorUp(state, options.choices);
            }
            case "j":
            case "down":
            {
                return processSelectCursorDown(state, options.choices);
            }
            case "tab":
            {
                return processSelectNext(state, options.choices);
            }
            case "enter":
            case "return":
            {
                const selected: SelectChoice<A> = options.choices[state];
                if (selected.disabled)
                {
                    return Effect.succeed(Action.NoOp());
                }
                return Effect.succeed(Action.Submit({ value: selected.value }));
            }
            default:
            {
                return Effect.succeed(Action.NoOp());
            }
        }
    };
};

const handleAutoCompleteProcess = <A>(options: AutoCompleteOptionsReq<A>) =>
{
    return (input: Terminal.UserInput, state: AutoCompleteState) =>
    {
        if (input.key.ctrl)
        {
            if (input.key.name === "u")
            {
                return processAutoCompleteClear(state, options);
            }
            return Effect.succeed(Action.NoOp());
        }
        switch (input.key.name)
        {
            case "k":
            case "up":
            {
                return processAutoCompleteCursorUp(state);
            }
            case "j":
            case "down":
            {
                return processAutoCompleteCursorDown(state);
            }
            case "tab":
            {
                return processAutoCompleteNext(state);
            }
            case "backspace":
            {
                return processAutoCompleteBackspace(state, options);
            }
            case "enter":
            case "return":
            {
                if (state.filtered.length === 0)
                {
                    return Effect.succeed(Action.NoOp());
                }
                const selected: SelectChoice<A> = options.choices[state.index];
                if (selected.disabled)
                {
                    return Effect.succeed(Action.NoOp());
                }
                return Effect.succeed(Action.Submit({ value: selected.value }));
            }
            default:
            {
                return processAutoCompleteInput(Option.getOrElse(input.input, () => ""), state, options);
            }
        }
    };
};

interface TextOptionsReq extends Required<TextOptions>
{
    /**
     * The type of the text option.
     */
    readonly type:
        | "hidden"
        | "password"
        | "text";
}

interface TextState
{
    readonly cursor: number;
    readonly error: Option.Option<string>;
    readonly value: string;
}

const renderClearScreen: {
    (state: TextState, options: TextOptionsReq): Effect.Effect<string, never, Terminal.Terminal>;
} = Effect.fnUntraced(function*(state: TextState, options: TextOptionsReq)
{
    const terminal: Terminal.Terminal = yield* Terminal.Terminal;
    const columns: number = yield* terminal.columns;
    const figures: Figures = yield* PlatformFigures;
    const resetCurrentLine: string = "";// = Ansi.eraseLine + Ansi.cursorLeft;
    const errorText: string = renderTextError(state, figures.pointerSmall, { plain: true });
    const clearOutput: string = clearOutputWithError(
        renderTextOutput(state, "?", figures.pointerSmall, options, { plain: true }),
        columns,
        errorText
    );
    return clearOutput + resetCurrentLine;
});

const renderTextInput = (
    nextState: TextState,
    options: TextOptionsReq,
    _submitted: boolean,
    renderOptions?: RenderOptions | undefined
) =>
{
    const text: string = nextState.value;
    if (renderOptions?.plain === true)
    {
        switch (options.type)
        {
            case "hidden":
            {
                return "";
            }
            case "password":
            {
                return "*".repeat(text.length);
            }
            case "text":
            {
                return text;
            }
        }
    }

    // const annotation = Option.isSome(nextState.error) ?
    //     Ansi.red
    //     : submitted ?
    //         Ansi.white
    //         : nextState.value.length === 0 ?
    //             Ansi.blackBright
    //             : Ansi.combine(Ansi.underlined, Ansi.cyanBright);

    return text;
    // switch (options.type)
    // {
    //     case "hidden":
    //     {
    //         return "";
    //     }
    //     case "password":
    //     {
    //         return Ansi.annotate("*".repeat(text.length), annotation);
    //     }
    //     case "text":
    //     {
    //         return Ansi.annotate(text, annotation);
    //     }
    // }
};

const renderTextError = (
    nextState: TextState,
    pointer: string,
    renderOptions?: RenderOptions | undefined
): string =>
{
    if (Option.isSome(nextState.error))
    {
        return Arr.match(nextState.error.value.split(NEWLINE_REGEXP), {
            onEmpty: () => "",
            onNonEmpty: (errorLines: Arr.NonEmptyReadonlyArray<string>) =>
            {
                if (renderOptions?.plain === true)
                {
                    return `${pointer} ${errorLines.join("\n")}`;
                }
                const prefix: string = pointer;// = Ansi.annotate(pointer, Ansi.red) + " ";
                // const lines = Arr.map(errorLines, (str) => annotateErrorLine(str));
                return "\n" + prefix + errorLines.join("\n");
                // return Ansi.cursorSavePosition + "\n" + prefix +
                //     lines.join("\n") + Ansi.cursorRestorePosition;
            }
        });
    }
    return "";
};

const renderTextOutput = (
    nextState: TextState,
    leadingSymbol: string,
    trailingSymbol: string,
    options: TextOptionsReq,
    renderOptions?: RenderOptions | undefined,
    submitted: boolean = false
) =>
{
    const value: string = renderTextInput(nextState, options, submitted, renderOptions);
    return renderPrompt(value, options.message, leadingSymbol, trailingSymbol, renderOptions);
};

const renderTextNextFrame: {
    (state: TextState, options: TextOptionsReq): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*(state: TextState, options: TextOptionsReq)
{
    const figures: Figures = yield* PlatformFigures;
    const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
    const trailingSymbol: string = figures.pointerSmall;
    //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
    const promptMsg: string = renderTextOutput(state, leadingSymbol, trailingSymbol, options);
    const errorMsg: string = renderTextError(state, figures.pointerSmall);
    // const offset: number = state.cursor - state.value.length;
    return promptMsg + errorMsg; // + Ansi.cursorMove(offset);
});

const renderTextSubmission: {
    (state: TextState, options: TextOptionsReq): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*(state: TextState, options: TextOptionsReq)
{
    const figures: Figures = yield* PlatformFigures;
    const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
    const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
    const promptMsg: string =
        renderTextOutput(state, leadingSymbol, trailingSymbol, options, undefined, true);

    return promptMsg + "\n";
});

const processTextBackspace = (state: TextState) =>
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

const processTextClear = (state: TextState) =>
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

const processTextCursorLeft = (state: TextState) =>
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

const processTextCursorRight = (state: TextState) =>
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

const processTextCursorStart = (state: TextState) =>
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

const processTextCursorEnd = (state: TextState) =>
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

const processTab = (state: TextState, options: TextOptionsReq) =>
{
    if (state.value === options.default)
    {
        return Effect.succeed(Action.NoOp());
    }
    const value: string = state.value.length === 0 ? options.default : state.value;
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

const defaultTextProcessor = (input: string, state: TextState) =>
{
    const beforeCursor: string = state.value.slice(0, state.cursor);
    const afterCursor: string = state.value.slice(state.cursor);
    const value: string = `${ beforeCursor }${ input }${ afterCursor }`;
    const cursor: number = state.cursor + input.length;
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

const handleTextRender = (options: TextOptionsReq) =>
{
    return (state: TextState, action: Action<TextState, string>) =>
    {
        return Action.$match(action, {
            NextFrame: ({ State: state }: { State: TextState; }) => renderTextNextFrame(state, options),
            NoOp: () => Effect.succeed(renderNoOp),
            Submit: () => renderTextSubmission(state, options)
        });
    };
};

const handleTextProcess = (options: TextOptionsReq) =>
{
    return (input: Terminal.UserInput, state: TextState) =>
    {
        if (input.key.ctrl)
        {
            switch (input.key.name)
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
        switch (input.key.name)
        {
            case "backspace":
            {
                return processTextBackspace(state);
            }
            case "left":
            {
                return processTextCursorLeft(state);
            }
            case "right":
            {
                return processTextCursorRight(state);
            }
            case "home":
            {
                return processTextCursorStart(state);
            }
            case "end":
            {
                return processTextCursorEnd(state);
            }
            case "enter":
            case "return":
            {
                const value: string = state.value;
                return Effect.match(options.validate(value), {
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
            case "tab":
            {
                return processTab(state, options);
            }
            default:
            {
                return defaultTextProcessor(Option.getOrElse(input.input, () => ""), state);
            }
        }
    };
};

const handleTextClear = (options: TextOptionsReq) =>
{
    return (state: TextState, _: Action<TextState, string>) =>
    {
        return renderClearScreen(state, options);
    };
};

const basePrompt = (
    options: TextOptions,
    type: TextOptionsReq["type"]
): Prompt<string> =>
{
    const opts: TextOptionsReq =
        {
            default: "",
            type,
            validate: Effect.succeed,
            ...options
        };

    const initialState: TextState =
        {
            cursor: opts.default.length,
            error: Option.none(),
            value: opts.default
        };

    return custom(initialState, {
        clear: handleTextClear(opts),
        process: handleTextProcess(opts),
        render: handleTextRender(opts)
    });
};

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
interface ToggleOptionsReq extends Required<ToggleOptions> { }

type ToggleState = boolean;

const handleToggleClear: {
    (options: ToggleOptionsReq): Effect.Effect<string, never, Terminal.Terminal>;
} = Effect.fnUntraced(function*(options: ToggleOptionsReq)
{
    const terminal: Terminal.Terminal = yield* Terminal.Terminal;
    const columns: number = yield* terminal.columns;
    const figures: Figures = yield* PlatformFigures;
    const clearPrompt: string = ""; // = Ansi.eraseLine + Ansi.cursorLeft;
    const toggleText: string = `${ options.active } / ${ options.inactive }`;
    const promptText: string =
        renderPrompt(toggleText, options.message, "?", figures.pointerSmall, { plain: true });
    const clearOutput: string = eraseText(promptText, columns);
    return clearOutput + clearPrompt;
});

const renderToggle = (
    _value: boolean,
    options: ToggleOptionsReq,
    _submitted: boolean = false
) =>
{
    const separator: string = "/";// = Ansi.annotate("/", Ansi.blackBright);
    // const selectedAnnotation: string = "";
    //     = Ansi.combine(Ansi.underlined, submitted ? Ansi.white : Ansi.cyanBright);
    const inactive: string = options.inactive;// value
    //     ? options.inactive
    //     : Ansi.annotate(options.inactive, selectedAnnotation);
    const active: string = options.active;// value
    //     ? Ansi.annotate(options.active, selectedAnnotation)
    //     : options.active;
    return active + " " + separator + " " + inactive;
};

const renderToggleOutput = (
    toggle: string,
    leadingSymbol: string,
    trailingSymbol: string,
    _options: ToggleOptionsReq
) =>
{
    // const promptLines: Array<string> = options.message.split(NEWLINE_REGEXP);
    const prefix: string = leadingSymbol + " ";
    // if (Arr.isReadonlyArrayNonEmpty(promptLines))
    // {
    //     const lines = Arr.map(promptLines, (line: string) => annotateLine(line));
    //     return prefix + lines.join("\n") + " " + trailingSymbol + " " + toggle;
    // }
    return prefix + " " + trailingSymbol + " " + toggle;
};

const renderToggleNextFrame: {
    (state: boolean, options: ToggleOptionsReq): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*(state: ToggleState, options: ToggleOptionsReq)
{
    const figures: Figures = yield* PlatformFigures;
    const leadingSymbol: string = "?";// = Ansi.annotate("?", Ansi.cyanBright);
    const trailingSymbol: string = figures.pointerSmall;
    //     = Ansi.annotate(figures.pointerSmall, Ansi.blackBright);
    const toggle: string = renderToggle(state, options);
    const promptMsg: string = renderToggleOutput(toggle, leadingSymbol, trailingSymbol, options);
    return promptMsg;
    // return Ansi.cursorHide + promptMsg;
});

const renderToggleSubmission: {
    (value: boolean, options: ToggleOptionsReq): Effect.Effect<string, never, never>;
} = Effect.fnUntraced(function*(value: boolean, options: ToggleOptionsReq)
{
    const figures: Figures = yield* PlatformFigures;
    const leadingSymbol: string = figures.tick;// = Ansi.annotate(figures.tick, Ansi.green);
    const trailingSymbol: string = figures.ellipsis;// = Ansi.annotate(figures.ellipsis, Ansi.blackBright);
    const toggle: string = renderToggle(value, options, true);
    const promptMsg: string = renderToggleOutput(toggle, leadingSymbol, trailingSymbol, options);
    return promptMsg + "\n";
});

const activate: Effect.Effect<{
    readonly _tag: "NextFrame";
    readonly State: boolean;
}, never, never> = Effect.succeed(Action.NextFrame({ State: true }));

const deactivate: Effect.Effect<{
    readonly _tag: "NextFrame";
    readonly State: boolean;
}, never, never> = Effect.succeed(Action.NextFrame({ State: false }));

const handleToggleRender = (options: ToggleOptionsReq) =>
{
    return (state: ToggleState, action: Action<ToggleState, boolean>) =>
    {
        switch (action._tag)
        {
            case "NoOp": {
                return Effect.succeed(renderNoOp);
            }
            case "NextFrame": {
                return renderToggleNextFrame(state, options);
            }
            case "Submit": {
                return renderToggleSubmission(state, options);
            }
        }
    };
};

const handleToggleProcess = (input: Terminal.UserInput, state: ToggleState) =>
{
    switch (input.key.name)
    {
        case "0":
        case "j":
        case "delete":
        case "right":
        case "down":
        {
            return deactivate;
        }
        case "1":
        case "k":
        case "left":
        case "up":
        {
            return activate;
        }
        case " ":
        case "tab":
        {
            return state ? deactivate : activate;
        }
        case "enter":
        case "return":
        {
            return Effect.succeed(Action.Submit({ value: state }));
        }
        default:
        {
            return Effect.succeed(Action.NoOp());
        }
    }
};

const entriesToDisplay = (cursor: number, total: number, maxVisible?: number) =>
{
    const max: number = maxVisible === undefined ? total : maxVisible;
    let startIndex: number = Math.min(total - max, cursor - Math.floor(max / 2));
    if (startIndex < 0)
    {
        startIndex = 0;
    }
    const endIndex: number = Math.min(startIndex + max, total);
    return { endIndex, startIndex };
};
