/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

import type { CSSProperties, DependencyList } from "react";
import type { FFlexStyle, TInternal } from "./Utility.Types";
import type { FBox } from "@sorrellwm/windows";

export const MakeInternal = <Type>(In: Type): TInternal<Type> =>
{
    return {
        INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: In
    };
};

export const GetInternal = <Type>(In: TInternal<Type>): Type =>
{
    return In.INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
};

export const GetInternalSafe = <Type>(In: Type | TInternal<Type>): Type =>
{
    return IsInternal(In)
        ? In.INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
        : In;
};

export const IsInternal = <Type>(In: unknown): In is TInternal<Type> =>
{
    return (
        typeof In === "object" &&
        In !== null &&
        "INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED" in In
    );
};

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
