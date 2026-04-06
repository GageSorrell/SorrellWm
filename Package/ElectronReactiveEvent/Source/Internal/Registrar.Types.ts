/* File:      Registrar.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

// @Todo TEMPORARY.
import type { EmptyEventParameter, EventDecl, MainOwner, RendererOwner } from "../Decl.Types";
import type { ErrorKey, OwnerKey, ResponseKey } from "./Decl.Types";
import type { EventOwner } from "../Decl.Types";

// @TODO TEMPORARY.
// export interface Registrar { }

export interface Registrar
{
    Pickij:
    {
        GetLitFam: EventDecl<RendererOwner, boolean, EmptyEventParameter, string>;
        BingBong: EventDecl<RendererOwner, EmptyEventParameter, EmptyEventParameter, [ string, number ]>;
        ShowLitFam: EventDecl<MainOwner, number, EmptyEventParameter, string>;
    }
}

export type PackageKeys = Exclude<keyof Registrar, number | symbol>;

type ChannelsHelper<PackageKey extends PackageKeys> =
    {
        [ ChannelType in keyof Registrar[PackageKey] as Extract<ChannelType, string> ]: ChannelType;
    };

type Channels<PackageKey extends PackageKeys> = Extract<keyof ChannelsHelper<PackageKey>, string>;

type FilterByOwnerHelper<
    PackageKey extends PackageKeys,
    Owner extends EventOwner
> =
    {
        [ ChannelType in Channels<PackageKey> ]: OwnerKey extends keyof Registrar[PackageKey][ChannelType]
            ? Registrar[PackageKey][ChannelType][OwnerKey] extends Owner
                ? true
                : false
            : never;
    };

export type FilterByOwner<
    PackageKey extends PackageKeys,
    Owner extends EventOwner
> =
    {
        [ ChannelType in keyof FilterByOwnerHelper<PackageKey, Owner> as
        FilterByOwnerHelper<PackageKey, Owner>[
            Extract<ChannelType, keyof FilterByOwnerHelper<PackageKey, Owner>>
        ] extends true ? ChannelType : never
        ]: Registrar[PackageKey][ChannelType];
    };

export type MainRegistrar<PackageKey extends PackageKeys> = FilterByOwner<PackageKey, MainOwner>;

export type RendererRegistrar<PackageKey extends PackageKeys> = FilterByOwner<PackageKey, RendererOwner>;

type InvokableEventsHelper<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner
> =
    {
        [ ChannelType in keyof FilterByOwner<PackageKey, OwnerType> ]:
        ResponseKey extends keyof Registrar[PackageKey][ChannelType]
            ? ErrorKey extends keyof Registrar[PackageKey][ChannelType]
                ? Registrar[PackageKey][ChannelType][ResponseKey] extends EmptyEventParameter
                    ? Registrar[PackageKey][ChannelType][ErrorKey] extends EmptyEventParameter
                        ? false
                        : true
                    : true
                : never
            : never;
    };

export type InvokableEvents<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner = EventOwner
> =
    {
        [ ChannelType in keyof InvokableEventsHelper<PackageKey, OwnerType> as
        InvokableEventsHelper<PackageKey, OwnerType>[
            Extract<ChannelType, keyof InvokableEventsHelper<PackageKey, OwnerType>>
        ] extends true ? ChannelType : never
        ]: Registrar[PackageKey][ChannelType];
    };

export type SentEvents<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner = EventOwner
> = Exclude<FilterByOwner<PackageKey, OwnerType>, InvokableEvents<PackageKey, OwnerType>>;
