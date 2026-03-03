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

export type TFunction<ParameterTypes extends Array<unknown>, ReturnType> =
    (...Arguments: ParameterTypes) => ReturnType;

export type FNotFunction = Exclude<unknown, (...Arguments: Array<unknown>) => unknown>;
