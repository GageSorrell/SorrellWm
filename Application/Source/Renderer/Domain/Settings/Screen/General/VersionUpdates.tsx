/* File:      VersionUpdates.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { ArrowSyncRegular, CheckmarkCircleFilled, type FluentIconsProps } from "@fluentui/react-icons";
import { Body1, Body1Strong, Caption1, Link, tokens } from "@fluentui/react-components";
import { type CSSProperties, type ReactElement, type ReactNode } from "react";
import {
    CompoundSettingSegmentBody,
    CompoundSettingSegmentHeader } from "../../Component/SettingSegment";
import { UseSendIpcEvent, UseSendIpcEventDeferredCallback } from "@/Event";
import { Button } from "@/Domain/Common";
import { CompoundSettingSegment } from "../../Component/CompoundSettingSegment";
import { CompoundSettingSegmentBodyContainer } from "../../Component/CompoundSettingSegmentBodyContainer";
import { type FLogger } from "../../../../../Shared";
import { GetFlexStyle } from "@/Utility";
import { GetLogger } from "@/Log";
import { UseMainStore } from "@/Store";
import { UseSettingsState } from "@/Settings";

const Log: FLogger = GetLogger("VersionUpdates");

const UpdateReady = (): ReactNode =>
{
    const [ Store ] = UseMainStore();
    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("column", "flex-start", "stretch"),
        backgroundColor: "#DFF6DD",
        borderColor: "#DFE8DC",
        borderRadius: tokens.borderRadiusMedium,
        borderStyle: "solid",
        borderWidth: 1,
        gap: tokens.spacingHorizontalM,
        padding: tokens.spacingHorizontalM
    };

    const { Data } = UseSendIpcEvent("CheckForUpdates", undefined);

    Log(`AvailableVersion: ${ Data?.AvailableVersion }.`);

    const TopRowStyle: CSSProperties =
    {
        ...GetFlexStyle("row", "justify-content", "center"),
        flexWrap: "nowrap",
        gap: tokens.spacingHorizontalM
    };

    const [ SendIpcEventDeferredCallback ] = UseSendIpcEventDeferredCallback();

    if (Data?.AvailableVersion === undefined)
    {
        return undefined;
    }
    else
    {
        return (
            <div style={ RootStyle }>
                <div style={ TopRowStyle }>
                    <div>
                        <CheckmarkCircleFilled
                            color={ tokens.colorStatusSuccessForeground1 }
                            fontSize={ 20 }
                            style={ { padding: 2, paddingTop: 8 } }
                        />
                    </div>
                    <Body1Strong style={ { textWrap: "nowrap" } }>
                        An update is ready to install:{"\u2003"}<Body1>{ Data?.AvailableVersion }</Body1>
                    </Body1Strong>
                    <div style={ { width: "100%" } }></div>
                    {/* eslint-disable @stylistic/max-len */}
                    <Link
                        href={ `https://github.com/GageSorrell/SorrellWm/releases/tag/v${ Store?.AppVersion }` }
                        style={ { fontSize: 12, fontWeight: 500, textWrap: "nowrap" } }>
                        See what's new
                    </Link>
                    {/* eslint-enable @stylistic/max-len */}
                </div>
                <div style={ { marginLeft: 36 } }>
                    <Button onMouseDown={ SendIpcEventDeferredCallback("Update", undefined) }>
                        Install now
                    </Button>
                </div>
            </div>
        );
    }
};

export const VersionUpdates = (): ReactNode =>
{
    const [ Store ] = UseMainStore();

    const UpdateIcon = (Props: FluentIconsProps): ReactElement<FluentIconsProps> =>
    {
        return (
            <ArrowSyncRegular
                { ...Props }
                transform="rotate(60 0 0)"
            />
        );
    };

    const LastCheckedUpdateCaption = (): ReactNode =>
    {
        const LastChecked = (): ReactNode =>
        {
            if (typeof Store?.TimeLastCheckedUpdate === "number")
            {
                const GetLastTimeUpdateChecked = (): string =>
                {
                    const LastTimeChecked: number | undefined =
                        (Store?.TimeLastCheckedUpdate === undefined || Store?.TimeLastCheckedUpdate === null)
                            ? undefined
                            : Store?.TimeLastCheckedUpdate;

                    if (LastTimeChecked === undefined)
                    {
                        return "";
                    }
                    else
                    {
                        const DateValue: Date = new Date(LastTimeChecked);

                        return new Intl.DateTimeFormat("en-US", {
                            day: "numeric",
                            hour: "numeric",
                            hour12: true,
                            minute: "2-digit",
                            month: "numeric",
                            second: "2-digit",
                            year: "numeric"
                        }).format(DateValue);
                    }
                };
                return (
                    <Caption1>
                        Last checked: { GetLastTimeUpdateChecked() }
                    </Caption1>
                );
            }
            else
            {
                return undefined;
            }
        };

        const ReleaseNotes = (): ReactNode =>
        {
            const [ SendIpcEventDeferredCallback ] = UseSendIpcEventDeferredCallback();
            /* eslint-disable @stylistic/max-len */
            return Store?.AppVersion !== undefined
                ? (
                    <Link
                        onMouseDown={ SendIpcEventDeferredCallback("OpenWebPage", `https://github.com/GageSorrell/SorrellWm/releases/tag/v${ Store?.AppVersion }`) }
                        style={ { fontSize: 12, fontWeight: 500 } }>
                        Release notes
                    </Link>
                )
                : undefined;
            /* eslint-enable @stylistic/max-len */
        };

        return (
            <>
                <LastChecked />
                <ReleaseNotes />
            </>
        );
    };

    const RootStyle: CSSProperties =
    {
        ...GetFlexStyle("column", "flex-start", "stretch"),
        gap: tokens.spacingVerticalXS
    };

    const TitleStyle: CSSProperties =
    {
        marginBottom: tokens.spacingVerticalXS
    };

    const [ GetControlledProps ] = UseSettingsState();

    return (
        <>
            <div style={ RootStyle }>
                <Body1Strong style={ TitleStyle }>
                    Version & updates
                </Body1Strong>
                <CompoundSettingSegment>
                    <CompoundSettingSegmentHeader
                        Icon={ UpdateIcon }
                        Subtitle={ <LastCheckedUpdateCaption /> }
                        Title={ `v${ Store?.AppVersion }` }
                    />
                    <CompoundSettingSegmentBodyContainer>
                        <CompoundSettingSegmentBody
                            { ...GetControlledProps("ShowUpdateNotifications") }
                            Title="Show notifications for new updates"
                        />
                    </CompoundSettingSegmentBodyContainer>
                </CompoundSettingSegment>
            </div>
            <UpdateReady />
        </>
    );
};
