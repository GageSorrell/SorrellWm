/* File:      Hook.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Channel } from "../../Channel/index.js";
import type { EmptyOverloadParameter } from "../../Listener/Listener.Internal.Types.js";
import type { HandlerRequest } from "../../Listener/Listener.Types.js";
import type { InvokeOptions } from "./Hook.Unscoped.Types.js";
import type { InvokeResponse } from "./Hook.Types.js";
import type { PackageKeys } from "../../Internal/index.js";

/**
 * The type used by {@link InvokeResponseInternal} for the third argument of
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
 * An extension of {@link InvokeResponse} that is equipped to handle
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
export type InvokeResponseInternal<
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
    InvokeResponse<
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
