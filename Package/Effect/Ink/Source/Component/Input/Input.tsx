/**
 * @file      Input.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type Key, Text, useInput } from "ink";
import { type ReactNode, useEffect, useState } from "react";
import Chalk from "chalk";
import type { InputProps } from "./Input.Types.ts";

export function Input({
    focus = true,
    highlightPastedText = false,
    mask,
    onChange,
    onSubmit,
    placeholder = "",
    showCursor = true,
    value: originalValue
}: InputProps): ReactNode
{
    const [ State, SetState ] = useState({
        cursorOffset: (originalValue || "").length,
        cursorWidth: 0
    });

    const { cursorOffset, cursorWidth } = State;

    useEffect(() =>
    {
        SetState((previousState: typeof State) =>
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

            SetState({
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
