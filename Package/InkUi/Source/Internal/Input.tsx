/**
 * Ink-native input and selection components.
 *
 * @module @sorrell/ink-ui/Internal/Input
 * @internal
 *
 * @file      Input.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export/**
       * Insert a substring.
       *
       * @since 1.0.0
       */
const InsertAt = (Value: string, Offset: number, Insertion: string): string =>
    Value.slice(0, Offset) + Insertion + Value.slice(Offset);

export/**
       * Remove before a substring.
       *
       * @since 1.0.0
       */
const RemoveBefore = (Value: string, Offset: number): string =>
    Offset === 0 ? Value : Value.slice(0, Offset - 1) + Value.slice(Offset);

export/**
       * Remove a substring at a given offset.
       *
       * @since 1.0.0
       */
const RemoveAt = (Value: string, Offset: number): string =>
    Value.slice(0, Offset) + Value.slice(Offset + 1);
