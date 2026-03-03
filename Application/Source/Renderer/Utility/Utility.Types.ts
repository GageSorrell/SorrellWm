/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import type { CSSProperties } from "react";
import type { TRecordNonNullable } from "../../Shared/Utility";

export type TPredicate<Type> = (In: Type) => boolean;

export type FFlexStyle = TRecordNonNullable<Pick<
    CSSProperties,
    | "alignItems"
    | "display"
    | "flexDirection"
    | "justifyContent"
>>;

export type PStyledComponent =
{
    style?: CSSProperties;
};
