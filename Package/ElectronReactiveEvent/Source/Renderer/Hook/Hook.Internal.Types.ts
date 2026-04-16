/* File:      Hook.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Channel } from "../../Channel";
import type { Decl } from "../../Decl";
import type { EmptyOverloadParameter } from "../../Listener/Listener.Internal.Types";
import type { Invoke } from "../../Invoke/Invoke.Types";

/**
 * The type used by {@link ResultInternal} for the third argument of
 * the overloaded (private) signature of {@link useInvokeEvent}.
 *
 * @group Internal
 */
export type InvokeOptionsOverloadedArgument<SuspendsType extends boolean = boolean> =
    | Invoke.Options<SuspendsType>
    | EmptyOverloadParameter
    | undefined;

type OptionsFromOverload<ChannelType extends Channel.Handler,
    RequestOrOptionsType extends
        | Decl.Request<ChannelType>
        | Invoke.Options
        | EmptyOverloadParameter,
    OptionsType extends
        | Invoke.Options
        | EmptyOverloadParameter
> =
    OptionsType extends EmptyOverloadParameter
        ? RequestOrOptionsType extends Invoke.Options<infer SuspendsType>
            ? Invoke.Options<SuspendsType>
            : undefined
        : OptionsType extends Invoke.Options<infer SuspendsType>
            ? Invoke.Options<SuspendsType>
            : undefined;

/**
 * An extension of {@link InvokeResult} that is equipped to handle
 * the overloaded (private) signature of {@link useInvokeEvent}.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 * @typeParam RequestOrOptionsType - The overloaded type for the second argument.
 * @typeParam OptionsType - The overloaded type for the third argument.
 *
 * @group Internal
 */
export type ResultInternal<ChannelType extends Channel.Handler,
    RequestOrOptionsType extends
        | Decl.Request<ChannelType>
        | Invoke.Options
        | EmptyOverloadParameter,
    OptionsType extends
        | Invoke.Options
        | EmptyOverloadParameter
> =
    Invoke.Result<
        ChannelType,
        OptionsFromOverload<
            ChannelType,
            RequestOrOptionsType,
            OptionsType
        >
    >;

/**
 * A predicate function which determines whether objects of a given {@link Type}
 * are equivalent *in some sense*.
 *
 * @typeParam Type - The type of the objects being compared.
 *
 * @param A - The first argument being considered.
 * @param B - The second argument being considered.
 *
 * @returns Whether {@link A} and {@link B} are equivalent.
 *
 * @group Internal
 */
export type EqualityCheck<Type> = (A: Type, B: Type) => boolean;
