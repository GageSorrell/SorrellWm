/* File:      DeclareEvents.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

export type EventOwnerString = "Main" | "Renderer";

export type EventDeclaration =
    {
        Name: string;
        Owner: EventOwnerString;
    };

export type DeclarationsArray = Array<EventDeclaration>;

export type EventDeclaringModule =
    {
        Declarations: DeclarationsArray;
        Path: string;
    };
