/**
 * @file      Initialize.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type FInitializer =
{
    DependencyArray: Array<string>;
    Initializer: Promise<void>;
    IsFulfilled: boolean;
};

export type FInitializers = TRecord<string, FInitializer>;
