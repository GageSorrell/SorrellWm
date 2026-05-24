/**
 * @file      Config.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** The base type for the default options that a provider can specify. */
export type ManifestOptionsBase =
    Readonly<Partial<{
        GenerateOnSave: boolean;
    }>>;
