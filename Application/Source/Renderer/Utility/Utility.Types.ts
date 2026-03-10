/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import type { CSSProperties, FC, ReactNode } from "react";
import type { TRecordNonNullable } from "../../Shared/Utility";

export type TPredicate<Type> = (In: Type) => boolean;

export type TPropsWithChildren<ChildType extends ReactNode = ReactNode | Array<ReactNode>> =
{
    children: ChildType;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type FFunctionComponentTypeMask = { _: "_" };
export type TFunctionalComponent<PropsType extends object = FFunctionComponentTypeMask> = FC<
    PropsType extends FFunctionComponentTypeMask
        ? any
        : PropsType
>;
/* eslint-enable @typescript-eslint/no-explicit-any */

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
