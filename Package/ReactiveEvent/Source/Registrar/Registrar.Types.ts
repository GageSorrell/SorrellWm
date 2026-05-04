/**
 * @file      Registrar.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { OwnerKey } from "../Internal/Decl.Types";

/* eslint-disable @typescript-eslint/no-unused-vars */
const MainOwnerValue: unique symbol = Symbol("MainOwnerValue");
const RendererOwnerValue: unique symbol = Symbol("RendererOwnerValue");
/* eslint-enable @typescript-eslint/no-unused-vars */

/** This type is used to represent events that are sent by `main`. */
export type MainOwner = typeof MainOwnerValue;

/** This type is used to represent events that are sent by the `renderer`. */
export type RendererOwner = typeof RendererOwnerValue;

/** An *owner* of a given event type is from whom events of that event type are sent. */
export type EventOwner =
    | MainOwner
    | RendererOwner;

/**
 * The `Registrar` interface is used internally to store all {@link EventDecl | event declarations}
 * used in a given project.  Event declarations are scoped to the package in which they are declared,
 * and this scope is resolved via the `PackageKey` type parameter that is had by almost all generic types
 * in this package.
 *
 * Event declarations are added to the `Registrar` via
 * {@link https://www.typescriptlang.org/docs/handbook/declaration-merging.html | module augmentation}.
 * Writing these `declare module` blocks is automated by the `reactive-event-cli`,
 * although using this is optional.
 */
export interface Registrar { }

type ChannelsHelper =
    {
        [ ChannelType in keyof Registrar as Extract<ChannelType, string> ]: ChannelType;
    };

type Channels =
    Extract<ChannelsHelper[keyof ChannelsHelper], string>;

type FilterByOwnerHelper<Owner extends EventOwner> =
    {
        [ ChannelType in Channels ]: ChannelType extends keyof Registrar
            ? OwnerKey extends keyof Registrar[ChannelType]
                ? Registrar[ChannelType][OwnerKey] extends Owner
                    ? true
                    : false
                : never
            : never;
    };

/**
 * All event declarations of a given {@link OwnerType}.
 *
 * @template OwnerType - The owner of the event declarations identified by this type.
 */
export type FilterByOwner<OwnerType extends EventOwner> =
    {
        [ ChannelType in keyof FilterByOwnerHelper<OwnerType> as
        FilterByOwnerHelper<OwnerType>[ChannelType] extends true
            ? ChannelType
            : never
        ]: ChannelType extends keyof Registrar
            ? Registrar[ChannelType]
            : never;
    };

/**
 * All `main` event declarations of a given {@link PackageKey}.
 *
 */
export type MainRegistrar = FilterByOwner<MainOwner>;

/**
 * All `renderer` event declarations of a given {@link PackageKey}.
 *
 */
export type RendererRegistrar = FilterByOwner<RendererOwner>;
