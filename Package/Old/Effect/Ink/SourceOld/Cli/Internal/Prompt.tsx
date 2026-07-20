/**
 * @file      Prompt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type Key, Text, useInput } from "ink";
import { useEffect, useState } from "react";
import Chalk from "chalk";
import type { Except } from "type-fest";
import type { ReactNode } from "react";

export type Props =
    {
        /**
         * Text to display when `value` is empty.
         */
        readonly placeholder?: string;

        /**
         * Listen to user's input. Useful in case there are multiple input components
         * at the same time and input must be "routed" to a specific component.
         */
        readonly focus?: boolean; // eslint-disable-line react/boolean-prop-naming

        /**
         * Replace all chars and mask the value. Useful for password inputs.
         */
        readonly mask?: string;

        /**
         * Whether to show cursor and allow navigation inside text input with arrow keys.
         */
        readonly showCursor?: boolean; // eslint-disable-line react/boolean-prop-naming

        /**
         * Highlight pasted text
         */
        readonly highlightPastedText?: boolean; // eslint-disable-line react/boolean-prop-naming

        /**
         * Value to display in a text input.
         */
        readonly value: string;

        /**
         * Function to call when value updates.
         */
        readonly onChange: (value: string) => void;

        /**
         * Function to call when `Enter` is pressed, where first argument is a value of the input.
         */
        readonly onSubmit?: (value: string) => void;
    };

function TextInput({
    value: originalValue,
    placeholder = "",
    focus = true,
    mask,
    highlightPastedText = false,
    showCursor = true,
    onChange,
    onSubmit
}: Props)
{
    const [ state, setState ] = useState({
        cursorOffset: (originalValue || "").length,
        cursorWidth: 0
    });

    const { cursorOffset, cursorWidth } = state;

    useEffect(() =>
    {
        setState((previousState: typeof state) =>
        {
            if (!focus || !showCursor)
            {
                return previousState;
            }

            const newValue: string = originalValue || "";

            if (previousState.cursorOffset > newValue.length - 1)
            {
                return {
                    cursorOffset: newValue.length,
                    cursorWidth: 0
                };
            }

            return previousState;
        });
    }, [ originalValue, focus, showCursor ]);

    const cursorActualWidth: number = highlightPastedText ? cursorWidth : 0;

    const value: string = mask ? mask.repeat(originalValue.length) : originalValue;
    let renderedValue: string = value;
    let renderedPlaceholder: string | undefined = placeholder ? Chalk.grey(placeholder) : undefined;

    // Fake mouse cursor, because it's too inconvenient to deal with actual cursor and ansi escapes
    if (showCursor && focus)
    {
        renderedPlaceholder =
            placeholder.length > 0
                ? Chalk.inverse(placeholder[0]) + Chalk.grey(placeholder.slice(1))
                : Chalk.inverse(" ");

        renderedValue = value.length > 0 ? "" : Chalk.inverse(" ");

        let i: number = 0;

        for (const char of value)
        {
            renderedValue +=
                i >= cursorOffset - cursorActualWidth && i <= cursorOffset
                    ? Chalk.inverse(char)
                    : char;

            i++;
        }

        if (value.length > 0 && cursorOffset === value.length)
        {
            renderedValue += Chalk.inverse(" ");
        }
    }

    useInput(
        (input: string, key: Key) =>
        {
            if (
                key.upArrow ||
				key.downArrow ||
				(key.ctrl && input === "c") ||
				key.tab ||
				(key.shift && key.tab)
            )
            {
                return;
            }

            if (key.return)
            {
                if (onSubmit)
                {
                    onSubmit(originalValue);
                }

                return;
            }

            let nextCursorOffset: number = cursorOffset;
            let nextValue: string = originalValue;
            let nextCursorWidth: number = 0;

            if (key.leftArrow)
            {
                if (showCursor)
                {
                    nextCursorOffset--;
                }
            }
            else if (key.rightArrow)
            {
                if (showCursor)
                {
                    nextCursorOffset++;
                }
            }
            else if (key.backspace || key.delete)
            {
                if (cursorOffset > 0)
                {
                    nextValue =
                        originalValue.slice(0, cursorOffset - 1) +
						originalValue.slice(cursorOffset, originalValue.length);

                    nextCursorOffset--;
                }
            }
            else
            {
                nextValue =
                    originalValue.slice(0, cursorOffset) +
					input +
					originalValue.slice(cursorOffset, originalValue.length);

                nextCursorOffset += input.length;

                if (input.length > 1)
                {
                    nextCursorWidth = input.length;
                }
            }

            if (cursorOffset < 0)
            {
                nextCursorOffset = 0;
            }

            if (cursorOffset > originalValue.length)
            {
                nextCursorOffset = originalValue.length;
            }

            setState({
                cursorOffset: nextCursorOffset,
                cursorWidth: nextCursorWidth
            });

            if (nextValue !== originalValue)
            {
                onChange(nextValue);
            }
        },
        {isActive: focus}
    );

    return (
        <Text>
            {placeholder
                ? value.length > 0
                    ? renderedValue
                    : renderedPlaceholder
                : renderedValue}
        </Text>
    );
}

export default TextInput;

type UncontrolledProps = {
    /**
     * Initial value.
     */
    readonly initialValue?: string;
} & Except<Props, "value" | "onChange">;

export function UncontrolledTextInput({ initialValue = "", ...props }: UncontrolledProps): ReactNode
{
    const [ value, setValue ] = useState(initialValue);

    return (
        <TextInput
            { ...props }
            onChange={ setValue }
            value={ value }
        />
    );
}
