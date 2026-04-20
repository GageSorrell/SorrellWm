/**
 * @file      Registrar.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { EventDecl } from "..";

declare module "./Registrar.Types.js"
{
    /**
     * Dummy event declarations, which prevent build errors
     * (some types can only be `never` if there are no event declarations
     * that are used by those types).
     */
    export type __Internal__ =
        {
            MainEventRequest: EventDecl<MainOwner, number, never, string>;

            MainEventRequestResponseErrorMessage: EventDecl<MainOwner, number, { foo: string; }, string>;

            MainEmptyEventNoRequestNoResponseNoError: EventDecl<
                MainOwner,
                never,
                never,
                never
            >;

            MainEmptyEventNoRequestNoResponseNoErrorPayload: EventDecl<
                MainOwner,
                never,
                never,
                string
            >;

            MainEmptyEventNoRequestNoResponse: EventDecl<
                MainOwner,
                never,
                never,
                [ string, { foo: string; } ]
            >;

            MainEmptyEventNoRequest: EventDecl<
                MainOwner,
                never,
                { Foo: string; },
                [ string, { Foo: string; } ]
            >;

            MainEmptyEvent: EventDecl<
                MainOwner,
                number,
                { Foo: string; },
                [ string, { Foo: string; } ]
            >;

            RendererEmptyEventNoRequestNoResponseNoError: EventDecl<
                RendererOwner,
                never,
                never,
                never
            >;

            RendererEmptyEventNoRequestNoResponseNoErrorPayload: EventDecl<
                RendererOwner,
                never,
                never,
                string
            >;

            RendererEmptyEventNoRequestNoResponse: EventDecl<
                RendererOwner,
                never,
                never,
                [ string, { foo: string; } ]
            >;

            RendererEmptyEventNoRequest: EventDecl<
                RendererOwner,
                never,
                { Foo: string; },
                [ string, { Foo: string; } ]
            >;

            RendererEmptyEvent: EventDecl<
                RendererOwner,
                number,
                { Foo: string; },
                [ string, { Foo: string; } ]
            >;

            RendererEventRequestResponse: EventDecl<RendererOwner, boolean, never, string>;

            RendererEventErrorOnly: EventDecl<
                RendererOwner,
                never,
                never,
                string
            >;
        };
}
