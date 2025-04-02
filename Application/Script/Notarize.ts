/* File:      Notarize.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { build } from "../package.json";
import { notarize } from "@electron/notarize";

interface IContext
{
    appOutDir: string;
    electronPlatformName: string;
    packager:
    {
        appInfo:
        {
            productFilename: string;
        }
    }
};

exports.default = async function notarizeMacos(Context: IContext)
{
    const { electronPlatformName, appOutDir } = Context;
    if (electronPlatformName !== "darwin")
    {
        return;
    }

    if (process.env.CI !== "true")
    {
        console.warn("Skipping notarizing step. Packaging is not running in CI");
        return;
    }

    if (
        !(
            "APPLE_ID" in process.env &&
            "APPLE_ID_PASS" in process.env &&
            "APPLE_TEAM_ID" in process.env
        )
    )
    {
        console.warn(
            "Skipping notarizing step. APPLE_ID, APPLE_ID_PASS, and APPLE_TEAM_ID env variables must be set"
        );
        return;
    }

    const ApplicationName: string = Context.packager.appInfo.productFilename;

    /* @ts-expect-error Unsure. */
    await notarize({
        appBundleId: build.appId,
        appPath: `${ appOutDir }/${ ApplicationName }.app`,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASS,
        teamId: process.env.APPLE_TEAM_ID,
        tool: "notarytool"
    });
};
