/**
 * @file      CodeEditorPlayer.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { CodeEditorAnimation } from "./CodeEditor";
import type { PCodeEditorAnimation } from "./CodeEditor.Types";
import { Player } from "@remotion/player";
import type { ReactNode } from "react";

export function CodeEditorPlayer(Props: PCodeEditorAnimation): ReactNode
{
    return (
        <Player
            acknowledgeRemotionLicense
            autoPlay
            clickToPlay={ false }
            component={
                () => <CodeEditorAnimation { ...Props } />
            }
            compositionHeight={ 912 }
            compositionWidth={ 1_516 }
            controls={ false }
            durationInFrames={ 10_000 }
            fps={ 120 }
            initiallyMuted
            loop
            playbackRate={ 0.5 }
            style={ {
                aspectRatio: "1516 / 912",
                // aspectRatio: "3 / 2",
                width: "100%"
            } }
        />
    );
};
