/**
 * @file      Provider.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ReactiveEventContext, ReactiveEventProviderProps } from "./Provider.Types";
import { type ReactNode } from "react";
import { ReactiveEventInternalContext } from "./Provider.Internal";

/**
 * This is what provides the `electron-reactive-event` hooks with the
 * necessary IPC functions from
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | IpcRenderer }.
 * This must wrap your application where `electron-reactive-event` is used.
 *
 * @see {@link /guides/getting-started} for more details.
 *
 * @param Props - The children and necessary IPC functions.
 * @param Props.children - The portion of your application which uses `electron-reactive-event`.
 * @param Props.value - The IPC functions needed by `electron-reactive-event`.
 *
 * @returns Your application, equipped with the functionality needed to use `electron-reactive-event`.
 */
export function ReactiveEventProvider(
    { children, value }: ReactiveEventProviderProps
): ReactNode
{
    if (value === undefined)
    {
        const Keys: Array<string> =
            [
                "invoke",
                "off",
                "on",
                "once",
                "send"
            ];

        type WindowType = { ElectronReactiveEventContextUnsafe: ReactiveEventContext; };

        const IsUnsafePreloadUsed: boolean = (
            "ElectronReactiveEventContextUnsafe" in window &&
            typeof window.ElectronReactiveEventContextUnsafe === "object" &&
            window.ElectronReactiveEventContextUnsafe !== null &&
            "ipcRenderer" in window.ElectronReactiveEventContextUnsafe &&
            typeof window.ElectronReactiveEventContextUnsafe.ipcRenderer === "object" &&
            window.ElectronReactiveEventContextUnsafe.ipcRenderer !== null &&
            ((): boolean =>
            {
                const ContextUnsafe: ReactiveEventContext = (window as unknown as WindowType)
                    .ElectronReactiveEventContextUnsafe as ReactiveEventContext;

                const ContextKeys: Array<string> = Object.keys(ContextUnsafe.ipcRenderer);
                return (
                    Keys.every((Key: string): boolean =>
                    {
                        return ContextKeys.includes(Key);
                    }) &&
                    Keys.length === ContextKeys.length &&
                    typeof ContextUnsafe.ipcRenderer.invoke === "function" &&
                    typeof ContextUnsafe.ipcRenderer.off === "function" &&
                    typeof ContextUnsafe.ipcRenderer.on === "function" &&
                    typeof ContextUnsafe.ipcRenderer.once === "function" &&
                    typeof ContextUnsafe.ipcRenderer.send === "function"
                );
            })()
        );

        if (IsUnsafePreloadUsed)
        {
            const ContextUnsafe: ReactiveEventContext = (window as unknown as WindowType)
                .ElectronReactiveEventContextUnsafe as ReactiveEventContext;

            value =
                {
                    ipcRenderer: ContextUnsafe.ipcRenderer
                };
        }
        else
        {
            /* eslint-disable-next-line @stylistic/max-len */
            throw new Error("No value was provided to ReactiveEventProvider, and the unsafe preload script does not appear to be used.  Please provide the necessary IPC functions from IpcRenderer, or use the unsafe preload script.");
        }
    }

    return (
        <ReactiveEventInternalContext.Provider { ...{ value } }>
            { children }
        </ReactiveEventInternalContext.Provider>
    );
}
