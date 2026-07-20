/**
 * @file      DeclareEvents.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
