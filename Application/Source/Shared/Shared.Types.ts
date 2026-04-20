/**
 * @file      Shared.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

export type FCardinalDirection =
    | "Up"
    | "Down"
    | "Left"
    | "Right";

export type TFunction<ParameterTypes extends TArray<unknown>, ReturnType> =
    (...Arguments: ParameterTypes) => ReturnType;

export type FNotFunction = Exclude<unknown, (...Arguments: TArray<unknown>) => unknown>;

export type FAxis = "X" | "Y";
