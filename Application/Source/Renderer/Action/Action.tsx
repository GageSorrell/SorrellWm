/* File:      Action.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import { Button, tokens } from "@fluentui/react-components";
import { type CSSProperties, type ReactElement } from "react";
import type { FKeyCombination, PAction } from "./Action.Types";
import { KeyCombination } from "@/Domain/Common/Component/Keyboard/KeyCombination";
import { Vk } from "@/Domain/Common/Component/Keyboard/Keyboard";

export const DefaultKeyCombinations: Array<FKeyCombination> =
[
    {
        Callback: () => console.log("Action \"Move\" called by keyboard combination!"),
        Keys: [ Vk["H"] ],
        Name: "Move"
    }
];

const ActionButton = ({ Name, OnSelect }: Omit<PAction, "Keys">): ReactElement =>
{
    const ButtonStyle: CSSProperties =
    {
        // backgroundColor: tokens.colorNeutralBackground3,
        // borderRadius: tokens.borderRadiusMedium,
        // height: "3rem"
    };

    return (
        // <div
        //     onMouseDown={ OnSelect }
        //     style={ ButtonStyle }>
        //     { Name }
        // </div>
        <Button
            onMouseDown={ OnSelect }
            size="large"
            style={ ButtonStyle }>
            { Name }
        </Button>
    );
};

export const Action = ({ OnSelect, Name, Keys }: PAction): ReactElement =>
{
    // @TODO Register keyboard combinations by `react-hotkeys-hook`.

    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        gap: tokens.spacingHorizontalL,
        justifyContent: "space-between"
    };

    return (
        <div style={ RootStyle }>
            <KeyCombination
                { ...{ Keys } }
            />
            <ActionButton
                { ...{ Name, OnSelect } }
            />
        </div>
    );
};

/** @TODO Move these actions somewhere else... */

export const MoveAction = (): ReactElement =>
{
    const OnSelect = (): void =>
    {
        // @TODO
    };

    return (
        <Action
            Keys={ [ 0x48 ] }
            Name="Move"
            { ...{ OnSelect } }
        />
    );
};

export const ResizeAction = (): ReactElement =>
{
    const OnSelect = (): void =>
    {
        // @TODO
    };

    return (
        <Action
            Keys={ [ 0x4A ] }
            Name="Resize"
            { ...{ OnSelect } }
        />
    );
};

export const InsertAction = (): ReactElement =>
{
    const OnSelect = (): void =>
    {
        // @TODO
    };

    return (
        <Action
            Keys={ [ 0x4B ] }
            Name="Insert"
            { ...{ OnSelect } }
        />
    );
};
