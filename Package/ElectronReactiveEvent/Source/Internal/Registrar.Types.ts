/* File:      Registrar.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

// @Todo TEMPORARY.
import type { EmptyEventParameter, EventDecl, MainOwner, RendererOwner } from "../Decl.Types";
import type { EventOwner } from "../Decl.Types";
import type { OwnerKey } from "./Decl.Types";

// @TODO TEMPORARY.
// export interface Registrar { }

export interface Registrar
{
    Pickij:
    {
        GetLitFam: EventDecl<"Renderer", boolean, EmptyEventParameter, string>;
        BingBong: EventDecl<"Renderer", EmptyEventParameter, EmptyEventParameter, string>;
        ShowLitFam: EventDecl<"Main", number, EmptyEventParameter, string>;
    }
}

export type PackageKeys = Exclude<keyof Registrar, number | symbol>;

type EventNamesHelper<PackageKey extends PackageKeys> =
    {
        [ EventName in keyof Registrar[PackageKey] as Extract<EventName, string> ]: EventName;
    };

type EventNames<PackageKey extends PackageKeys> = Extract<keyof EventNamesHelper<PackageKey>, string>;

type FilterByOwnerHelper<
    PackageKey extends PackageKeys,
    Owner extends EventOwner
> =
    {
        [ EventName in EventNames<PackageKey> ]: OwnerKey extends keyof Registrar[PackageKey][EventName]
            ? Registrar[PackageKey][EventName][OwnerKey] extends Owner
                ? true
                : false
            : never;
    };

export type FilterByOwner<
    PackageKey extends PackageKeys,
    Owner extends EventOwner
> =
    {
        [ EventName in keyof FilterByOwnerHelper<PackageKey, Owner> as
        FilterByOwnerHelper<PackageKey, Owner>[
            Extract<EventName, keyof FilterByOwnerHelper<PackageKey, Owner>>
        ] extends true ? EventName : never
        ]: Registrar[PackageKey][EventName];
    };

export type MainRegistrar<PackageKey extends PackageKeys> = FilterByOwner<PackageKey, MainOwner>;

export type RendererRegistrar<PackageKey extends PackageKeys> = FilterByOwner<PackageKey, RendererOwner>;
