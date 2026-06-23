/**
 * Utilities for using `react` to render prompts.
 *
 * @module @sorrell/effect-ink/React
 */

/**
 * @file      Prose.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export const TypeIdKey: string = "@sorrell/effect-ink/React";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface FieldProps<EventsType extends object>
{
    readonly OnEvent: (Event: EventsType) => void;
};
