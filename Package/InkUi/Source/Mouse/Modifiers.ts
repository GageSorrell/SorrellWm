/**
 * Modifiers types and operations for Ink UI.
 *
 * @module @sorrell/ink-ui/Mouse/Modifiers
 *
 * @file      Modifiers.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export/** The runtime identifier for modifier collections. */
const TypeId = "~sorrell/ink-ui/Mouse/Modifiers" as const;

/** The type of the modifier runtime identifier. */
export type TypeId = typeof TypeId;

/**
 * Keyboard modifiers reported with a mouse event.
 *
 * @category Mouse
 * @since 1.0.0
 */
export interface Modifiers
{
    readonly [ TypeId ]: TypeId;
    readonly Shift: boolean;
    readonly Alt: boolean;
    readonly Control: boolean;
}

const Proto = { [ TypeId ]: TypeId } as const;

export/**
       * Get the modifiers from a raw code.
       *
       * @category Mouse
       * @since 1.0.0
       */
const Modifiers = (RawCode: number): Modifiers =>
{
    const Out = Object.create(Proto);

    Out.Alt = (RawCode & 8) !== 0;
    Out.Control = (RawCode & 16) !== 0;
    Out.Shift = (RawCode & 4) !== 0;

    return Object.freeze(Out);
};
