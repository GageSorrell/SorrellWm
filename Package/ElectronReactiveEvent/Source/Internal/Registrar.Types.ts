/* File:      Registrar.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

// @Todo TEMPORARY.
import type { EmptyEventParameter, EventDecl, MainOwner, RendererOwner } from "../Decl/Decl.Types";
import type { EventOwner } from "../Decl/Decl.Types";
import type { OwnerKey } from "./Decl.Types";

// @TODO TEMPORARY.
// export interface Registrar { }

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
export interface Registrar
{
    __Internal__:
    {
        GetLitFam: EventDecl<RendererOwner, boolean, EmptyEventParameter, string>;
        BingBong: EventDecl<RendererOwner, EmptyEventParameter, EmptyEventParameter, [ string, number ]>;
        ShowLitFam: EventDecl<MainOwner, number, EmptyEventParameter, string>;
        ResponsefulMainEvent: EventDecl<MainOwner, number, { foo: string; }, string>;

        RendererEmptyEventNoRequestNoResponseNoError: EventDecl<
            RendererOwner,
            EmptyEventParameter,
            EmptyEventParameter,
            EmptyEventParameter
        >;

        RendererEmptyEventNoRequestNoResponseNoErrorPayload: EventDecl<
            RendererOwner,
            EmptyEventParameter,
            EmptyEventParameter,
            string
        >;

        RendererEmptyEventNoRequestNoResponse: EventDecl<
            RendererOwner,
            EmptyEventParameter,
            EmptyEventParameter,
            [ string, { foo: string; } ]
        >;

        RendererEmptyEventNoRequest: EventDecl<
            RendererOwner,
            EmptyEventParameter,
            { Foo: string; },
            [ string, { Foo: string; } ]
        >;

        RendererEmptyEvent: EventDecl<
            RendererOwner,
            number,
            { Foo: string; },
            [ string, { Foo: string; } ]
        >;

        MainEmptyEventNoRequestNoResponseNoError: EventDecl<
            MainOwner,
            EmptyEventParameter,
            EmptyEventParameter,
            EmptyEventParameter
        >;

        MainEmptyEventNoRequestNoResponseNoErrorPayload: EventDecl<
            MainOwner,
            EmptyEventParameter,
            EmptyEventParameter,
            string
        >;

        MainEmptyEventNoRequestNoResponse: EventDecl<
            MainOwner,
            EmptyEventParameter,
            EmptyEventParameter,
            [ string, { foo: string; } ]
        >;

        MainEmptyEventNoRequest: EventDecl<
            MainOwner,
            EmptyEventParameter,
            { Foo: string; },
            [ string, { Foo: string; } ]
        >;

        MainEmptyEvent: EventDecl<
            MainOwner,
            number,
            { Foo: string; },
            [ string, { Foo: string; } ]
        >;
    }
}

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
