/* File:      Event.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FBackendChannelTagged,
    FBackendChannelTagger,
    FChannelTagged,
    FFrontendChannelTagged,
    FFrontendChannelTagger,
    FIpcBackendChannel,
    FIpcChannel,
    FIpcFrontendChannel } from "./EventUtility.Types";

export const IsTagged = (Channel: string): Channel is FChannelTagged =>
{
    const Split: Array<string> = Channel.split("-");
    if (Split.length === 2)
    {
        const Tag: string = Split[0] || "";
        const ChannelName: string = Split[1] || "";

        return /\d/.test(Tag) && !(/\d/.test(ChannelName));
    }
    else
    {
        return false;
    }
};

export const GetUntagged = (Channel: string | symbol): string =>
{
    if (typeof Channel === "string")
    {
        if (IsTagged(Channel))
        {
            return Channel.split("-")[1] || "";
        }
        else
        {
            return Channel;
        }
    }
    else
    {
        return "";
    }
};

export const Tag = (WindowId: number, Channel: FIpcChannel): FChannelTagged =>
{
    return `${ WindowId }-${ Channel }`;
};

export const MakeTagFrontend = (Id: number | undefined): FFrontendChannelTagger =>
{
    return (Channel: FIpcFrontendChannel): FFrontendChannelTagged | undefined =>
    {
        if (Id === undefined)
        {
            return undefined;
        }
        else
        {
            return `${ Id }-${ Channel }`;
        }
    };
};

export const MakeTagBackend = (Id: number | undefined): FBackendChannelTagger =>
{
    return (Channel: FIpcBackendChannel): FBackendChannelTagged | undefined =>
    {
        if (Id === undefined)
        {
            return undefined;
        }
        else
        {
            return `${ Id }-${ Channel }`;
        }
    };
};
