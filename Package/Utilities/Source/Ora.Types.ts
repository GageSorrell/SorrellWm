/* File:      Ora.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type ora from "ora";

export type FOraOptions = Extract<Parameters<typeof ora>[0], object>;

export type TOraTaskArgument<Type> =
    | (() => Promise<Type>)
    | Promise<Type>
    | ((SetPersistText: ((In: string) => void)) => Promise<Type>);
