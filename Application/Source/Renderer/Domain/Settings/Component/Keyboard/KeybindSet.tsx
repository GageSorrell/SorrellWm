/**
 * @file      KeybindSet.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ActiveEditingMessage, UseKeybindClasses } from "./Keybind";
import { Body1, Caption1, tokens } from "@fluentui/react-components";
import { type CSSProperties, type ReactNode, useCallback } from "react";
import type { FKeybindPair, PKeybindContainer, PKeybindSet } from "./KeybindSet.Types";
import type { FActionKey } from "../../../../../Shared/Settings";
import type { FKeyId } from "../../../../../Shared/Keyboard.Types";
import type { FSimpleCallback } from "../../../../../Shared";
import { type FluentIconsProps } from "@fluentui/react-icons";
import { GetFlexStyle } from "@/Utility";
import { Key } from "@/Domain/Common";
import { UseKeyboardSettings } from "../../Screen/Keyboard";

const KeybindContainer = ({ ActionKey, Caption, KeyIds }: PKeybindContainer): ReactNode =>
{
    const { ActiveStyle, ReceptiveStyle, UnreceptiveStyle } = UseKeybindClasses();

    const { EditingKeybind, RequestCancel, RequestEditKeybind } = UseKeyboardSettings();

    const IsEditing: boolean = EditingKeybind === ActionKey;

    const onMouseDown: FSimpleCallback = useCallback((): void =>
    {
        if (!IsEditing && EditingKeybind !== ActionKey && EditingKeybind !== undefined)
        {
            return;
        }

        if (IsEditing)
        {
            RequestCancel(ActionKey);
        }

        RequestEditKeybind(ActionKey);
    }, [ ActionKey, EditingKeybind, IsEditing, RequestCancel, RequestEditKeybind ]);

    const className: string = IsEditing
        ? ActiveStyle
        : EditingKeybind === undefined
            ? ReceptiveStyle
            : UnreceptiveStyle;

    const Disabled: boolean = !IsEditing && EditingKeybind !== undefined;

    // if (KeyIds === undefined)
    // {
    //     return [ ];
    // }

    // const KeyIdArray: Array<FKeyId> = Array.isArray(KeyIds)
    //     ? KeyIds
    //     : [ KeyIds ];

    // return KeyIdArray.map((KeyId: FKeyId, InnerIndex: number): ReactNode =>
    // {
    // });

    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("column", "flex-start", "center"),
        gap: tokens.spacingVerticalXS
    };

    return (
        <div style={ RootStyle }>
            <div { ...{ className, onMouseDown } }>
                {
                    KeyIds !== undefined
                        ? Array.isArray(KeyIds)
                            ? KeyIds.map((KeyId: FKeyId, Index: number): ReactNode =>
                            {
                                return (
                                    <Key
                                        key={ `${ KeyId }-${ Index }` }
                                        Small
                                        { ...{ Disabled, KeyId } }
                                    />
                                );
                            })
                            : <Key
                                KeyId={ KeyIds }
                                Small
                                { ...{ Disabled } }
                            />
                        : <div style={ { minHeight: 30, minWidth: 30 } }></div>
                }
            </div>
            {
                Caption && (
                    <Caption1 style={ { color: tokens.colorNeutralForeground2 } }>
                        { Caption }
                    </Caption1>
                )
            }
        </div>
    );
};

export const KeybindSet = ({
    Icon,
    Keybinds,
    Subtitle,
    Title }: PKeybindSet
): ReactNode =>
{
    const InnerRootStyle: CSSProperties =
    {
        ...GetFlexStyle("row", "flex-start", "center"),
        flex: 1,
        gap: tokens.spacingHorizontalM,
        width: "100%"
    };

    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("column", "flex-start", "flex-start"),
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
        ...GetFlexStyle("row", "flex-end", "center"),
        flexWrap: "wrap",
        gap: tokens.spacingHorizontalL
    };

    const CaptionStyle: CSSProperties =
    {
        color: tokens.colorNeutralForeground4,
        textWrap: "nowrap"
    };

    const Caption: ReactNode = (typeof Subtitle === "string")
        ? <Caption1 style={ CaptionStyle }>{ Subtitle }</Caption1>
        : Subtitle;

    const IconStyle: FluentIconsProps["style"] =
    {
        fontSize: "1.5rem"
    };

    const TitleContainerStyle: CSSProperties =
    {
        ...GetFlexStyle("column", "flex-start", "flex-start"),
        flex: 1
    };

    const ActionKeys: Array<FActionKey> = Keybinds.map(({ ActionKey }: FKeybindPair): FActionKey =>
    {
        return ActionKey;
    });

    return (
        <div style={ RootStyle }>
            <div style={ InnerRootStyle }>
                {
                    Icon && <Icon style={ IconStyle }/>
                }
                <div style={ TitleContainerStyle }>
                    <Body1>
                        { Title }
                    </Body1>
                    { Caption }
                </div>
                <div style={ KeybindContainerContainerStyle }>
                    {
                        Keybinds.map((
                            { ActionKey, Caption, KeyIds }: FKeybindPair,
                            Index: number
                        ): ReactNode =>
                        {
                            const ReactKeyPart: string = Array.isArray(KeyIds)
                                ? KeyIds.join("-")
                                : KeyIds || "";

                            return (
                                <KeybindContainer
                                    { ...{ ActionKey, Caption, KeyIds } }
                                    key={ `${ ReactKeyPart }-${ Index }` }
                                />
                            );
                        })
                    }
                </div>
            </div>
            <ActiveEditingMessage { ...{ ActionKeys } }/>
        </div>
    );
};
