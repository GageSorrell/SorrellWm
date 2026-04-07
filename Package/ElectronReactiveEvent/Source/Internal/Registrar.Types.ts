/* File:      Registrar.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

// @Todo TEMPORARY.
import type { EmptyEventParameter, EventDecl, MainOwner, RendererOwner } from "../Decl/Decl.Types";
import type { EventOwner } from "../Decl/Decl.Types";
import type { OwnerKey } from "../Decl/Decl.Internal.Types";

// @TODO TEMPORARY.
// export interface Registrar { }

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

export type FilterByOwner<
    PackageKey extends PackageKeys,
    Owner extends EventOwner
> =
    {
        [ ChannelType in keyof FilterByOwnerHelper<PackageKey, Owner> as
        FilterByOwnerHelper<PackageKey, Owner>[
            ChannelType
            // keyof FilterByOwnerHelper<PackageKey, Owner>
            // Extract<ChannelType, keyof FilterByOwnerHelper<PackageKey, Owner>>
            // ChannelType
        ] extends true ? ChannelType : never
        ]: ChannelType extends keyof Registrar[PackageKey]
            ? Registrar[PackageKey][ChannelType]
            : never;
    };

export type MainRegistrar<PackageKey extends PackageKeys> = FilterByOwner<PackageKey, MainOwner>;

export type RendererRegistrar<PackageKey extends PackageKeys> = FilterByOwner<PackageKey, RendererOwner>;
