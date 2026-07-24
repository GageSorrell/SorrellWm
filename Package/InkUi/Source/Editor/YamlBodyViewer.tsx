/**
 *
 *
 * @module @sorrell/ink-ui/Editor/YamlBodyViewer
 *
 * @file      YamlBodyViewer.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useRoutedInput } from "../Interaction/Shortcut.ts";
import { Overlay } from "../Overlay/Overlay.tsx";
import { CodeEditor } from "./CodeEditor.tsx";

/** {@inheritDoc YamlEditorOverlay} */
export interface YamlEditorOverlayProps
{
    readonly OnCancel?: (() => void) | undefined;
    readonly OnChange?: ((Value: string) => void) | undefined;
    readonly OnSubmit?: ((Value: string) => void) | undefined;
    readonly Title?: string;
    readonly Validate?: ((Value: string) => string | null) | undefined;
    readonly Value: string;
}

export/**
       * Presents an editable YAML document inside a modal overlay.
       *
       * @category Editor
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
