/**
 * @file      Motion.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

export type FNetworkConnection =
    {
        saveData?: boolean;
        effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
    };

export type FNavigatorWithHints =
    Navigator &
    {
        connection?: FNetworkConnection;
        deviceMemory?: number;
    };
