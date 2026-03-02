/* File:      Focus.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type CSSProperties, type ReactNode, useEffect } from "react";
import { Caption1Strong, tokens } from "@fluentui/react-components";
import { CommandContainer, type FCommand } from "$/Common";
import type { FFocusData, FPanelFocusData, FWindowFocusData } from "../../../../Shared/Event/Focus.Types";
import { Action } from "@/Action";
import type { FFocusChange } from "#/Tree/Tree.Types";
import type { FLogger } from "../../../../Shared/Log.Types";
import { GetLogger } from "@/Log";
import { UseSendIpcEvent } from "@/Event";
import { WindowHeaderHorizontalRegular } from "@fluentui/react-icons";

const Log: FLogger = GetLogger("Focus");

type PPanelFooter = Pick<FFocusData, "Direction"> & FPanelFocusData;
type PWindowFooter = FWindowFocusData;

type PFooter =
    | PPanelFooter
    | PWindowFooter
    | object;

type PPanelIcon = Pick<FFocusData, "Direction">;

const PanelIcon = ({ Direction }: PPanelIcon): ReactNode =>
{
    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        flexDirection: Direction === "Horizontal"
            ? "row"
            : "column",
        justifyContent: "space-between",

        height: "2rem",
        width: "2rem"
    };

    const LeafLongEdgeLength: string = "2rem";
    const LeafShortEdgeLength: string = "0.75rem";

    const LeafStyleBase: CSSProperties =
    {
        height: Direction === "Horizontal"
            ? LeafLongEdgeLength
            : LeafShortEdgeLength,
        width: Direction === "Horizontal"
            ? LeafShortEdgeLength
            : LeafLongEdgeLength
    };

    const LeafOutlineStyle: CSSProperties =
    {
        ...LeafStyleBase,
        borderColor: tokens.colorNeutralForeground1,
        borderWidth: 4
    };

    const LeafFilledStyle: CSSProperties =
    {
        ...LeafStyleBase,
        backgroundColor: tokens.colorNeutralForeground1
    };

    return (
        <div style={ RootStyle }>
            <div style={ LeafFilledStyle }/>
            <div style={ LeafOutlineStyle }/>
        </div>
    );
};

const PanelFooter = ({ Direction, NumVertices }: PPanelFooter): ReactNode =>
{
    return (
        <>
            <PanelIcon { ...{ Direction } }/>
            <Caption1Strong>
                { Direction }{" "}Panel &#8226; { NumVertices } Nodes
            </Caption1Strong>
        </>
    );
};

const WindowFooter = ({ FocusedWindowTitle }: PWindowFooter): ReactNode =>
{
    /* @TODO Vary the cutoff with the width of the window. */
    /* @TODO Display different value when in StaticMode. */
    const LengthCutoff: number = 40;
    const FocusedWindowTitleTruncated: string = (FocusedWindowTitle !== undefined)
        ? FocusedWindowTitle.length > LengthCutoff
            ? FocusedWindowTitle.slice(0, LengthCutoff) + "…"
            : FocusedWindowTitle
        : "Static Mode (No Window Focused)";

    return (
        <>
            <WindowHeaderHorizontalRegular/>
            <Caption1Strong>
                { FocusedWindowTitleTruncated }
            </Caption1Strong>
        </>
    );
};

const Footer = (Props: PFooter): ReactNode =>
{
    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        gap: tokens.spacingHorizontalS,
        justifyContent: "center"
    };

    const ArePanelProps = (In: object): In is PPanelFooter =>
    {
        return "NumVertices" in In;
    };

    return Props !== undefined && (
        <div style={ RootStyle }>
            {
                ArePanelProps(Props)
                    ? PanelFooter(Props)
                    : WindowFooter(Props as PWindowFooter)
            }
        </div>
    );
};

export const Focus = (): ReactNode =>
{
    const { Data: FocusData } = UseSendIpcEvent("GetFocusData", undefined);

    const IsHorizontal: boolean = FocusData !== undefined
        ? FocusData.Direction === "Horizontal"
        : true;

    const MoveFocusPrevious = (): void =>
    {
        ChangeFocus("Previous");
    };

    const MoveFocusNext = (): void =>
    {
        ChangeFocus("Next");
    };

    const GetPreviousDirection = (): string =>
    {
        return IsHorizontal
            ? "Left"
            : "Up";
    };

    const GetNextDirection = (): string =>
    {
        return IsHorizontal
            ? "Right"
            : "Down";
    };

    const StepDownIntoPanel = (): void =>
    {
        ChangeFocus("Down");
    };

    const StepUpIntoPanel = (): void =>
    {
        ChangeFocus("Up");
    };

    const ChangeFocus = (FocusChange: FFocusChange): void =>
    {
        // @TODO Replace with `SendIpcEvent` function.
        window.electron.ipcRenderer.Send("OnChangeFocus", FocusChange);
    };

    useEffect((): void =>
    {
        Log("FocusData is", FocusData);
    }, [ FocusData ]);

    const FooterRootStyle: CSSProperties =
    {
        alignItems: "center",
        bottom: 0,
        display: "flex",
        flexDirection: "row",
        height: 48,
        justifyContent: "center",
        left: 0,
        position: "absolute",
        width: "100vw"
    };

    const Commands: Array<FCommand> =
    [
        {
            Description: "@TODO",
            Name: `Move Focus (${ GetPreviousDirection() } / ${ GetNextDirection() })`,
            SubCommands:
            [
                {
                    Callback: MoveFocusPrevious,
                    Keybind: [ IsHorizontal ? "Direction.Left" : "Direction.Up" ]
                },
                {
                    Callback: MoveFocusNext,
                    Keybind: [ IsHorizontal ? "Direction.Right" : "Direction.Down" ]
                }
            ]
        },
        {
            Callback: StepDownIntoPanel,
            Description: "@TODO",
            Keybind: [ "Primary[1]" ],
            Name: "Step Down into Panel"
        },
        {
            Callback: StepUpIntoPanel,
            Description: "@TODO",
            Keybind: [ "Primary[0]" ],
            Name: "Step Up into Panel"
        }
    ];

    return (
        <>
            <Action>
                <CommandContainer { ...{ Commands } } />
            </Action>
            <div style={ FooterRootStyle }>
                <Footer { ...FocusData }/>
            </div>
        </>
    );
};
