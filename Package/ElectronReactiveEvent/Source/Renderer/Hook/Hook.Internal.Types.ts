/* File:      Hook.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Channel } from "../../Channel";
import type { EmptyOverloadParameter } from "../../Listener/Listener.Internal.Types";
import type { HandlerRequest } from "../../Listener/Listener.Types";
import type { InvokeOptions } from "./Hook.Unscoped.Types";
import type { InvokeResult } from "./Hook.Types";
import type { PackageKeys } from "../../Internal";

/**
 * The type used by {@link ResultInternal} for the third argument of
 * the overloaded (private) signature of {@link useInvokeEvent}.
 *
 * @group Internal
 */
export type InvokeOptionsOverloadedArgument<SuspendsType extends boolean = boolean> =
    | InvokeOptions<SuspendsType>
    | EmptyOverloadParameter
    | undefined;

type OptionsFromOverload<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>,
    RequestOrOptionsType extends
        | HandlerRequest<PackageKey, ChannelType>
        | InvokeOptions
        | EmptyOverloadParameter,
    OptionsType extends
        | InvokeOptions
        | EmptyOverloadParameter
> =
    OptionsType extends EmptyOverloadParameter
        ? RequestOrOptionsType extends InvokeOptions<infer SuspendsType>
            ? InvokeOptions<SuspendsType>
            : undefined
        : OptionsType extends InvokeOptions<infer SuspendsType>
            ? InvokeOptions<SuspendsType>
            : undefined;

/**
 * An extension of {@link InvokeResult} that is equipped to handle
 * the overloaded (private) signature of {@link useInvokeEvent}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 * @typeParam RequestOrOptionsType - The overloaded type for the second argument.
 * @typeParam OptionsType - The overloaded type for the third argument.
 *
 * @group Internal
 */
export type ResultInternal<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>,
    RequestOrOptionsType extends
        | HandlerRequest<PackageKey, ChannelType>
        | InvokeOptions
        | EmptyOverloadParameter,
    OptionsType extends
        | InvokeOptions
        | EmptyOverloadParameter
> =
    InvokeResult<
        PackageKey,
        ChannelType,
        OptionsFromOverload<
            PackageKey,
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
