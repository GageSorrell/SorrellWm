/**
 * @file      Input.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { Input } from "./Input.tsx";

/**
 * The props type of the {@link Input} component.
 *
 * @property placeholder - The text to display when `value` is empty.
 * @property focus - Listen to user's input.  Useful in case there are multiple input components
 * at the same time and input must be "routed" to a specific component.
 * @property mask - Replace all chars and mask the value.  Useful for password inputs.
 * @property showCursor - Whether to show cursor and allow navigation inside text input with arrow keys.
 * @property highlightPastedText - Highlight pasted text.
 * @property value - Value to display in a text input.
 * @property onChange - Function to call when value updates.
 * @property onSubmit - Function to call when `Enter` is pressed, where first argument is a value
 * of the input.
 */
export type InputProps =
    Readonly<{
        focus?: boolean;
        highlightPastedText?: boolean;
        mask?: string;
        onChange: (value: string) => void;
        onSubmit?: (value: string) => void;
        placeholder?: string;
        showCursor?: boolean;
        value: string;
    }>;
