/**
 * The Settings window's Home section: the current version, and an update banner when a
 * newer version is published.
 *
 * @module @sorrell/wm/Renderer/SettingsHome
 *
 * @file      SettingsHome.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "./Logging.js";
import { useEffect, useState } from "react";
import type { UpdateStatusDto } from "../Shared/Update.js";
import { VersionMessageBar } from "@sorrell/settings-ui";

export/** Render the current version, and an update banner when a newer version is available. */
const SettingsHome = (): React.JSX.Element =>
{
    const [ Status, SetStatus ] = useState<UpdateStatusDto | null>(null);
    const [ IsDownloading, SetIsDownloading ] = useState<boolean>(false);

    useEffect(() =>
    {
        let IsCancelled = false;

        window.sorrell.update.getStatus()
            .then((Loaded: UpdateStatusDto) =>
            {
                if (!IsCancelled)
                {
                    SetStatus(Loaded);
                }
            })
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not check for updates."
            ));

        return (): void =>
        {
            IsCancelled = true;
        };
    }, [ ]);

    const HandleDownload = (): void =>
    {
        SetIsDownloading(true);

        window.sorrell.update.downloadAndInstall()
            .then((Result: { readonly Success: boolean; }) =>
            {
                if (!Result.Success)
                {
                    SetIsDownloading(false);
                }
            })
            .catch((Cause: unknown) =>
            {
                Logging.ReportRejection("Settings", "Could not download the update.")(Cause);
                SetIsDownloading(false);
            });
    };

    if (Status === null)
    {
        return (
            <VersionMessageBar
                Indeterminate
                IndeterminateTitle="Checking for updates..." />
        );
    }

    return (
        <VersionMessageBar
            { ...(Status.IsUpdateAvailable ? {
                Action: {
                    Label: `Download v${ Status.LatestVersion }`,
                    OnClick: HandleDownload
                }
            } : { }) }
            Indeterminate={ IsDownloading }
            IndeterminateTitle="Downloading update..."
            Title={ `SorrellWm v${ Status.CurrentVersion }` }>
            { Status.IsUpdateAvailable
                ? `A new version, v${ Status.LatestVersion }, is available.`
                : "You're up to date." }
        </VersionMessageBar>
    );
};
