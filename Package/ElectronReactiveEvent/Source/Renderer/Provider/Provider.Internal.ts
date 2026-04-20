/**
 * @file      Provider.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type Context, createContext } from "react";
import type { ReactiveEventContext } from "./Provider.Types";
import type { ReactiveEventContextInternal } from "./Provider.Internal.Types";

const EmptyReactiveEventContext: ReactiveEventContext =
    {
        ipcRenderer:
        {
            invoke: undefined,
            off: undefined,
            on: undefined,
            once: undefined,
            send: undefined
        }
    } as unknown as ReactiveEventContext;

const EmptyReactiveEventContextInternal: ReactiveEventContextInternal =
    {
        ...EmptyReactiveEventContext
    };

/* The ESLint rule claims that `ReactiveEventInternalContext` does not have a JSDoc comment, when it does. */
/* eslint-disable jsdoc/require-jsdoc */

/**
 * This is the context used by `electron-reactive-event`.
 *
 * @group Internal
 */
export const ReactiveEventInternalContext: Context<ReactiveEventContextInternal> =
    createContext<ReactiveEventContextInternal>(EmptyReactiveEventContextInternal);
