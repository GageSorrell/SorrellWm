/**
 * @file      Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type FCliConfig =
    Partial<{
        TagFiles: Array<string>;
        Out: string;
    }>;
