/* File:      Provider.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PromiseCache, ReactiveEventContextInternal } from "./Provider.Internal.Types.js";
import { useCallback, useState, type ReactNode } from "react";
import type { ReactiveEventProviderProps } from "./Provider.Types.js";
import { ReactiveEventInternalContext } from "./Provider.Internal.js";

export function ReactiveEventProvider(
    { children, value }: ReactiveEventProviderProps
): ReactNode
{
    // @TODO Everything (?) left:
    //
    // Wrap the send functions to package the callbacks' return values to be the right shape.
    // By transforming the output of what is *sent*, rather than the listeners, listeners don't
    // have identity/uniqueness problems that come with wrapping them.  Do this for `main` and
    // the `renderer`.
    //
    // Redo the logic for `main` to be like what you wrote for the `renderer`.
    //

    const [ PromiseCache, SetPromiseCache ] = useState<PromiseCache>({ });

    type PutCachedPromiseType = ReactiveEventContextInternal["PutCachedPromise"];
    const PutCachedPromise: PutCachedPromiseType =
        useCallback((
            Events: Record<string, unknown>,
            PromiseFactory: ((Channel: string, Request: unknown) => Promise<unknown>)
        ): Promise<unknown> =>
        {
            const Entries: Array<[ string, unknown ]> = Object.entries(Events);
            function FactoryEntry([ InChannel, InRequest ]: [ string, unknown ]): Promise<unknown>
            {
                return PromiseFactory(InChannel, InRequest);
            }

            function GetEntryHash([ InChannel, InRequest ]: [ string, unknown ]): string
            {
                return JSON.stringify({
                    EntriesLength: Entries.length,
                    InChannel,
                    InRequest
                });
            }



            if (Hash in PromiseCache && PromiseCache[Hash] !== undefined)
            {
                return PromiseCache[Hash];
            }
            else
            {
                const ThisPromise: Promise<unknown> = PromiseFactory();
                SetPromiseCache((Old: PromiseCache): PromiseCache =>
                {
                    return {
                        ...Old,
                        [ Hash ]: ThisPromise
                    };
                });
            }
        }, [ PromiseCache ]);

    const OutValue: ReactiveEventContextInternal =
        {
            ...value,
            PutCachedPromise
        };

    return (
        <ReactiveEventInternalContext.Provider value={ OutValue }>
            { children }
        </ReactiveEventInternalContext.Provider>
    );
}
