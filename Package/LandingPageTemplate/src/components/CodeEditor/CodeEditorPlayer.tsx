/**
 * @file      CodeEditorPlayer.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { ComponentType } from "react";
import type { PCodeEditorAnimation } from "./CodeEditor.Types";
import dynamic from "next/dynamic";

export const CodeEditorAnimationPlayer: ComponentType<PCodeEditorAnimation> = dynamic(
    async () =>
    {
        /* eslint-disable-next-line @typescript-eslint/typedef */
        const Module = await import("./CodeEditorPlayer.Internal");

        return Module.CodeEditorPlayer;
    },
    {
        ssr: false
    }
);
