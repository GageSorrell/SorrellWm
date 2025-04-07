/* File:      Shared.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

export type FCardinalDirection =
    | "Up"
    | "Down"
    | "Left"
    | "Right";

export type TFunction<TParameterTypes extends Array<unknown>, TReturnType> =
    (...Arguments: TParameterTypes) => TReturnType;

export type FNotFunction = Exclude<unknown, (...Arguments: Array<unknown>) => unknown>;
