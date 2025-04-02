/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import type { CSSProperties } from "react";

export type TMaybeArray<T> = T | Array<T>;

export type TPredicate<T> = (In: T) => boolean;

export type PStyledComponent =
{
    style?: CSSProperties;
};
