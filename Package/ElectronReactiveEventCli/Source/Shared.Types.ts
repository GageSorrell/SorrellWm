/* File:      Shared.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    DefaultRenderer,
    ListrDefaultRenderer,
    ListrGetRendererClassFromValue,
    ListrTask,
    ListrTaskWrapper } from "listr2";

export type Wrapper<ContextType> = ListrTaskWrapper<
    ContextType,
    ListrDefaultRenderer,
    ListrDefaultRenderer
>;

export type ListrConstructorTask<ContextType> =
    | ListrTask<
        ContextType,
        ListrGetRendererClassFromValue<typeof DefaultRenderer>,
        ListrGetRendererClassFromValue<typeof DefaultRenderer>>
    | Array<ListrTask<
        ContextType,
        ListrGetRendererClassFromValue<typeof DefaultRenderer>,
        ListrGetRendererClassFromValue<typeof DefaultRenderer>>
    >;

/** The name of the CLI package. */
export type PackageNameType = "electron-reactive-event-cli";
