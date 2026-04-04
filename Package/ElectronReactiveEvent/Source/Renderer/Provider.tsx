/* File:      Provider.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PropsWithChildren, ReactNode } from "react";
import type { PackageKeys } from "../Internal";
import type { Keyed, NotKeyed, ReactiveEventHookOptions, ReactiveEventHooks } from "./Hook.Types";

function getReactiveEventHooksKeyed<PackageKey extends PackageKeys>(): Keyed.Hooks<PackageKey>
{
    function useAddListener<>
    return {
        useAddListener
    };
}

function getReactiveEventHooksNotKeyed<PackageKey extends PackageKeys>(): NotKeyed.Hooks<PackageKey>
{

}

export function getReactiveEventHooks<PackageKey extends PackageKeys>(
    Options?: ReactiveEventHookOptions
): ReactiveEventHooks<PackageKey, typeof Options>
{
    if (typeof Options === "object" &&
        Options !== null &&
        ("allowMultipleCallbacksPerChannel" in Options) &&
        Options.allowMultipleCallbacksPerChannel === true
    )
    {
        return getReactiveEventHooksKeyed<PackageKey>();
    }
    else
    {
        return getReactiveEventHooksNotKeyed<PackageKey>();
    }
}

export function ReactiveEventProvider({ children }: PropsWithChildren): ReactNode
{
    return (

    );
}
