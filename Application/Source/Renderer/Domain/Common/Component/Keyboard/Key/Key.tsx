/* File:      Key.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import { type CSSProperties, type ReactElement, useMemo } from "react";
import type { FLogger } from "../../../../../../Shared";
import { GetLogger } from "@/Log";
import type { PKey } from "./Key.Types";
import { tokens } from "@fluentui/react-components";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Key");

/* eslint-disable sort-keys */
const IsUnicodeCharacter = (Input: string): boolean =>
{
    if (typeof Input !== "string" || Input.length > 1)
    {
        return false;
    }
    else
    {
        const CodePoint: number = Input.codePointAt(0) as number;
        return CodePoint >= 0xE700 && CodePoint <= 0xF800;
    }
};

export const Key = ({ Disabled, KeyId }: PKey): ReactElement =>
{
    // const { Display, Modifier, Side } = Keys[KeyId];
    // const CornerDisplay: string | undefined = useMemo((): string | undefined =>
    // {
    //     if (Modifier !== undefined)
    //     {
    //         return Modifier;
    //     }
    //     else if (Side !== undefined && Side !== "Either")
    //     {
    //         return Side;
    //     }
    //     else
    //     {
    //         return undefined;
    //     }
    // }, [ Modifier, Side ]);

    const DisplayStyle: CSSProperties = useMemo((): CSSProperties =>
    {
        const IsFluentIcon: boolean = IsUnicodeCharacter(KeyId);
        const fontSize: string = "1rem";

        const marginBottom: number = IsFluentIcon
            ? 0
            : 4;

        return {
            color: Disabled ? tokens.colorNeutralBackground1 : tokens.colorNeutralBackgroundDisabled,
            fontFamily: "Segoe Fluent Icons, Segoe UI",
            fontSize,
            marginBottom,
            textWrap: "nowrap"
        };
    }, [ Disabled, KeyId ]);

    // const maxWidth: string | undefined = KeyId.length === 1
    //     ? "2rem"
    //     : undefined;

    const RootStyle: CSSProperties = useMemo((): CSSProperties =>
    {
        const BaseSideLength: number = 30;

        return {
            alignItems: "center",
            backgroundColor: tokens.colorBrandForeground1,
            borderRadius: tokens.borderRadiusMedium,
            // paddingLeft: tokens.spacingHorizontalXS,
            // paddingRight: tokens.spacingHorizontalXS,
            display: "flex",
            height: BaseSideLength,
            justifyContent: "center",
            paddingLeft: KeyId.length > 1 ? 2 : 0,
            paddingRight: KeyId.length > 1 ? 2 : 0,
            maxHeight: BaseSideLength,
            maxWidth: KeyId.length > 1 ? undefined : BaseSideLength,
            minHeight: BaseSideLength,
            minWidth: BaseSideLength,
            width: BaseSideLength
        };
    }, [ KeyId.length ]);

    return (
        <div style={ RootStyle }>
            <span style={ DisplayStyle }>
                { KeyId }
            </span>
        </div>
    );
};
