/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import type { CSSProperties, DependencyList } from "react";
import type { FBox } from "@sorrellwm/windows";
import type { FFlexStyle } from "./Utility.Types";

export const Identity = <Type>(...Arguments: TArray<Type>) => Arguments;

export const AppendDependencyList = (
    InitialDependencyList: DependencyList,
    ...Dependencies: TArray<unknown>
): DependencyList =>
{
    const Out: TArray<unknown> = [ ];
    const PushDependency = (Dependency: unknown): void =>
    {
        Out.push(Dependency);
    };

    InitialDependencyList.forEach(PushDependency);
    Dependencies.forEach(PushDependency);

    return Out;
};

export const GetFlexStyle = (
    Direction: NonNullable<CSSProperties["flexDirection"]>,
    JustifyContent: NonNullable<CSSProperties["justifyContent"]>,
    AlignItems: NonNullable<CSSProperties["alignItems"]>,
    Rest: CSSProperties = { }

): FFlexStyle =>
{
    return {
        alignItems: AlignItems,
        display: "flex",
        flexDirection: Direction,
        justifyContent: JustifyContent,
        ...Rest
    };
};

export const GetBoxFromDomRect = ({ height: Height, width: Width, x: X, y: Y }: DOMRect): FBox =>
{
    return {
        Height,
        Width,
        X,
        Y
    };
};
