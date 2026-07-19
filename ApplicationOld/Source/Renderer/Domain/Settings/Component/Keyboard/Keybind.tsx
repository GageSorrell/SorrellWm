/**
 * @file      Keybind.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Body1, Body1Strong, Caption1, makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { type CSSProperties, type ReactNode, useCallback } from "react";
import type { FUseKeybindStyles, FUseKeybindStylesInternal, PActiveEditingMessage } from "./Keybind.Types";
import { type FluentIconsProps, WarningFilled } from "@fluentui/react-icons";
import { GetFlexStyle, type TClassesFrom } from "@sorrell/react";
import type { FKeyId } from "../../../../../Shared/Keyboard.Types";
import type { FSimpleCallback } from "../../../../../Shared";
import { FriendlyNames } from "@/Keybind";
import { Key } from "@/Domain/Common";
import type { PKeybind } from "./Keybind.Types";
import { UseKeyboardSettings } from "../../Screen/Keyboard";

const UseKeybindClassesBase: FUseKeybindStylesInternal = makeStyles({
    ActiveStyle:
    {
        backgroundColor: tokens.colorNeutralBackground1Selected,
        cursor: "pointer"
    },
    BaseStyle:
    {
        ...GetFlexStyle("row", "flex-start", "center"),
        backgroundColor: tokens.colorNeutralBackground1,
        border: "solid #DFE8DC 1px",
        borderRadius: tokens.borderRadiusMedium,
        flexWrap: "nowrap",
        gap: tokens.spacingHorizontalS,
        padding: tokens.spacingVerticalM,
        transitionDuration: "120ms",
        transitionProperty: "background-color",
        transitionTimingFunction: "ease"
    },
    ReceptiveStyle:
    {
        ":hover":
        {
            backgroundColor: tokens.colorNeutralBackground1Hover,
            cursor: "pointer"
        }
    },
    UnreceptiveStyle:
    {
        backgroundColor: tokens.colorNeutralBackgroundDisabled
    }
});

export const UseKeybindClasses = (): FUseKeybindStyles =>
{
    const BaseStyles: TClassesFrom<FUseKeybindStylesInternal> = UseKeybindClassesBase();

    const ActiveStyle: string = mergeClasses(BaseStyles.BaseStyle, BaseStyles.ActiveStyle);
    const ReceptiveStyle: string = mergeClasses(BaseStyles.BaseStyle, BaseStyles.ReceptiveStyle);
    const UnreceptiveStyle: string = mergeClasses(BaseStyles.BaseStyle, BaseStyles.UnreceptiveStyle);

    return {
        ActiveStyle,
        ReceptiveStyle,
        UnreceptiveStyle
    };
};

export const ActiveEditingMessage = ({ ActionKeys }: PActiveEditingMessage): ReactNode =>
{
    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("row", "flex-start", "center"),
        gap: tokens.spacingHorizontalS
    };

    const { EditingKeybind } = UseKeyboardSettings();

    const ShowMessage: boolean = EditingKeybind !== undefined && ActionKeys.includes(EditingKeybind);

    if (!ShowMessage)
    {
        return undefined;
    }

    const FriendlyName: string = EditingKeybind !== undefined ? FriendlyNames[EditingKeybind] : "";

    return (
        <div style={ RootStyle }>
            <WarningFilled
                color={ tokens.colorStatusWarningForeground1 }
                fontSize={ 18 }
            />
            <Body1>
                You are editing the <Body1Strong>{ FriendlyName }</Body1Strong> shortcut.
                Press <Body1Strong>Backspace</Body1Strong> to cancel.
            </Body1>
        </div>
    );
};

/** @deprecated Use KeybindSet. */
// export const Keybind = ({ ActionKey, Icon, KeyId, Subtitle, Title }: PKeybind): ReactNode =>
export const Keybind = ({ ActionKey, Icon, KeyIds, Subtitle, Title }: PKeybind): ReactNode =>
{
    const { ActiveStyle, ReceptiveStyle, UnreceptiveStyle } = UseKeybindClasses();

    const { EditingKeybind, RequestCancel, RequestEditKeybind } = UseKeyboardSettings();

    const IsEditing: boolean = EditingKeybind === ActionKey;

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

    const OnMouseDown: FSimpleCallback = useCallback((): void =>
    {
        if (!IsEditing && EditingKeybind !== ActionKey)
        {
            return;
        }

        if (IsEditing)
        {
            RequestCancel(ActionKey);
        }

        RequestEditKeybind(ActionKey);
    }, [ ActionKey, EditingKeybind, IsEditing, RequestCancel, RequestEditKeybind ]);

    const ContainerClass: string = IsEditing
        ? ActiveStyle
        : EditingKeybind !== undefined
            ? UnreceptiveStyle
            : ReceptiveStyle;

    const Disabled: boolean = !IsEditing && EditingKeybind !== undefined;

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
            <div
                className={ ContainerClass }
                onMouseDown={ OnMouseDown }>
                {
                    KeyIds.map((KeyId: FKeyId, Index: number): ReactNode =>
                    {
                        return (
                            <Key
                                key={ `${ KeyId }-${ Index }` }
                                { ...{ Disabled, KeyId } }
                            />
                        );
                    })
                }
            </div>
        </div>
    );
};
