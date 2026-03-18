/* File:      Initialize.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type FInitializer =
{
    DependencyArray: Array<string>;
    Initializer: Promise<void>;
    IsFulfilled: boolean;
};

export type FInitializers = TRecord<string, FInitializer>;
