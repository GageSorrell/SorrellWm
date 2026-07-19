/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

import type { DependencyList } from "react";
import type { FBox } from "@sorrell/wm-windows";
import type { TInternal } from "./Utility.Types";

export function MakeInternal<Type>(In: Type): TInternal<Type>
{
    return {
        INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: In
    };
};

export function GetInternal<Type>(In: TInternal<Type>): Type
{
    return In.INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
};

export function GetInternalSafe<Type>(In: Type | TInternal<Type>): Type
{
    return IsInternal(In)
        ? In.INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
        : In;
};

export function IsInternal<Type>(In: unknown): In is TInternal<Type>
{
    return (
        typeof In === "object" &&
        In !== null &&
        "INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED" in In
    );
};

export function AppendDependencyList(
    InitialDependencyList: DependencyList,
    ...Dependencies: TArray<unknown>
): DependencyList
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

export function GetBoxFromDomRect({
    height: Height,
    width: Width,
    x: X,
    y: Y
}: DOMRect): FBox
{
    return {
        Height,
        Width,
        X,
        Y
    };
};
