/* File:      KeybindSet.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    Body1,
    Caption1,
    tokens } from "@fluentui/react-components";
import { type CSSProperties, type ReactNode, useState } from "react";
import { EditRegular, type FluentIconsProps } from "@fluentui/react-icons";
import { type FKeyId, Key } from "@/Domain/Common";
import type { FActionKey } from "Source/Shared/Settings";
import { GetFlexStyle } from "@/Utility";
import type { PKeybind } from "./KeybindSet.Types";
import type { PKeybindContainer } from "./KeybindDialog.Types";
import { UseKeybindClasses } from "./Keybind";

export const KeybindSet = ({
    ActionKeys,
    Icon,
    KeyIds,
    Subtitle,
    Title }: PKeybind
): ReactNode =>
{
    const { KeyContainerStyle } = UseKeybindClasses();
    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("row", "flex-start", "center"),
        backgroundColor: tokens.colorNeutralBackground1,
        borderColor: "#DFE8DC",
        borderRadius: tokens.borderRadiusMedium,
        borderStyle: "solid",
        borderWidth: 1,
        gap: tokens.spacingHorizontalM,
        padding: tokens.spacingHorizontalM
    };

    const KeybindContainerContainerStyle: CSSProperties =
    {
        ...GetFlexStyle("row", "flex-start", "center"),
        gap: tokens.spacingHorizontalS
    };

    const Caption: ReactNode = (typeof Subtitle === "string")
        ? <Caption1 style={ { color: tokens.colorNeutralForeground4 } }>{ Subtitle }</Caption1>
        : Subtitle;

    const IconStyle: FluentIconsProps["style"] =
    {
        fontSize: "1.5rem"
    };

    const TitleContainerStyle: CSSProperties = GetFlexStyle("column", "flex-start", "flex-start");

    const FillerStyle: CSSProperties =
    {
        flex: 1
    };

    const [ OpenDialog, SetOpenDialog ] = useState<boolean>(false);

    const OnOpenChange = (NewValue: boolean): void =>
    {
        SetOpenDialog((_Old: boolean): boolean =>
        {
            return NewValue;
        });
    };

    const KeybindContainer = (Props: PKeybindContainer): ReactNode =>
    {
        const { KeyId, Subtitle, Title } = Props;
        /* eslint-disable-next-line @typescript-eslint/typedef */

        const onMouseDown = (): void =>
        {

        };

        return (
            <div
                className={ KeyContainerStyle }
                onMouseDown={ onMouseDown }>
                <Key KeyId={ KeyId as FKeyId } />
                <EditRegular
                    color={ tokens.colorNeutralForeground4 }
                    fontSize="1rem"
                />
            </div>
        );
    };

    return (
        <div style={ RootStyle }>
            {
                Icon && <Icon style={ IconStyle }/>
            }
            <div style={ TitleContainerStyle }>
                <Body1>
                    { Title }
                </Body1>
                { Caption }
            </div>
            <div style={ FillerStyle }></div>
            <div style={ KeybindContainerContainerStyle }>
                {
                    KeyIds.map((KeyId: FKeyId, Index: number): ReactNode =>
                    {
                        const ActionKey: FActionKey | undefined = ActionKeys[Index];
                        if (ActionKey !== undefined)
                        {
                            return (
                                <KeybindContainer
                                    { ...{ ActionKey, KeyId, OnOpenChange, OpenDialog, Subtitle, Title } }
                                    key={ `${ KeyId }-${ Index }` }
                                />
                            );
                        }
                        else
                        {
                            return undefined;
                        }
                    })
                }
            </div>
            {/* <KeybindDialog { ...KeybindDialogProps }/> */}
        </div>
    );
};
