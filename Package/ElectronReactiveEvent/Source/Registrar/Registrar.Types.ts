/* File:      Registrar.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
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
 * Writing these `declare module` blocks is automated by the `electron-reactive-event-cli`,
 * although using this is optional.
 */
export interface Registrar { }

/**
 * This is the union of all `PackageKey` values used in a given project (that is, a given package
 * using `electron-reactive-event`, and any dependencies that also use `electron-reactive-event`).
 */
export type PackageKeys = Exclude<keyof Registrar, number | symbol>;

type ChannelsHelper<PackageKey extends PackageKeys> =
    {
        [ ChannelType in keyof Registrar[PackageKey] as Extract<ChannelType, string> ]: ChannelType;
    };

type Channels<PackageKey extends PackageKeys> =
    Extract<ChannelsHelper<PackageKey>[keyof ChannelsHelper<PackageKey>], string>;

type FilterByOwnerHelper<
    PackageKey extends PackageKeys,
    Owner extends EventOwner
> =
    {
        [ ChannelType in Channels<PackageKey> ]: ChannelType extends keyof Registrar[PackageKey]
            ? OwnerKey extends keyof Registrar[PackageKey][ChannelType]
                ? Registrar[PackageKey][ChannelType][OwnerKey] extends Owner
                    ? true
                    : false
                : never
            : never;
    };

/**
 * All event declarations of a given {@link PackageKey} and {@link OwnerType}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam OwnerType - The owner of the event declarations identified by this type.
 */
export type FilterByOwner<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner
> =
    {
        [ ChannelType in keyof FilterByOwnerHelper<PackageKey, OwnerType> as
        FilterByOwnerHelper<PackageKey, OwnerType>[
            ChannelType
            // keyof FilterByOwnerHelper<PackageKey, Owner>
            // Extract<ChannelType, keyof FilterByOwnerHelper<PackageKey, Owner>>
            // ChannelType
        ] extends true ? ChannelType : never
        ]: ChannelType extends keyof Registrar[PackageKey]
            ? Registrar[PackageKey][ChannelType]
            : never;
    };

/**
 * All `main` event declarations of a given {@link PackageKey}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type MainRegistrar<PackageKey extends PackageKeys> = FilterByOwner<PackageKey, MainOwner>;

/**
 * All `renderer` event declarations of a given {@link PackageKey}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type RendererRegistrar<PackageKey extends PackageKeys> = FilterByOwner<PackageKey, RendererOwner>;
