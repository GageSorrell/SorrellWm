/* File:      Playground.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TEventDecl } from "./Event.Types";

export type FPlayerId =
    | 0
    | 1
    | 2
    | 3;

export type FTossRequest =
{
    Initiator: FPlayerId;
    IntendedReceiver: FPlayerId;
};

export type FBounce =
    | "NoBounce"
    | "OtherSquare";

export type FNumBounces =
    | 0
    | 1
    | "Many";

export type FTossResponse =
{
    Receiver: FPlayerId;
};

export type FTossErrorMessage =
    | "IllegalNumTosses"
    | "LandedOutOfBounds"
    | "TossOverhanded";

export type FFourSquareToss = TEventDecl<FTossRequest, FTossResponse, FTossErrorMessage>;

export interface IPlaygroundMainRegistrar
{
    Foo: FFourSquareToss;
}

export interface IPlaygroundRendererRegistrar
{
    Toss: FFourSquareToss;
}
