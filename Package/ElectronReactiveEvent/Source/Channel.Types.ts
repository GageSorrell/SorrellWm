/* File:      Channel.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, EventOwner } from "./Decl.Types.js";
import type {
    FilterByOwner,
    PackageKeys,
    Registrar,
    RequestKey,
    ResponseKey,
    Values } from "./Internal/index.js";

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

type WithRequestHelper<PackageKey extends PackageKeys> =
    {
        [ Key in keyof Registrar[PackageKey] ]:
        RequestKey extends keyof Registrar[PackageKey][Key]
            ? Registrar[PackageKey][Key][RequestKey] extends EmptyEventParameter
                ? undefined
                : Key
            : never
    };

type WithResponseHelper<PackageKey extends PackageKeys> =
    {
        [ Key in keyof Registrar[PackageKey] ]:
        ResponseKey extends keyof Registrar[PackageKey][Key]
            ? Registrar[PackageKey][Key][ResponseKey] extends EmptyEventParameter
                ? undefined
                : Key
            : never
    };

export namespace Channel
{
    /** Channels whose event declarations define a response type. */
    export type Response<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Exclude<
            Any<PackageKey, Owner>,
            NoResponse<PackageKey, Owner>
        >;
//         Extract<
//             Any<PackageKey, Owner>,
//             Values<WithResponseHelper<PackageKey>>
//         >;

    /** Channels whose event declarations do *not* define a response type. */
    export type NoResponse<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Exclude<
            Any<PackageKey, Owner>,
            Extract<Values<WithResponseHelper<PackageKey>>, string>
        >;

    /**
     * Channels whose event declarations specify a request type.
     *
     * @typeParam PackageKey - The name of the package that imports from `electron-reactive-event`.
     * This string type does not need to literally match the `name` property of your `package.json`, but
     * it is recommended to do so.
     */
    export type Request<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Extract<
            Any<PackageKey, Owner>,
            Extract<Values<WithRequestHelper<PackageKey>>, string>
        >;

    /**
     * Channels whose event declarations do *not* specify a request type.
     *
     * @typeParam PackageKey - The name of the package that imports from `electron-reactive-event`.
     * This string type does not need to literally match the `name` property of your `package.json`, but
     * it is recommended to do so.
     */
    export type NoRequest<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Exclude<
            Any<PackageKey, Owner>,
            Extract<Values<WithRequestHelper<PackageKey>>, string>
        >;

    /**
     * A channel is the (`string`) key of an event declaration property in a registrar,
     * namespaced to your package.
     *
     * @typeParam PackageKey - The name of the package that imports from `electron-reactive-event`.
     * This string type does not need to literally match the `name` property of your `package.json`, but
     * it is recommended to do so.
     */
    export type Any<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Exclude<
            keyof FilterByOwner<PackageKey, Owner>,
            number | symbol
        >;

    /**
     * @typeParam PackageKey - The name of the package that imports from `electron-reactive-event`.
     * This string type does not need to literally match the `name` property of your `package.json`, but
     * it is recommended to do so.
     */
    export type SimpleError<PackageKey extends PackageKeys> = Registrar[PackageKey];
}
