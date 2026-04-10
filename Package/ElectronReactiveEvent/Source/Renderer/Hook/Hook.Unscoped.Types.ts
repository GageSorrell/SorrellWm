/* File:      Hook.Scoped.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/**
 * The options that may be passed to {@link useInvokeEvent}.
 *
 * @typeParam SuspendsType - The type of the {@link suspend} property, which is used to narrow down
 * the correct return type of {@link useInvokeEvent}.
 *
 * @property suspend - Whether {@link useInvokeEvent} should suspend until it receives a response from
 * `main`.  If `true`, then the {@link InvokeResponse} returned will be of type {@link ResponseSync}, *i.e.*,
 * the `isPending` property will be omitted.
 */
export type InvokeOptions<SuspendsType extends boolean = boolean> =
    {
        suspend: SuspendsType;
    };
