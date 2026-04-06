/* File:      Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EventOwner } from "../Decl.Types.js";

export class ReactiveEventInternalError extends Error
{
    public constructor(_Owner: EventOwner)
    {
        super();
    }
};

export class ReactiveCallbackFailedToRemoveError extends ReactiveEventInternalError
{
    public constructor(Owner: EventOwner, Channel: string, Key: string)
    {
        super(Owner);

        this.name = "ReactiveCallbackFailedToRemoveError";

        /* eslint-disable-next-line @stylistic/max-len */
        this.message = `Tried to remove ${ Owner } callback with channel ${ Channel } and key ${ Key }, but failed despite the callback existing.`;
    }
}

export class ReactiveCallbackChannelKeyNotInUseError extends ReactiveEventInternalError
{
    public constructor(Owner: EventOwner, Channel: string, Key: string)
    {
        super(Owner);

        this.name = "ReactiveCallbackChannelKeyNotInUseError";

        /* eslint-disable-next-line @stylistic/max-len */
        this.message = `Tried to remove ${ Owner } callback with channel ${ Channel } and key ${ Key }, but there were no callbacks registered under channel ${ Channel } having key ${ Key }.`;
    }
};

export class ReactiveCallbackChannelNotInUseError extends ReactiveEventInternalError
{
    public constructor(Owner: EventOwner, Channel: string)
    {
        super(Owner);

        this.name = "ReactiveCallbackChannelNotInUseError";

        /* eslint-disable-next-line @stylistic/max-len */
        this.message = `Tried to remove ${ Owner } callback with channel ${ Channel }, but no registered callbacks were found under this channel.`;
    }
};
