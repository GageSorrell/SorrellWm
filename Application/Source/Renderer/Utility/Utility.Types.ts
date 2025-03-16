/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { CSSProperties } from "react";

export type TMaybeArray<T> = T | Array<T>;

export type PStyledComponent =
{
    style?: CSSProperties;
};
