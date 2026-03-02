/* File:      Navigate.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type FNavigateRequest =
{
    Route: string;
    State?: Record<PropertyKey, unknown>;
};
