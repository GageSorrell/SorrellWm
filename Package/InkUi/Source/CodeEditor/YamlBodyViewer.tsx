/**
 * Ink UI component for YAML body viewer.
 *
 * @module @sorrell/ink-ui/CodeEditor/YamlBodyViewer
 *
 * @file      YamlBodyViewer.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Ink from "ink";
import * as React from "react";
import { CodeEditor } from "./CodeEditor.tsx";
import { Overlay } from "../Overlay/Overlay.tsx";
import { useRoutedInput } from "../Interaction/Shortcut.ts";

/** {@inheritDoc YamlEditorOverlay} */
export interface YamlEditorOverlayProps
{
    readonly OnCancel?: Thunk | undefined;
    readonly OnChange?: ((Value: string) => void) | undefined;
    readonly OnSubmit?: ((Value: string) => void) | undefined;
    readonly Title?: string;
    readonly Validate?: ((Value: string) => string | null) | undefined;
    readonly Value: string;
}

export/**
       * Presents an editable YAML document inside a modal overlay.
       *
       * @category CodeEditor
       * @since 1.0.0
       */
const YamlEditorOverlay = ({
    OnCancel,
    OnChange,
    OnSubmit,
    Title = "Edit YAML",
    Validate,
    Value
}: YamlEditorOverlayProps): React.ReactNode =>
{
    useRoutedInput((_Input: string, Key: Ink.Key) =>
    {
        if (Key.escape)
        {
            OnCancel?.();
            return true;
        }
        return false;
    });

    return (
        <Overlay
            Footer="Ctrl+Enter to submit · Escape to cancel"
            Title={ Title }>
            <CodeEditor
                Height={ 12 }
                Language="yaml"
                OnChange={ OnChange }
                OnSubmit={ OnSubmit }
                Validate={ Validate }
                Value={ Value } />
        </Overlay>
    );
};
