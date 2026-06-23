/**
 * @file      Prompt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Plan from "./Plan.ts";
import type * as Struct from "./Struct.ts";
import { Effect, type FileSystem, type Path, type Terminal } from "effect";
import type { Covariant } from "effect/Types";
import type { Ink } from "../Ink/Ink.tsx";

/** Determines the overall interaction model used to present and edit prompt values. */
export type Layout =
    /**
     * A straight-forward layout in which values and controls are displayed
     * alongside each other.  This is heavily inspired by
     * {@link https://github.com/bombshell-dev/clack | \@clack/prompts}.
     */
    | "Wizard"

    /**
     * A layout in which values in the form are displayed in a "summary" format,
     * and the controls to edit any given value is hidden until that value is selected
     * for editing.
     */
    | "Inspector";

export type Environment =
    | Ink
    | FileSystem.FileSystem
    | Path.Path
    | Terminal.Terminal;

const PromptTypeId: unique symbol = Symbol.for("@sorrell/effect-ink/Prompt");

export type InspectorDynamicPolicy =
    | "Reject"
    | "FallbackToWizard"
    | "Stage";

export interface RunOptions
{
    readonly Layout?: Layout;
    readonly InspectorDynamicPolicy?: InspectorDynamicPolicy;
}

export interface Prompt<A, E = never, ExtraEnvironment = never>
    extends Effect.Effect<A, E | Terminal.QuitError, ExtraEnvironment | Environment>
{
    readonly [ PromptTypeId ]:
    {
        readonly _A: Covariant<A>;
        readonly _E: Covariant<E>;
        readonly _ExtraEnvironment: Covariant<ExtraEnvironment>;
    };
}

export interface Choice<A>
{
    readonly Value: A;
    readonly Label: string;
    readonly Description?: string;
    readonly Disabled?: boolean;
    readonly Group?: string;
}

export interface BasePromptOptions
{
    readonly Name?: string;
    readonly Message: string;
    readonly Hint?: string;
    readonly Required?: boolean;
    readonly Optional?: boolean;
}

export interface TextOptions<E = never, R = never> extends BasePromptOptions
{
    readonly InitialValue?: string;
    readonly Placeholder?: string;
    readonly SubmitEmpty?: boolean;
    readonly Validate?: (Value: string) => Effect.Effect<string | undefined, E, R>;
}

export interface PasswordOptions<E = never, R = never> extends TextOptions<E, R>
{
    readonly Mask?: string;
}

export interface ConfirmOptions extends BasePromptOptions
{
    readonly InitialValue?: boolean;
}

export interface SelectOptions<A, E = never, R = never> extends BasePromptOptions
{
    readonly Choices:
        | ReadonlyArray<Choice<A>>
        | Effect.Effect<ReadonlyArray<Choice<A>>, E, R>;

    readonly InitialValue?: A;
    readonly Validate?: (
        Value: A,
        Choice: Choice<A>
    ) => Effect.Effect<string | undefined, E, R>;
}

export interface MultiSelectOptions<A, E = never, R = never> extends BasePromptOptions
{
    readonly Choices:
        | ReadonlyArray<Choice<A>>
        | Effect.Effect<ReadonlyArray<Choice<A>>, E, R>;

    readonly InitialValues?: ReadonlyArray<A>;
    readonly SubmitEmpty?: boolean;

    readonly Validate?: (
        Values: ReadonlyArray<A>,
        Choices: ReadonlyArray<Choice<A>>
    ) => Effect.Effect<string | undefined, E, R>;
}

export type Value<Self> =
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    Self extends Prompt<infer A, any, any>
        ? A
        : never;

export type Error<Self> =
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    Self extends Prompt<any, infer E, any>
        ? E
        : never;

export type Requirements<Self> =
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    Self extends Prompt<any, any, infer R>
        ? R
        : never;

/* eslint-disable @typescript-eslint/no-explicit-any */

/** The type representing *any* {@link Prompt}. */
export type Any = Prompt<any, any, any>;

/* eslint-enable @typescript-eslint/no-explicit-any */

interface Impl<A, E, R> extends Prompt<A, E, R>
{
    readonly Plan: Plan.Plan<A, E, R>;
}

/* eslint-disable-next-line @typescript-eslint/typedef */
const Variance =
    {
        A: (_: never) => undefined as never,
        E: (_: never) => undefined as never,
        R: (_: never) => { }
    };

const MakePrompt = <A, E, R>(
    Plan: Plan.Plan<A, E, R>
): Prompt<A, E, R> =>
{
    return {
        Plan,
        [ PromptTypeId ]: Variance
    } as unknown as Impl<A, E, R>;
};

export const unsafeGetPlan = <A, E, R>(
    Self: Prompt<A, E, R>
): Plan.Plan<A, E, R> =>
{
    return (Self as Impl<A, E, R>).Plan;
};

export const succeed = <A>(
    Value: A
): Prompt<A> =>
    MakePrompt({
        _tag: "Succeed",

        Value
    });

export const fromEffect = <A, E, R>(
    Value: Effect.Effect<A, E, R>
): Prompt<A, E, R> =>
    MakePrompt({
        _tag: "Effect",

        Effect: Value
    });

export const suspend = <A, E, R>(
    Evaluate: () => Prompt<A, E, R>
): Prompt<A, E, R> =>
    MakePrompt({
        _tag: "Suspend",

        Evaluate
    });

export const suspendEffect = <A, E, R>(
    Evaluate: Effect.Effect<Prompt<A, E, R>, E, R>
): Prompt<A, E, R> =>
    MakePrompt({
        _tag: "SuspendEffect",

        Evaluate
    });

