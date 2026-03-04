/* File:      Focus.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Body1Strong, tokens } from "@fluentui/react-components";
import { type CSSProperties, type ReactNode, useEffect } from "react";
import { CommandContainer, type FCommand, type FCompoundCommand, type FSimpleCommand } from "$/Common";
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
            <Body1Strong>
                { Direction }{" "}Panel &#8226; { NumVertices } Nodes
            </Body1Strong>
        </>
    );
};

const WindowFooter = ({ FocusedWindowTitle }: PWindowFooter): ReactNode =>
{
    /* @TODO Vary the cutoff with the width of the window. */
    const LengthCutoff: number = 40;
    const FocusedWindowTitleTruncated: string = (FocusedWindowTitle !== undefined)
        ? FocusedWindowTitle.length > LengthCutoff
            ? FocusedWindowTitle.slice(0, LengthCutoff) + "…"
            : FocusedWindowTitle
        : "Static Mode (No Window Focused)";

    const TextStyle: CSSProperties =
    {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    };

    return (
        <>
            <WindowHeaderHorizontalRegular fontSize={ 20 }/>
            <Body1Strong style={ TextStyle }>
                { FocusedWindowTitleTruncated }
            </Body1Strong>
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

    const MoveFocusCommand: FCompoundCommand =
    {
        Description: "@TODO",
        Name: `Move Focus (${ GetPreviousDirection() } / ${ GetNextDirection() })`,
        SubCommands:
        [
            {
                Action: [ IsHorizontal ? "Direction.Left" : "Direction.Up" ],
                Callback: MoveFocusPrevious
            },
            {
                Action: [ IsHorizontal ? "Direction.Right" : "Direction.Down" ],
                Callback: MoveFocusNext
            }
        ]
    };

    const StepDownCommand: FSimpleCommand =
    {
        Action: [ "Primary[1]" ],
        Callback: StepDownIntoPanel,
        Description: "@TODO",
        Name: "Step Down into Panel"
    };

    const StepUpCommand: FSimpleCommand =
    {
        Action: [ "Primary[0]" ],
        Callback: StepUpIntoPanel,
        Description: "@TODO",
        Name: "Step Up into Panel"
    };

    const Commands: TArray<FCommand> = [ ];

    if (FocusData?.CanMoveWithinPanel)
    {
        Commands.push(MoveFocusCommand);
    }

    if (FocusData?.CanStepDown)
    {
        Commands.push(StepDownCommand);
    }

    if (FocusData?.CanStepUp)
    {
        Commands.push(StepUpCommand);
    }

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
