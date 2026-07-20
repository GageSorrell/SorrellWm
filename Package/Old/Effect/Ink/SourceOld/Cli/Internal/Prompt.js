import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @file      Prompt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Text, useInput } from "ink";
import { useEffect, useState } from "react";
import Chalk from "chalk";
function TextInput({ value: originalValue, placeholder = "", focus = true, mask, highlightPastedText = false, showCursor = true, onChange, onSubmit }) {
    const [state, setState] = useState({
        cursorOffset: (originalValue || "").length,
        cursorWidth: 0
    });
    const { cursorOffset, cursorWidth } = state;
    useEffect(() => {
        setState((previousState) => {
            if (!focus || !showCursor) {
                return previousState;
            }
            const newValue = originalValue || "";
            if (previousState.cursorOffset > newValue.length - 1) {
                return {
                    cursorOffset: newValue.length,
                    cursorWidth: 0
                };
            }
            return previousState;
        });
    }, [originalValue, focus, showCursor]);
    const cursorActualWidth = highlightPastedText ? cursorWidth : 0;
    const value = mask ? mask.repeat(originalValue.length) : originalValue;
    let renderedValue = value;
    let renderedPlaceholder = placeholder ? Chalk.grey(placeholder) : undefined;
    // Fake mouse cursor, because it's too inconvenient to deal with actual cursor and ansi escapes
    if (showCursor && focus) {
        renderedPlaceholder =
            placeholder.length > 0
                ? Chalk.inverse(placeholder[0]) + Chalk.grey(placeholder.slice(1))
                : Chalk.inverse(" ");
        renderedValue = value.length > 0 ? "" : Chalk.inverse(" ");
        let i = 0;
        for (const char of value) {
            renderedValue +=
                i >= cursorOffset - cursorActualWidth && i <= cursorOffset
                    ? Chalk.inverse(char)
                    : char;
            i++;
        }
        if (value.length > 0 && cursorOffset === value.length) {
            renderedValue += Chalk.inverse(" ");
        }
    }
    useInput((input, key) => {
        if (key.upArrow ||
            key.downArrow ||
            (key.ctrl && input === "c") ||
            key.tab ||
            (key.shift && key.tab)) {
            return;
        }
        if (key.return) {
            if (onSubmit) {
                onSubmit(originalValue);
            }
            return;
        }
        let nextCursorOffset = cursorOffset;
        let nextValue = originalValue;
        let nextCursorWidth = 0;
        if (key.leftArrow) {
            if (showCursor) {
                nextCursorOffset--;
            }
        }
        else if (key.rightArrow) {
            if (showCursor) {
                nextCursorOffset++;
            }
        }
        else if (key.backspace || key.delete) {
            if (cursorOffset > 0) {
                nextValue =
                    originalValue.slice(0, cursorOffset - 1) +
                        originalValue.slice(cursorOffset, originalValue.length);
                nextCursorOffset--;
            }
        }
        else {
            nextValue =
                originalValue.slice(0, cursorOffset) +
                    input +
                    originalValue.slice(cursorOffset, originalValue.length);
            nextCursorOffset += input.length;
            if (input.length > 1) {
                nextCursorWidth = input.length;
            }
        }
        if (cursorOffset < 0) {
            nextCursorOffset = 0;
        }
        if (cursorOffset > originalValue.length) {
            nextCursorOffset = originalValue.length;
        }
        setState({
            cursorOffset: nextCursorOffset,
            cursorWidth: nextCursorWidth
        });
        if (nextValue !== originalValue) {
            onChange(nextValue);
        }
    }, { isActive: focus });
    return (_jsx(Text, { children: placeholder
            ? value.length > 0
                ? renderedValue
                : renderedPlaceholder
            : renderedValue }));
}
export default TextInput;
export function UncontrolledTextInput({ initialValue = "", ...props }) {
    const [value, setValue] = useState(initialValue);
    return (_jsx(TextInput, { ...props, onChange: setValue, value: value }));
}
//# sourceMappingURL=Prompt.js.map