export const text = <E = never, R = never>(
    Options: TextOptions<E, R>
): Prompt<string, E, R> =>
    MakePrompt({
        _tag: "Field",

        Field:
        {
            _tag: "Text",
            ...Options
        }
    });

export const password = <E = never, R = never>(
    Options: PasswordOptions<E, R>
): Prompt<string, E, R> =>
    MakePrompt({
        _tag: "Field",

        Field:
        {
            _tag: "Password",
            ...Options
        }
    });

export const confirm = (
    Options: ConfirmOptions
): Prompt<boolean> =>
    MakePrompt({
        _tag: "Field",

        Field:
        {
            _tag: "Confirm",
            ...Options
        }
    });

export const Select = <A, E = never, R = never>(
    Options: SelectOptions<A, E, R>
): Prompt<A, E, R> =>
    MakePrompt({
        _tag: "Field",

        Field:
        {
            _tag: "Select",
            ...Options,
            Choices: normalizeChoices(Options.Choices)
        }
    });

export const MultiSelect = <A, E = never, R = never>(
    Options: MultiSelectOptions<ReadonlyArray<A>, E, R>
): Prompt<ReadonlyArray<A>, E, R> =>
    MakePrompt<ReadonlyArray<A>, E, R>({
        _tag: "Field",

        Field:
        {
            _tag: "MultiSelect",
            ...Options,
            Choices: normalizeChoices<ReadonlyArray<A>, E, R>(Options.Choices)
        }
    });

export const struct = <
    const Fields extends Record<string, Any>
>(
    Fields: Fields
): Prompt<
    Struct.Value<Fields>,
    Struct.Error<Fields>,
    Struct.Requirements<Fields>
> =>
    MakePrompt({
        _tag: "Struct",

        Decode: (Values: Record<string, unknown>) => Values as Struct.Value<Fields>,
        Fields
    });

export const map = <A, B>(
    Transformer: (Value: A) => B
) =>
    <E, R>(
        Self: Prompt<A, E, R>
    ): Prompt<B, E, R> =>
        MakePrompt({
            _tag: "Map",

            Map: Transformer,
            Source: Self
        });

export const flatMap = <A, B, E2, R2>(
    Function: (Value: A) => Prompt<B, E2, R2>
) =>
    <E, R>(
        Self: Prompt<A, E, R>
    ): Prompt<B, E | E2, R | R2> =>
        MakePrompt({
            _tag: "FlatMap",

            Continue: Function,
            Source: Self
        });

export const tap = <A, E2, R2>(
    Function: (Value: A) => Effect.Effect<unknown, E2, R2>
) =>
    <E, R>(
        Self: Prompt<A, E, R>
    ): Prompt<A, E | E2, R | R2> =>
        MakePrompt({
            _tag: "Tap",

            Source: Self,
            Tap: Function
        });

export const forEach = <
    Item,
    B,
    E,
    R
>(
    Items: ReadonlyArray<Item>,
    Make: (Item: Item, Index: number) => Prompt<B, E, R>
): Prompt<ReadonlyArray<B>, E, R> =>
    MakePrompt({
        _tag: "ForEach",

        Decode: (Values: ReadonlyArray<unknown>) => Values as ReadonlyArray<B>,
        Items,
        MakePrompt: (Item: unknown, Index: number) => Make(Item as Item, Index)
    });

export const flatten = <A, E, R, E2, R2>(
    Self: Prompt<Prompt<A, E2, R2>, E, R>
): Prompt<A, E | E2, R | R2> =>
    flatMap((Value: Prompt<A, E2, R2>) => Value)(Self);

export const branch = <A, B, E2, R2>(
    Function: (Value: A) => Prompt<B, E2, R2>
) =>
    <E, R>(
        Self: Prompt<A, E, R>
    ): Prompt<B, E | E2, R | R2> =>
        flatMap(Function)(Self);

export const run = <A, E, R>(
    _Self: Prompt<A, E, R>,
    _Options: RunOptions = { }
): Effect.Effect<A, E, R> =>
    Effect.gen(function* ()
    {
        // @TODO
        return undefined as A;
        // const InkService: Ink = yield* Ink;

        // return yield* InkService.run(Self);
        // return yield* RunnerService.run(
        //     Self,
        //     Options
        // );
    });

export const isDynamic = <A, E, R>(
    Self: Prompt<A, E, R>
): boolean =>
{
    return isDynamicPlan(
        unsafeGetPlan(Self)
    );
};

export const isStatic = <A, E, R>(
    Self: Prompt<A, E, R>
): boolean =>
{
    return !isDynamic(Self);
};

const normalizeChoices = <A, E, R>(
    Choices:
        | ReadonlyArray<Choice<A>>
        | Effect.Effect<ReadonlyArray<Choice<A>>, E, R>
): Effect.Effect<ReadonlyArray<Choice<A>>, E, R> =>
{
    return Array.isArray(Choices)
        ? Effect.succeed(Choices)
        : Choices as Effect.Effect<ReadonlyArray<Choice<A>>, E, R>;
};

const isDynamicPlan = (
    Plan: Plan.Any
): boolean =>
{
    switch (Plan._tag)
    {
        case "Succeed":
        case "Effect":
        case "Field":
        {
            return false;
        }

        case "Struct":
        {
            return Object
                .values(Plan.Fields)
                .some(isDynamic);
        }

        case "Map":
        case "Tap":
        {
            return isDynamic(Plan.Source);
        }

        case "Suspend":
        case "SuspendEffect":
        case "FlatMap":
        case "ForEach":
        {
            return true;
        }
    }
};
